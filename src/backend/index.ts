import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import puppeteer from "puppeteer-extra";
import { Browser } from "puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AxeBuilder from "@axe-core/puppeteer";
import { getUsers, saveUsers, User } from "./services/userService";
import paymentsRouter from "./routes/payments";
import tokenRouter from "./routes/token";
import { getServerIdentityKey } from "./services/bsvWallet";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ───────────────── Middlewares básicos ─────────────────

// Para parsear JSON
app.use(bodyParser.json());

// CORS: en desarrollo dejamos origen libre
app.use(
    cors({
        origin: true,
        credentials: false,
        exposedHeaders: [
            'x-bsv-payment-derivation-prefix',
            'x-bsv-payment-satoshis-required'
        ]
    })
);

// Logger sencillo de peticiones
app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Configurar el plugin Stealth
puppeteer.use(StealthPlugin());

// Ruta de salud
app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
        ok: true,
        message: "Backend de Access4Vision en marcha",
    });
});

// Endpoint para entregar la identityKey pública del servidor (para derivaciones BRC-29)
app.get('/api/wallet-info', (req: Request, res: Response) => {
    try {
        const identityKey = getServerIdentityKey()
        res.json({ ok: true, identityKey })
    } catch (e: any) {
        res.status(500).json({ ok: false, error: e.message })
    }
});

// Montar routers de pagos y tokens
app.use('/api/payments', paymentsRouter);
app.use('/api/tokens', tokenRouter);

// --- AUTENTICACIÓN SIMPLE (migrada desde server.js)
app.post('/api/login', (req: Request, res: Response) => {
    const { email, password } = req.body as { email?: string; password?: string };
    const users = getUsers();

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // No enviar la contraseña de vuelta
        const { password: _p, ...safeUser } = user as any;
        res.json({ success: true, user: safeUser });
    } else {
        res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }
});

app.post('/api/register', (req: Request, res: Response) => {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Faltan email o password' });
    }

    const users = getUsers();

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: "El usuario ya existe" });
    }

    const newUser: User = {
        id: Date.now(),
        email,
        password,
        hasPaid: false,
    };

    users.push(newUser);
    saveUsers(users);

    const { password: _p, ...safeUser } = newUser as any;
    res.json({ success: true, user: safeUser });
});

// Ruta principal
app.get("/api/page", async (req: Request, res: Response): Promise<any> => {
    const url = req.query.url as string | undefined;

    if (!url) {
        return res
            .status(400)
            .json({ ok: false, error: "Falta el parámetro 'url'." });
    }

    console.log(`Analizando URL: ${url}`);

    let browser: Browser | null = null;

    try {
        // Lanzar navegador con puppeteer-extra
        browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        }) as unknown as Browser; // Casteo necesario a veces con puppeteer-extra + TS

        const page = await browser.newPage();

        await page.goto(url, {
            waitUntil: "networkidle2",
            timeout: 60000, // Aumentado a 60s por si la web es pesada
        });

        // 🔹 Intentar aceptar / cerrar cookies y quitar overlays
        await page.waitForTimeout(2000); // damos un pequeño margen a que salga el banner

        await page.evaluate(() => {
            // 1) Intentar hacer click en algún botón típico de aceptar
            const textosPosibles = ["aceptar", "accept", "consentir", "ok", "entendido"];
            const candidatos = Array.from(
                document.querySelectorAll("button, [role='button'], input[type='button'], input[type='submit']")
            ) as HTMLElement[];

            for (const el of candidatos) {
                const texto = el.innerText?.toLowerCase() || (el.getAttribute("value") || "").toLowerCase();
                if (texto && textosPosibles.some(t => texto.includes(t))) {
                    el.click();
                    break;
                }
            }

            // 2) Eliminar overlays/banners típicos de cookies
            const selectoresCookie = [
                "[id*='cookie']",
                "[class*='cookie']",
                "[id*='consent']",
                "[class*='consent']",
                "[id*='gdpr']",
                "[class*='gdpr']",
                "[aria-label*='cookies']"
            ];
            selectoresCookie.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    // Solo si parecen overlays/baners (no toques cosas pequeñas)
                    const style = window.getComputedStyle(el);
                    if (
                        style.position === "fixed" ||
                        style.position === "sticky" ||
                        style.zIndex === "2147483647"
                    ) {
                        el.remove();
                    }
                });
            });
        });

        // 🔹 1. Datos básicos
        const title = await page.title();
        const html = await page.content();

        const landmarks = await page.evaluate(() => {
            const results: string[] = [];

            const main = document.querySelector("main, [role='main']");
            if (main) results.push("Zona principal de contenido (main)");

            const navs = document.querySelectorAll("nav, [role='navigation']");
            if (navs.length > 0) {
                results.push(`Navegación (${navs.length} bloque/s)`);
            }

            const header = document.querySelector("header, [role='banner']");
            if (header) results.push("Cabecera de la página (header)");

            const footer = document.querySelector("footer, [role='contentinfo']");
            if (footer) results.push("Pie de página (footer)");

            const headings = Array.from(
                document.querySelectorAll("h1, h2, h3, h4, h5, h6")
            ).map((el) => (el as HTMLElement).innerText.trim());

            if (headings.length > 0) {
                results.push("Títulos encontrados:");
                headings.slice(0, 15).forEach((h, index) => {
                    results.push(`  ${index + 1}. ${h}`);
                });
            }

            return results;
        });

        // 🔹 2. Análisis de accesibilidad con Axe
        // AxeBuilder espera una Page de puppeteer estándar, a veces puppeteer-extra requiere 'as any'
        const axe = new AxeBuilder(page as any);
        const axeResults = await axe.analyze();

        const violations = axeResults.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            help: v.help,
        }));

        const isAccessible = violations.length === 0;

        await browser.close();

        // 🔹 3. Respuesta
        return res.json({
            ok: true,
            title,
            html, // Ojo: enviar todo el HTML puede ser muy pesado en JSON
            landmarks,
            accessibility: {
                isAccessible,
                violations,
            },
        });
    } catch (error) {
        console.error("Error analizando la página:", error);

        if (browser) {
            try {
                await browser.close();
            } catch (e) {
                console.error("Error cerrando el navegador:", e);
            }
        }

        return res.status(500).json({
            ok: false,
            error: "No se pudo analizar la página. Comprueba la URL.",
        });
    }
});

// Manejo de errores globales
app.use(
    (
        err: Error,
        _req: Request,
        res: Response,
        _next: NextFunction
    ) => {
        console.error("Error inesperado:", err);
        res.status(500).json({ error: "Error interno en el servidor." });
    }
);

app.listen(PORT, () => {
    console.log(
        `Backend de Access4Vision escuchando en http://localhost:${PORT}`
    );
});
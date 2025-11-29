import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import puppeteer from "puppeteer-extra";
import { Browser } from "puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AxeBuilder from "@axe-core/puppeteer";

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
import puppeteer from "puppeteer";
import AxeBuilder from "@axe-core/puppeteer";

export class AccessibilityChecker {

    // Este método recibe una URL y devuelve el análisis
    async check(url: string) {

        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();

        try {
            await page.setExtraHTTPHeaders({
                "accept-language": "es-ES,es;q=0.9,en;q=0.8",
            });
            await page.goto(url, {
                waitUntil: "networkidle2",
                timeout: 30000
            });

            // Creamos el analizador de accesibilidad (axe)
            const axe = new AxeBuilder(page);


            // Ejecutamos el análisis
            const results = await axe.analyze();

            // Nos quedamos solo con la información importante de cada problema
            const violations = results.violations.map(v => ({
                id: v.id,
                impact: v.impact,          // gravedad del problema
                description: v.description, // descripción
                help: v.help               // consejo de cómo arreglarlo
            }));

            // Si no hay problemas, decimos que es accesible
            const isAccessible = violations.length === 0;

            // Devolvemos un objeto con el resultado
            return {
                url,
                isAccessible,
                violations
            };

        } finally {
            // Cerramos el navegador, pase lo que pase
            await browser.close();
        }
    }
}

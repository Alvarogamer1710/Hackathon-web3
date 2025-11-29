import { Router } from "express";
import { AccessibilityChecker } from "../services/AccessibilityChecker";

const router = Router();
const checker = new AccessibilityChecker();

// GET /api/check?url=https://loquesea.com
router.get("/check", async (req, res) => {
    const url = req.query.url as string;

    // Si no me han pasado ?url= devolvemos error
    if (!url) {
        return res.status(400).json({ error: "Falta el parámetro ?url=" });
    }

    try {
        const result = await checker.check(url);
        // Devolvemos el resultado en formato JSON
        res.json(result);
    } catch (err) {
        res.status(500).json({
            error: "Error analizando la web",
            details: String(err)
        });
    }
});

export default router;

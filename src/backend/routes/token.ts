import { Router } from 'express'
import { paymentMiddleware, authMiddleware } from '../services/paymentService'
import { issueAccessibilityToken } from '../services/tokenService'

const router = Router()

router.post('/issue', paymentMiddleware, async (req: any, res) => {
    try {
        const { pageUrl, score } = req.body
        const identityKey = req.auth?.identityKey

        if (!identityKey) {
            return res.status(400).json({ error: 'Identidad del usuario requerida (firma la petición)' })
        }

        if (!pageUrl) {
            return res.status(400).json({ error: 'URL de la página requerida' })
        }

        console.log(`Emitiendo token para ${pageUrl} a ${identityKey}...`)

        const result = await issueAccessibilityToken(
            identityKey,
            pageUrl,
            score || 100
        )

        res.json({
            success: true,
            message: 'Token de accesibilidad emitido',
            txid: result.txid,
            tokenData: result.tokenData
        })

    } catch (error: any) {
        console.error('Error emitiendo token:', error)
        res.status(500).json({ error: error.message || 'Error interno' })
    }
})

router.get('/my-tokens', authMiddleware, async (req: any, res) => {
    res.json({ message: 'Endpoint para listar tokens (pendiente de implementación)' })
})

export default router

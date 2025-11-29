import { Router } from 'express'
import { authMiddleware, paymentMiddleware } from '../services/paymentService'

const router = Router()

// Orden correcto: primero autenticación, luego pago
router.post('/verify', authMiddleware, paymentMiddleware, (req: any, res) => {
    const paymentInfo = req.payment
    const identity = req.auth?.identityKey

    console.log('💰 Pago recibido:', paymentInfo)
    console.log('👤 De:', identity)

    res.json({
        success: true,
        message: 'Pago verificado correctamente',
        amountPaid: paymentInfo?.satoshisPaid,
        txid: paymentInfo?.txid
    })
})

export default router

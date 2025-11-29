import { createPaymentMiddleware } from '@bsv/payment-express-middleware'
import { createAuthMiddleware } from '@bsv/auth-express-middleware'
import { getWallet } from './bsvWallet'
import { shouldSkipPayment } from '../testConfig'
import { Request, Response, NextFunction } from 'express'

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const wallet = await getWallet()
        const middleware = createAuthMiddleware({
            wallet,
            allowUnauthenticated: true,
            logger: console
        })
        middleware(req, res, next)
    } catch (error) {
        console.error('Error en auth middleware:', error)
        res.status(500).json({ error: 'Internal Server Error in Auth' })
    }
}

export async function paymentMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        // Modo test: saltar pago y simular éxito
        if (shouldSkipPayment()) {
            (req as any).payment = {
                satoshisPaid: 1,
                txid: 'TESTMODE_DUMMY_TXID',
                skipped: true
            }
            return next()
        }
        const wallet = await getWallet()
        const middleware = createPaymentMiddleware({
            wallet,
            // Precio reducido a 1 satoshi para alinearse con UI
            calculateRequestPrice: (_req: any) => 1
        })

        middleware(req, res, next)
    } catch (error) {
        console.error('Error en payment middleware:', error)
        res.status(500).json({ error: 'Internal Server Error in Payment' })
    }
}

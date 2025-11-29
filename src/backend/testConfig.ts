import fs from 'fs'
import path from 'path'

// Prioridad: variable de entorno > archivo test.config.json
export function shouldSkipPayment(): boolean {
    if (process.env.SKIP_PAYMENT === 'true' || process.env.TEST_MODE === 'true') {
        return true
    }
    try {
        const cfgPath = path.join(__dirname, 'test.config.json')
        if (fs.existsSync(cfgPath)) {
            const raw = fs.readFileSync(cfgPath, 'utf-8')
            const data = JSON.parse(raw)
            return !!data.skipPayment
        }
    } catch (_) {
        // Ignorar errores de lectura/parseo
    }
    return false
}

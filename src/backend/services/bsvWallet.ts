import { Wallet, WalletStorageManager, WalletSigner, Services, StorageClient } from '@bsv/wallet-toolbox'
import { PrivateKey, KeyDeriver } from '@bsv/sdk'
import * as dotenv from 'dotenv'

dotenv.config()

// Configuración básica
const NETWORK = process.env.NETWORK === 'test' ? 'test' : 'main'
const STORAGE_URL = process.env.STORAGE_URL || 'https://storage.babbage.systems'

let walletInstance: Wallet | null = null

export async function getWallet(): Promise<Wallet> {
    if (walletInstance) return walletInstance

    const privateKeyHex = process.env.PRIVATE_KEY
    if (!privateKeyHex) {
        throw new Error('PRIVATE_KEY no encontrada en .env. Ejecuta npm run setup-wallet primero.')
    }

    const privateKey = PrivateKey.fromHex(privateKeyHex)
    const keyDeriver = new KeyDeriver(privateKey)

    // Inicializar componentes de Wallet Toolbox
    const storageManager = new WalletStorageManager(keyDeriver.identityKey)
    const signer = new WalletSigner(NETWORK, keyDeriver, storageManager)
    const services = new Services(NETWORK)

    walletInstance = new Wallet(signer, services)

    const client = new StorageClient(walletInstance, STORAGE_URL)
    await client.makeAvailable()
    await storageManager.addWalletStorageProvider(client)

    return walletInstance
}

export function getServerIdentityKey(): string {
    const privateKeyHex = process.env.PRIVATE_KEY
    if (!privateKeyHex) {
        throw new Error('PRIVATE_KEY no encontrada en .env (configúrala).')
    }
    // Derivar la identity key pública (usada para BRC-29 counterparty)
    const privateKey = PrivateKey.fromHex(privateKeyHex)
    const keyDeriver = new KeyDeriver(privateKey)
    return keyDeriver.identityKey.toString()
}

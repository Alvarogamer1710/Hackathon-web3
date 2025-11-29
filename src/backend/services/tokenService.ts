import { PushDrop, Utils } from '@bsv/sdk'
import { getWallet } from './bsvWallet'

export async function issueAccessibilityToken(
    recipientIdentityKey: string,
    pageUrl: string,
    accessibilityScore: number
) {
    const wallet = await getWallet()
    const pushdrop = new PushDrop(wallet)

    const tokenData = JSON.stringify({
        type: 'Access4Vision Certificate',
        url: pageUrl,
        score: accessibilityScore,
        timestamp: Date.now(),
        issuer: 'Access4Vision Hackathon'
    })


    const { ciphertext } = await wallet.encrypt({
        plaintext: Utils.toArray(tokenData, 'utf8'),
        protocolID: [0, 'access-token'],
        keyID: '1',
        counterparty: 'anyone'
    })

    const lockingScript = await pushdrop.lock(
        [ciphertext],
        [0, 'access-token'],
        '1',
        recipientIdentityKey
    )

    const result = await wallet.createAction({
        description: `Emisión de token de accesibilidad para ${pageUrl}`,
        outputs: [
            {
                lockingScript: lockingScript.toHex(),
                satoshis: 1,
                basket: 'access-tokens',
                outputDescription: 'Access4Vision Token'
            }
        ],
        options: {
            randomizeOutputs: false
        }
    })

    return {
        txid: result.txid,
        rawTx: result.tx ? Utils.toBase64(result.tx) : null,
        tokenData
    }
}

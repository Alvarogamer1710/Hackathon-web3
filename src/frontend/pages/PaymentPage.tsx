import React, { useState } from "react";
import { WalletClient, Utils, P2PKH, PublicKey, WalletProtocol } from '@bsv/sdk';

interface PaymentProps {
    onPaymentSuccess: () => void;
    onLogout: () => void;
}

// Protocolo BRC-29 para derivación de claves
const BRC29_PROTOCOL_ID: WalletProtocol = [2, '3241645161d8'];

const PaymentPage: React.FC<PaymentProps> = ({ onPaymentSuccess, onLogout }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    const handleBlockchainPayment = async () => {
        setLoading(true);
        setStatus("Iniciando proceso de pago...");

        try {
            // Hacer petición al backend (en modo test responderá 200, en prod 402)
            setStatus("Contactando con el servidor...");
            let response = await fetch('http://localhost:3001/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            // Si es 200 OK (modo test), el pago fue saltado automáticamente
            if (response.ok) {
                const data = await response.json();
                console.log("Pago exitoso (modo test):", data);
                setStatus("¡Pago confirmado!");
                setTimeout(onPaymentSuccess, 1000);
                return;
            }

            // Si es 402, necesitamos hacer el flujo completo de pago
            if (response.status === 402) {
                setStatus("Se requiere pago real. Conectando wallet...");

                // 1. Conectar con la Wallet del usuario
                const wallet = new WalletClient('json-api', 'localhost');
                console.log("Conectando wallet...");
                const { publicKey: userIdentityKey } = await wallet.getPublicKey({ identityKey: true });
                console.log("Wallet conectada:", userIdentityKey);

                // 2. Extraer parámetros del challenge
                const derivationPrefix = response.headers.get('x-bsv-payment-derivation-prefix');
                const satoshisRequired = parseInt(response.headers.get('x-bsv-payment-satoshis-required') || "1");

                if (!derivationPrefix) throw new Error("El servidor no envió el prefijo de derivación");

                setStatus("Factura recibida. Procesando pago...");

                // 3. Derivar claves de pago usando BRC-29
                const derivationSuffix = Utils.toBase64(Utils.toArray('payment-' + Date.now(), 'utf8'));

                const { publicKey: derivedPublicKey } = await wallet.getPublicKey({
                    protocolID: BRC29_PROTOCOL_ID,
                    keyID: `${derivationPrefix} ${derivationSuffix}`,
                    counterparty: 'anyone',
                    forSelf: false
                });

                // 4. Crear la transacción de pago
                const lockingScript = new P2PKH().lock(PublicKey.fromString(derivedPublicKey).toAddress()).toHex();

                setStatus(`Firmando transacción de ${satoshisRequired} satoshis...`);

                const txResult = await wallet.createAction({
                    outputs: [{
                        lockingScript,
                        satoshis: satoshisRequired,
                        outputDescription: 'Pago Access4Vision Premium'
                    }],
                    description: 'Pago por acceso a lector accesible',
                    options: { randomizeOutputs: false }
                });

                if (!txResult.tx) throw new Error("No se pudo crear la transacción");

                // 5. Reenviar la petición con el pago adjunto
                const paymentHeader = JSON.stringify({
                    derivationPrefix,
                    derivationSuffix,
                    transaction: Utils.toBase64(txResult.tx),
                    senderIdentityKey: userIdentityKey,
                    amount: satoshisRequired
                });

                setStatus("Enviando pago al servidor...");

                response = await fetch('http://localhost:3001/api/payments/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-bsv-payment': paymentHeader
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Pago exitoso:", data);
                    setStatus("¡Pago confirmado!");
                    setTimeout(onPaymentSuccess, 1000);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Error desconocido en el servidor");
                }
            } else {
                // Otro código de error
                const errorData = await response.json();
                throw new Error(errorData.description || errorData.error || "Error desconocido");
            }

        } catch (error: any) {
            console.error("Error en el pago:", error);
            setStatus("Error: " + (error.message || "Fallo en el pago"));
            alert("El pago falló: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Acceso Premium Requerido</h1>
            <p>Para acceder al lector, debes realizar un micropago en BSV.</p>

            <div style={{ margin: "20px", padding: "20px", border: "1px solid #ccc", display: "inline-block", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
                <h3 style={{ color: "#f7931a" }}>Costo: 1 Satoshi</h3>
                <p style={{ fontSize: "0.9em", color: "#666" }}>Micropago instantáneo con BSV</p>

                {loading ? (
                    <div style={{ marginTop: "20px" }}>
                        <div className="spinner" style={{ border: "4px solid #f3f3f3", borderTop: "4px solid #f7931a", borderRadius: "50%", width: "30px", height: "30px", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
                        <p style={{ marginTop: "10px" }}>{status}</p>
                    </div>
                ) : (
                    <button
                        onClick={handleBlockchainPayment}
                        style={{
                            padding: "15px 30px",
                            fontSize: "16px",
                            background: "#f7931a",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "5px",
                            fontWeight: "bold",
                            transition: "background 0.3s"
                        }}
                    >
                        Pagar con Wallet BSV
                    </button>
                )}
            </div>

            <br />
            <button onClick={onLogout} style={{ marginTop: "20px", background: "transparent", border: "none", textDecoration: "underline", cursor: "pointer", color: "#555" }}>
                Volver al Login
            </button>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default PaymentPage;
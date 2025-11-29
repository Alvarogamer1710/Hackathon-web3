// src/frontend/pages/LoginPage.tsx
import React, { useState } from "react";

interface LoginProps {
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            // Llamamos a nuestro backend local
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                // AQUÍ PODRÍAS GUARDAR SI HA PAGADO O NO
                // Ejemplo: localStorage.setItem('hasPaid', data.user.hasPaid);
                onLoginSuccess();
            } else {
                setError("Usuario o contraseña incorrectos");
            }
        } catch (err) {
            setError("Error de conexión con el servidor");
            console.error(err);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
            <h1>Iniciar Sesión</h1>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", width: "300px" }}>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: "10px" }}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: "10px" }}
                />
                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit" style={{ padding: "10px", background: "#007bff", color: "white", border: "none", cursor: "pointer" }}>
                    Entrar
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
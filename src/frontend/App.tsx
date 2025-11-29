/*
import React, { useState } from "react";
// Asegúrate que la ruta de estos imports sea correcta
import { AccessibilityProvider } from "./context/AccessibilityContext";
import HomePage from "./pages/HomePage";
import ReaderPage from "./pages/ReaderPage";
import useAccessibility from "./hooks/useAccessibility";

const AppShell: React.FC = () => {
    // Si la URL viene del backend, asegúrate de que incluya el puerto si es local
    const [url, setUrl] = useState<string | null>(null);
    const { settings } = useAccessibility();

    return (
        <div
            className={
                "app-container" + (settings.highContrast ? " high-contrast" : "")
            }
            style={{ fontSize: `${settings.fontScale}rem` }}
        >
            {url ? (
                <ReaderPage url={url} onBack={() => setUrl(null)} />
            ) : (
                <HomePage onSubmitUrl={(value) => setUrl(value)} />
            )}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AccessibilityProvider>
            <AppShell />
        </AccessibilityProvider>
    );
};

export default App;
*/

// src/frontend/App.tsx
import React, { useState } from "react";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import useAccessibility from "./hooks/useAccessibility";

// Páginas existentes
import HomePage from "./pages/HomePage";
import ReaderPage from "./pages/ReaderPage";

// NUEVAS PÁGINAS (Tendrás que crearlas, ver abajo)
import LoginPage from "./pages/LoginPage";
import PaymentPage from "./pages/PaymentPage";

// Componente Principal de la Lógica de la App (Solo visible si pagó)
const MainContent: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [url, setUrl] = useState<string | null>(null);
    const { settings } = useAccessibility();

    return (
        <div
            className={"app-content " + (settings.highContrast ? "high-contrast" : "")}
            style={{ fontSize: `${settings.fontScale}rem` }}
        >
            <header style={{ padding: "10px", borderBottom: "1px solid #ccc", display: 'flex', justifyContent: 'space-between' }}>
                <span>Access4Vision Pro</span>
                <button onClick={onLogout}>Cerrar Sesión</button>
            </header>

            <main style={{ padding: "20px" }}>
                {url ? (
                    <ReaderPage url={url} onBack={() => setUrl(null)} />
                ) : (
                    <HomePage onSubmitUrl={(value) => setUrl(value)} />
                )}
            </main>
        </div>
    );
};

const AppShell: React.FC = () => {
    // ESTADOS DE ACCESO
    // En una app real, esto vendría de un AuthContext o del Backend
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [hasPaid, setHasPaid] = useState<boolean>(false);

    // 1. Si no está logueado, mostramos Login
    if (!isAuthenticated) {
        return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

    // 2. Si está logueado pero NO ha pagado, mostramos Blockchain Payment
    if (!hasPaid) {
        return (
            <PaymentPage
                onPaymentSuccess={() => setHasPaid(true)}
                onLogout={() => setIsAuthenticated(false)}
            />
        );
    }

    // 3. Si tiene todo, mostramos la App Real
    return <MainContent onLogout={() => setIsAuthenticated(false)} />;
};

const App: React.FC = () => {
    return (
        <AccessibilityProvider>
            <AppShell />
        </AccessibilityProvider>
    );
};

export default App;
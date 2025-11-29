// src/frontend/components/AccessibilityToolbar.tsx
import React from "react";
import useAccessibility from "../hooks/useAccessibility";

const AccessibilityToolbar: React.FC = () => {
    const { settings, increaseFont, decreaseFont, toggleHighContrast } =
        useAccessibility();

    return (
        <div
            className="accessibility-toolbar"
            aria-label="Barra de herramientas de accesibilidad"
        >
            <span>Accesibilidad:</span>
            <button
                type="button"
                onClick={decreaseFont}
                aria-label="Disminuir tamaño del texto"
            >
                A-
            </button>
            <button
                type="button"
                onClick={increaseFont}
                aria-label="Aumentar tamaño del texto"
            >
                A+
            </button>
            <button
                type="button"
                onClick={toggleHighContrast}
                aria-pressed={settings.highContrast}
            >
                Alto contraste
            </button>
        </div>
    );
};

export default AccessibilityToolbar;

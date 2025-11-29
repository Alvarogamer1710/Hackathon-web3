// src/frontend/context/AccessibilityContext.tsx
import React, { createContext, useState } from "react";

export interface AccessibilitySettings {
    fontScale: number;
    highContrast: boolean;
}

export interface AccessibilityContextValue {
    settings: AccessibilitySettings;
    increaseFont: () => void;
    decreaseFont: () => void;
    toggleHighContrast: () => void;
}

export const AccessibilityContext =
    createContext<AccessibilityContextValue | undefined>(undefined);

const MIN_SCALE = 0.9;
const MAX_SCALE = 1.6;
const STEP = 0.1;

interface Props {
    children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<Props> = ({ children }) => {
    const [settings, setSettings] = useState<AccessibilitySettings>({
        fontScale: 1,
        highContrast: false,
    });

    const increaseFont = () => {
        setSettings((prev) => ({
            ...prev,
            fontScale: Math.min(MAX_SCALE, +(prev.fontScale + STEP).toFixed(2)),
        }));
    };

    const decreaseFont = () => {
        setSettings((prev) => ({
            ...prev,
            fontScale: Math.max(MIN_SCALE, +(prev.fontScale - STEP).toFixed(2)),
        }));
    };

    const toggleHighContrast = () => {
        setSettings((prev) => ({
            ...prev,
            highContrast: !prev.highContrast,
        }));
    };

    return (
        <AccessibilityContext.Provider
            value={{ settings, increaseFont, decreaseFont, toggleHighContrast }}
        >
            {children}
        </AccessibilityContext.Provider>
    );
};

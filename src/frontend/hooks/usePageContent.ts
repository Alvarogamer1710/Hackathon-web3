// src/frontend/hooks/usePageContent.ts
import { useEffect, useState } from "react";

export interface PageContentState {
    title: string;
    html: string;
    landmarks: string[];
    loading: boolean;
    error: string | null;
}

// URL base del backend en desarrollo.
// Si cambias el puerto del backend, cambia TAMBIÉN esta constante.
const API_BASE = "http://localhost:3001";

export default function usePageContent(url: string): PageContentState {
    const [title, setTitle] = useState("");
    const [html, setHtml] = useState("");
    const [landmarks, setLandmarks] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!url) return;

        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);

            try {
                const endpoint = `${API_BASE}/api/page?url=${encodeURIComponent(url)}`;
                console.log("Access4Vision → llamando a:", endpoint);

                const response = await fetch(endpoint);

                // Si la conexión falla de verdad (servidor caído, puerto mal, etc.)
                // fetch lanza un TypeError y saltará al catch, NO entra aquí.
                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    const message =
                        (data && (data as any).error) ||
                        `Error del servidor (${response.status})`;
                    throw new Error(message);
                }

                if (cancelled) return;

                setTitle((data as any).title || url);
                setHtml((data as any).html || "");
                setLandmarks(((data as any).landmarks as string[]) || []);
            } catch (err: unknown) {
                if (cancelled) return;

                console.error("Error en usePageContent:", err);

                let message = "Error desconocido al cargar la página.";

                if (err instanceof TypeError) {
                    // Este es el típico "Failed to fetch"
                    message =
                        "No se pudo conectar con el servidor de Access4Vision. Asegúrate de que el backend está encendido (npm run server) y revisa el puerto.";
                } else if (err instanceof Error) {
                    message = err.message;
                }

                setError(message);
                setTitle("");
                setHtml("");
                setLandmarks([]);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        load();


        return () => {
            cancelled = true;
        };
    }, [url]);

    return { title, html, landmarks, loading, error };
}

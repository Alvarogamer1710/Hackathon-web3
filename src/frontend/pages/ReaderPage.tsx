// src/frontend/pages/ReaderPage.tsx
import React from "react";
import AccessibilityToolbar from "../components/AccessibilityToolbar";
import AccessibleViewer from "../components/AccessibleViewer";
import LandmarksList from "../components/LandmarksList";
import SkipLink from "../components/SkipLink";
import usePageContent from "../hooks/usePageContent";

interface ReaderPageProps {
    url: string;
    onBack: () => void;
}

const ReaderPage: React.FC<ReaderPageProps> = ({ url, onBack }) => {
    const { title, html, landmarks, loading, error } = usePageContent(url);

    return (
        <div className="reader-page">
            <SkipLink targetId="main-content" />

            <header className="reader-header">
                <button type="button" onClick={onBack}>
                    ← Volver
                </button>

                <div>
                    <h1>{title || "Visor accesible"}</h1>
                    <p className="reader-url" aria-label={`URL actual: ${url}`}>
                        {url}
                    </p>
                </div>

                <AccessibilityToolbar />
            </header>

            <main id="main-content" className="reader-main">
                <aside
                    className="reader-sidebar"
                    aria-label="Resumen de la estructura de la página"
                >
                    <h2>Marcadores de la página</h2>
                    {loading && <p>Cargando estructura…</p>}
                    {error && <p role="alert">{error}</p>}
                    {!loading && !error && <LandmarksList landmarks={landmarks} />}
                </aside>

                <section
                    className="reader-content"
                    aria-label="Contenido accesible de la página"
                >
                    {loading && <p>Cargando contenido accesible…</p>}
                    {error && (
                        <p role="alert">
                            No se pudo cargar el contenido. Revisa la URL o el backend.
                        </p>
                    )}
                    {!loading && !error && <AccessibleViewer html={html} />}
                </section>
            </main>
        </div>
    );
};

export default ReaderPage;

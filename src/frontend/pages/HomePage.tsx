// src/frontend/pages/HomePage.tsx
import React from "react";
import UrlForm from "../components/UrlForm";
import AccessibilityToolbar from "../components/AccessibilityToolbar";
import SkipLink from "../components/SkipLink";

interface HomePageProps {
    onSubmitUrl: (url: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onSubmitUrl }) => {
    return (
        <div className="home-page">
            <SkipLink targetId="main-content" />

            <header className="home-header">
                <h1>Access4Vision</h1>
                <p>
                    Convierte cualquier página web en una experiencia más accesible para
                    personas ciegas o con baja visión.
                </p>
                <AccessibilityToolbar />
            </header>

            <main id="main-content" className="home-main">
                <section aria-label="Formulario para analizar una página web">
                    <h2>Introduce una URL</h2>
                    <UrlForm onSubmit={onSubmitUrl} />
                </section>
            </main>
        </div>
    );
};

export default HomePage;

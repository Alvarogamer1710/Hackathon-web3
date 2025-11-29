// src/frontend/components/UrlForm.tsx
import React, { useState } from "react";

interface UrlFormProps {
    onSubmit: (url: string) => void;
}

const UrlForm: React.FC<UrlFormProps> = ({ onSubmit }) => {
    const [url, setUrl] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = url.trim();
        if (!trimmed) return;
        onSubmit(trimmed);
    };

    return (
        <form className="url-form" onSubmit={handleSubmit}>
            <label htmlFor="url-input">URL de la página</label>

            <div className="url-form-row">
                <input
                    id="url-input"
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://ejemplo.com"
                />
                <button type="submit">Analizar</button>
            </div>
        </form>
    );
};

export default UrlForm;

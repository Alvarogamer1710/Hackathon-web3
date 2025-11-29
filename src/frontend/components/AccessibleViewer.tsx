// src/frontend/components/AccessibleViewer.tsx
import React from "react";

interface AccessibleViewerProps {
    html: string;
}

const AccessibleViewer: React.FC<AccessibleViewerProps> = ({ html }) => {
    if (!html) {
        return <p>No hay contenido cargado todavía.</p>;
    }

    return (
        <div className="accessible-viewer" role="document">
            {/* Cuidado: esto inserta HTML crudo. El backend debe limpiarlo. */}
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
};

export default AccessibleViewer;

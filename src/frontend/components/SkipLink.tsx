// src/frontend/components/SkipLink.tsx
import React from "react";

interface SkipLinkProps {
    targetId: string;
}

const SkipLink: React.FC<SkipLinkProps> = ({ targetId }) => {
    return (
        <a href={`#${targetId}`} className="skip-link">
            Saltar al contenido principal
        </a>
    );
};

export default SkipLink;

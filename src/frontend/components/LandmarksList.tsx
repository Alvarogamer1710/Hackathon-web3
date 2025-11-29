// src/frontend/components/LandmarksList.tsx
import React from "react";

interface LandmarksListProps {
    landmarks: string[];
}

const LandmarksList: React.FC<LandmarksListProps> = ({ landmarks }) => {
    if (!landmarks || landmarks.length === 0) {
        return <p>No se detectaron landmarks en la página.</p>;
    }

    return (
        <ul className="landmarks-list">
            {landmarks.map((text, index) => (
                <li key={index}>{text}</li>
            ))}
        </ul>
    );
};

export default LandmarksList;

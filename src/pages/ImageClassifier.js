import React, { useState } from 'react';
import classifyImage from './classifyImage';

export default function ImageClassifier() {
    const [predictions, setPredictions] = useState([]);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        const image = new Image();
        const reader = new FileReader();

        reader.onload = async (e) => {
            image.src = e.target.result;
            image.onload = async () => {
                const imagePredictions = await classifyImage(image);
                setPredictions(imagePredictions);
            };
        };

        reader.readAsDataURL(file);
    };

    return (
        <div className="image-classifier">
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mb-4"
            />
            <ul>
                {predictions.map((prediction, index) => (
                    <li key={index} className="mb-2">{prediction}</li>
                ))}
            </ul>
        </div>
    );
}

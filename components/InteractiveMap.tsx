import React, { useState, useRef } from 'react';
import type { MapPoint } from '../types';

interface InteractiveMapProps {
  imageUrl: string;
  points: MapPoint[];
  altText: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ imageUrl, points, altText }) => {
  const [activePoint, setActivePoint] = useState<MapPoint | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const handlePointClick = (point: MapPoint, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent closing when clicking the same point again
    setActivePoint(point);
  };

  const handleMapClick = () => {
    setActivePoint(null);
  };

  return (
    <div 
        ref={mapRef} 
        onClick={handleMapClick}
        className="relative mt-6 border-4 border-green-200 rounded-lg overflow-hidden shadow-lg w-full cursor-pointer aspect-[4/3] bg-stone-100"
    >
      <img 
        src={imageUrl} 
        alt={altText} 
        className="absolute inset-0 w-full h-full object-cover" 
        onError={(e) => { e.currentTarget.style.display = 'none'; }} // Hide broken image icon on error
      />

      {points.map((point) => (
        <React.Fragment key={point.id}>
          <button
            onClick={(e) => handlePointClick(point, e)}
            className="absolute w-6 h-6 md:w-8 md:h-8 -translate-x-1/2 -translate-y-1/2 bg-lime-500 text-white font-bold rounded-full flex items-center justify-center shadow-md hover:bg-lime-400 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            style={{
              left: `${point.coords.x}%`,
              top: `${point.coords.y}%`,
            }}
            aria-label={`Location ${point.id}: ${point.name}`}
          >
            {point.id}
          </button>
          
          {activePoint && activePoint.id === point.id && (
            <div
              className="absolute -translate-x-1/2 p-2 px-3 bg-gray-800 text-white text-sm rounded-md shadow-lg whitespace-nowrap z-10 pointer-events-none transition-opacity duration-200"
              style={{
                left: `${point.coords.x}%`,
                top: `${point.coords.y}%`,
                transform: `translate(-50%, -150%)`, // Position tooltip above the dot
              }}
            >
              {point.name}
              {/* Tooltip arrow */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-800 -mb-2"></div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
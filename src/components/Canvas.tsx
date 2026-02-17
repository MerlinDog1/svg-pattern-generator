import { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface CanvasProps {
  width: number; // Actual pixel width for rendering
  height: number; // Actual pixel height for rendering
  unit: 'px' | 'mm';
  displayWidth: number; // Display value in selected unit
  displayHeight: number; // Display value in selected unit
  svgContent: string;
}

export function Canvas({ width, height, unit, displayWidth, displayHeight, svgContent }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Reset view when dimensions change
    resetView();
  }, [width, height]);

  const resetView = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 48;
      const containerHeight = containerRef.current.clientHeight - 48;
      const scaleX = containerWidth / width;
      const scaleY = containerHeight / height;
      const scale = Math.min(scaleX, scaleY, 1);
      setZoom(scale);
      setPan({ x: 0, y: 0 });
    }
  };

  const handleZoomIn = () => {
    setZoom((z) => Math.min(z * 1.2, 5));
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(z / 1.2, 0.1));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((z) => Math.min(Math.max(z * delta, 0.1), 5));
  };

  return (
    <div
      ref={containerRef}
      className="bg-white overflow-hidden w-full relative"
      style={{ 
        height: '60vh',
        minHeight: '400px',
        cursor: isDragging ? 'grabbing' : 'grab' 
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Canvas Controls */}
      <div className="absolute bottom-6 right-6 flex flex-wrap gap-2 z-10 max-w-[90vw]">
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-10 h-10 bg-neutral-100 rounded-md shadow-sm hover:bg-neutral-50 
                     transition-colors flex items-center justify-center"
          title="Zoom Out"
        >
          <ZoomOut size={20} className="text-neutral-700" />
        </button>
        <div className="px-3 h-10 bg-neutral-100 rounded-md shadow-sm flex items-center">
          <span className="text-small font-mono text-neutral-900">
            {Math.round(zoom * 100)}%
          </span>
        </div>
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-10 h-10 bg-neutral-100 rounded-md shadow-sm hover:bg-neutral-50 
                     transition-colors flex items-center justify-center"
          title="Zoom In"
        >
          <ZoomIn size={20} className="text-neutral-700" />
        </button>
        <button
          type="button"
          onClick={resetView}
          className="w-10 h-10 bg-neutral-100 rounded-md shadow-sm hover:bg-neutral-50 
                     transition-colors flex items-center justify-center"
          title="Reset View"
        >
          <Maximize2 size={20} className="text-neutral-700" />
        </button>
      </div>

      {/* Pattern Preview */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px)`,
        }}
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center',
          }}
        >
          <div
            className="bg-white border border-neutral-200 shadow-md"
            style={{
              width: `${width}px`,
              height: `${height}px`,
            }}
          >
            <svg
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: 'block' }}
            >
              <rect width="100%" height="100%" fill="white" />
              <g dangerouslySetInnerHTML={{ __html: svgContent }} />
            </svg>
          </div>
        </div>
      </div>

      {/* Dimension Label */}
      <div className="absolute top-6 left-6 px-3 py-2 bg-neutral-100 rounded-md shadow-sm">
        <span className="text-small font-mono text-neutral-700">
          {displayWidth} × {displayHeight} {unit}
        </span>
      </div>
    </div>
  );
}

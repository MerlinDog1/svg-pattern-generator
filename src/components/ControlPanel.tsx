import { PatternConfig, PatternParameter } from '../types/patterns';
import { SVGUpload } from './SVGUpload';

interface ControlPanelProps {
  patterns: PatternConfig[];
  selectedPattern: string;
  onPatternChange: (patternId: string) => void;
  canvasWidth: number;
  canvasHeight: number;
  unit: 'px' | 'mm';
  tileSize: number;
  onCanvasWidthChange: (width: number) => void;
  onCanvasHeightChange: (height: number) => void;
  onUnitChange: (unit: 'px' | 'mm') => void;
  onTileSizeChange: (size: number) => void;
  patternParams: Record<string, any>;
  onPatternParamChange: (paramId: string, value: any) => void;
  onSVGUpload: (svgFiles: File[]) => void;
}

export function ControlPanel({
  patterns,
  selectedPattern,
  onPatternChange,
  canvasWidth,
  canvasHeight,
  unit,
  tileSize,
  onCanvasWidthChange,
  onCanvasHeightChange,
  onUnitChange,
  onTileSizeChange,
  patternParams,
  onPatternParamChange,
  onSVGUpload,
}: ControlPanelProps) {
  const currentPattern = patterns.find((p) => p.id === selectedPattern);

  // Debug logging for patterns received
  console.log('🎛️ ControlPanel received patterns:', {
    total: patterns.length,
    categories: [...new Set(patterns.map(p => p.category))],
    customPatterns: patterns.filter(p => p.category === 'Custom Patterns').map(p => ({ id: p.id, name: p.name }))
  });

  // Group patterns by category
  const patternsByCategory = patterns.reduce((acc, pattern) => {
    if (!acc[pattern.category]) {
      acc[pattern.category] = [];
    }
    acc[pattern.category].push(pattern);
    return acc;
  }, {} as Record<string, PatternConfig[]>);

  // Debug logging for grouped patterns
  console.log('📂 ControlPanel grouped patterns by category:', {
    categories: Object.keys(patternsByCategory),
    customCategoryCount: patternsByCategory['Custom Patterns']?.length || 0,
    customPatterns: patternsByCategory['Custom Patterns']?.map(p => p.name) || []
  });

  const renderParameter = (param: PatternParameter) => {
    const value = patternParams[param.id] ?? param.default;

    if (param.type === 'slider') {
      return (
        <div key={param.id} className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-body text-neutral-700">{param.label}</label>
            <span className="text-body-medium font-mono text-neutral-900">{value}</span>
          </div>
          <input
            type="range"
            min={param.min}
            max={param.max}
            step={param.step}
            value={value}
            onChange={(e) => onPatternParamChange(param.id, parseFloat(e.target.value))}
            className="w-full accent-primary-500 touch-manipulation"
          />
        </div>
      );
    }

    if (param.type === 'number') {
      return (
        <div key={param.id} className="space-y-2">
          <label className="text-body text-neutral-700">{param.label}</label>
          <input
            type="number"
            min={param.min}
            max={param.max}
            step={param.step}
            value={value}
            onChange={(e) => onPatternParamChange(param.id, parseInt(e.target.value))}
            className="w-full h-12 px-3 bg-neutral-100 border border-neutral-200 rounded-md 
                     font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500
                     touch-manipulation"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full bg-bg-surface border-t border-neutral-200">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pattern Selection */}
          <div className="space-y-3">
            <h2 className="text-heading-md font-semibold text-neutral-900">Pattern</h2>
            <select
              value={selectedPattern}
              onChange={(e) => onPatternChange(e.target.value)}
              className="w-full h-12 px-4 bg-neutral-100 border border-neutral-200 rounded-md 
                       text-body text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {Object.entries(patternsByCategory).map(([category, categoryPatterns]) => (
                <optgroup key={category} label={category}>
                  {categoryPatterns.map((pattern) => (
                    <option key={pattern.id} value={pattern.id}>
                      {pattern.name} {'★'.repeat(pattern.complexity)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Canvas Settings */}
          <div className="space-y-3">
            <h2 className="text-heading-md font-semibold text-neutral-900">Canvas Size</h2>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <label className="text-body text-neutral-700">Width ({unit})</label>
                <input
                  type="number"
                  value={canvasWidth}
                  onChange={(e) => onCanvasWidthChange(parseInt(e.target.value) || 0)}
                  className="w-full h-12 px-3 bg-neutral-100 border border-neutral-200 rounded-md 
                           font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-body text-neutral-700">Height ({unit})</label>
                <input
                  type="number"
                  value={canvasHeight}
                  onChange={(e) => onCanvasHeightChange(parseInt(e.target.value) || 0)}
                  className="w-full h-12 px-3 bg-neutral-100 border border-neutral-200 rounded-md 
                           font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-body text-neutral-700">Tile Size</label>
              <input
                type="number"
                value={tileSize}
                onChange={(e) => onTileSizeChange(parseInt(e.target.value) || 0)}
                className="w-full h-12 px-3 bg-neutral-100 border border-neutral-200 rounded-md 
                         font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Unit Toggle and Pattern Parameters */}
          <div className="space-y-3">
            <h2 className="text-heading-md font-semibold text-neutral-900">Settings</h2>
            
            {/* Unit Toggle */}
            <div className="space-y-2">
              <label className="text-body text-neutral-700">Unit</label>
              <div className="flex bg-neutral-100 border border-neutral-200 rounded-md overflow-hidden w-full">
                <button
                  type="button"
                  onClick={() => onUnitChange('px')}
                  className={`flex-1 h-12 text-body font-medium transition-colors ${
                    unit === 'px' ? 'bg-primary-500 text-white' : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  Pixels (px)
                </button>
                <button
                  type="button"
                  onClick={() => onUnitChange('mm')}
                  className={`flex-1 h-12 text-body font-medium transition-colors ${
                    unit === 'mm' ? 'bg-primary-500 text-white' : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  Millimeters (mm)
                </button>
              </div>
            </div>

            {/* Pattern Parameters */}
            {currentPattern && currentPattern.parameters.length > 0 && (
              <div className="space-y-3">
                {currentPattern.parameters.map((param) => renderParameter(param))}
              </div>
            )}
          </div>
        </div>

        {/* SVG Upload Section - Full Width */}
        <div className="mt-6">
          <h2 className="text-heading-md font-semibold text-neutral-900 mb-4">Upload Custom SVG</h2>
          <SVGUpload onSVGUpload={onSVGUpload} />
        </div>

        {/* Pattern Info - Full Width */}
        {currentPattern && (
          <div className="mt-6 space-y-3">
            <h2 className="text-heading-md font-semibold text-neutral-900">Pattern Info</h2>
            <div className="p-4 bg-neutral-100 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-body text-neutral-700">{currentPattern.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-small text-neutral-500">Complexity:</span>
                  <span className="text-body-medium text-neutral-900">
                    {'★'.repeat(currentPattern.complexity)}{'☆'.repeat(4 - currentPattern.complexity)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

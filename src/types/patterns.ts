export interface PatternConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  complexity: number; // 1-4 stars
  parameters: PatternParameter[];
}

export interface PatternParameter {
  id: string;
  label: string;
  type: 'number' | 'slider' | 'select' | 'toggle';
  min?: number;
  max?: number;
  step?: number;
  default: number | string | boolean;
  options?: { value: string | number; label: string }[];
}

export interface CanvasSettings {
  width: number;
  height: number;
  unit: 'px' | 'mm';
  tileSize: number;
}

export interface PatternState {
  selectedPattern: string;
  canvasSettings: CanvasSettings;
  patternParameters: Record<string, any>;
}

export interface CustomPattern extends Omit<PatternConfig, 'id' | 'category'> {
  id: string;
  category: 'Custom Patterns';
  svgContent: string;
  originalFileName: string;
  uploadTimestamp: number;
}

export interface CustomPatternUpload {
  name: string;
  svgContent: string;
  originalFileName: string;
}

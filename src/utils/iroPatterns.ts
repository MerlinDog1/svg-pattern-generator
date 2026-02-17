export interface IroPattern {
  id: string;
  name: string;
  width: number;
  height: number;
  viewBoxHeight: number;
  mode: 'stroke' | 'fill' | 'stroke-join' | 'svg';
  svgPath: string;
  tags: string[];
}

// Clean and prepare Iro SVG paths for rendering
function cleanIroSVG(svgPath: string, mode: string): string {
  let cleaned = svgPath;
  
  // Ensure black fill/stroke based on mode
  if (mode === 'stroke' || mode === 'stroke-join') {
    // Set stroke to black, no fill
    if (!cleaned.includes('stroke=')) {
      cleaned = cleaned.replace(/<path /g, '<path stroke="black" fill="none" ');
      cleaned = cleaned.replace(/<circle /g, '<circle stroke="black" fill="none" ');
      cleaned = cleaned.replace(/<rect /g, '<rect stroke="black" fill="none" ');
    } else {
      cleaned = cleaned.replace(/stroke="[^"]*"/g, 'stroke="black"');
      cleaned = cleaned.replace(/stroke='[^']*'/g, "stroke='black'");
      cleaned = cleaned.replace(/fill="[^"]*"/g, 'fill="none"');
      cleaned = cleaned.replace(/fill='[^']*'/g, "fill='none'");
    }
  } else if (mode === 'fill') {
    // Set fill to black
    if (!cleaned.includes('fill=')) {
      cleaned = cleaned.replace(/<path /g, '<path fill="black" stroke="none" ');
      cleaned = cleaned.replace(/<circle /g, '<circle fill="black" stroke="none" ');
      cleaned = cleaned.replace(/<rect /g, '<rect fill="black" stroke="none" ');
    } else {
      cleaned = cleaned.replace(/fill="[^"]*"/g, 'fill="black"');
      cleaned = cleaned.replace(/fill='[^']*'/g, "fill='black'");
    }
  } else if (mode === 'svg') {
    // Keep original styling but ensure black
    if (!cleaned.includes('fill=') && !cleaned.includes('stroke=')) {
      cleaned = cleaned.replace(/<path /g, '<path fill="black" stroke="none" ');
      cleaned = cleaned.replace(/<circle /g, '<circle fill="black" stroke="none" ');
      cleaned = cleaned.replace(/<rect /g, '<rect fill="black" stroke="none" ');
    }
  }
  
  return cleaned;
}

export async function loadIroPatterns(): Promise<IroPattern[]> {
  try {
    const response = await fetch('/iro_patternfills.json');
    const data = await response.json();
    return data.patterns || [];
  } catch (error) {
    console.error('Failed to load Iro patterns:', error);
    return [];
  }
}

export function generateIroPattern(
  pattern: IroPattern,
  canvasWidth: number,
  canvasHeight: number,
  scale: number = 1,
  strokeWidth: number = 2
): string {
  const tileWidth = pattern.width * scale;
  const tileHeight = pattern.height * scale;
  
  const cols = Math.ceil(canvasWidth / tileWidth) + 1;
  const rows = Math.ceil(canvasHeight / tileHeight) + 1;
  
  // Apply stroke-width for stroke modes
  let svgContent = cleanIroSVG(pattern.svgPath, pattern.mode);
  if (pattern.mode === 'stroke' || pattern.mode === 'stroke-join') {
    svgContent = svgContent.replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`);
    if (!svgContent.includes('stroke-width=')) {
      svgContent = svgContent.replace(/<path /g, `<path stroke-width="${strokeWidth}" `);
      svgContent = svgContent.replace(/<circle /g, `<circle stroke-width="${strokeWidth}" `);
      svgContent = svgContent.replace(/<rect /g, `<rect stroke-width="${strokeWidth}" `);
    }
  }
  
  // Simple tiling approach
  let result = '';
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * tileWidth;
      const y = row * tileHeight;
      
      result += `<g transform="translate(${x}, ${y}) scale(${scale})">`;
      result += svgContent;
      result += '</g>';
    }
  }
  
  return result;
}
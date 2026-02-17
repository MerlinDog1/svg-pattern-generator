export interface TetoCustomPattern {
  id: string;
  name: string;
  width: number;
  height: number;
  svgPath: string;
  tags: string[];
  subcategory: string;
}

export async function loadTetoCustomPatterns(): Promise<TetoCustomPattern[]> {
  try {
    const response = await fetch('/teto_custom_patterns.json');
    const data = await response.json();
    return data.patterns || [];
  } catch (error) {
    console.error('Error loading Teto custom patterns:', error);
    return [];
  }
}

export function generateTetoCustomPattern(
  pattern: TetoCustomPattern,
  canvasWidth: number,
  canvasHeight: number,
  scale: number = 1,
  strokeWidth: number = 2
): string {
  const tileWidth = pattern.width * scale;
  const tileHeight = pattern.height * scale;
  
  const cols = Math.ceil(canvasWidth / tileWidth) + 1;
  const rows = Math.ceil(canvasHeight / tileHeight) + 1;
  
  // Clean the SVG path - it's already wrapped in <path> tag
  let svgContent = pattern.svgPath;
  
  // Replace stroke-width value
  svgContent = svgContent.replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`);
  svgContent = svgContent.replace(/stroke-width='[^']*'/g, `stroke-width="${strokeWidth}"`);
  
  // Ensure stroke color and no fill
  if (svgContent.indexOf('stroke=') === -1) {
    svgContent = svgContent.replace('<path ', '<path stroke="currentColor" ');
  }
  if (svgContent.indexOf('fill=') === -1) {
    svgContent = svgContent.replace('<path ', '<path fill="none" ');
  }
  
  // Tile the pattern
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

export interface PatternMonsterPattern {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  width: number;
  height: number;
  viewBoxHeight: number;
  mode: 'stroke' | 'fill' | 'stroke-join';
  svgPath: string;
  tags: string[];
}

// Clean and prepare Pattern Monster SVG paths for rendering
function cleanPatternMonsterSVG(svgPath: string, mode: string): string {
  // Split paths if they contain ~ separator
  const paths = svgPath.split('~');
  
  // Convert paths to pure black based on mode
  const cleanedPaths = paths.map(path => {
    let cleaned = path;
    
    // Ensure black fill/stroke based on mode
    if (mode === 'stroke' || mode === 'stroke-join') {
      // Set stroke to black, no fill
      if (!cleaned.includes('stroke=')) {
        cleaned = cleaned.replace('<path ', '<path stroke="black" fill="none" ');
      } else {
        cleaned = cleaned.replace(/stroke="[^"]*"/g, 'stroke="black"');
        cleaned = cleaned.replace(/stroke='[^']*'/g, "stroke='black'");
      }
      
      // Add stroke-linejoin for stroke-join mode
      if (mode === 'stroke-join') {
        cleaned = cleaned.replace('<path ', '<path stroke-linejoin="round" ');
      }
    } else {
      // Fill mode - set fill to black
      if (!cleaned.includes('fill=')) {
        cleaned = cleaned.replace('<path ', '<path fill="black" ');
      } else {
        cleaned = cleaned.replace(/fill="[^"]*"/g, 'fill="black"');
        cleaned = cleaned.replace(/fill='[^']*'/g, "fill='black'");
      }
    }
    
    // Remove any opacity attributes
    cleaned = cleaned.replace(/opacity="[^"]+"/g, '');
    cleaned = cleaned.replace(/opacity='[^']+'/g, '');
    cleaned = cleaned.replace(/fill-opacity="[^"]+"/g, '');
    cleaned = cleaned.replace(/stroke-opacity="[^"]+"/g, '');
    
    return cleaned;
  });
  
  return cleanedPaths.join('\n');
}

export async function loadPatternMonsterPatterns(): Promise<PatternMonsterPattern[]> {
  try {
    const response = await fetch('/pattern_monster_patterns.json');
    const data = await response.json();
    
    return data.map((pattern: any) => ({
      id: pattern.id,
      name: pattern.name,
      category: pattern.category,
      subcategory: pattern.subcategory,
      width: pattern.width,
      height: pattern.height,
      viewBoxHeight: pattern.viewBoxHeight,
      mode: pattern.mode,
      svgPath: cleanPatternMonsterSVG(pattern.svgPath, pattern.mode),
      tags: pattern.tags,
    }));
  } catch (error) {
    console.error('Error loading Pattern Monster patterns:', error);
    return [];
  }
}

// Generate tiled Pattern Monster pattern for canvas using manual tiling
export function generatePatternMonsterPattern(
  pattern: PatternMonsterPattern,
  canvasWidth: number,
  canvasHeight: number,
  scale: number = 1,
  strokeWidth: number = 2
): string {
  const tileWidth = pattern.width * scale;
  const tileHeight = pattern.height * scale;
  
  // Calculate grid dimensions to cover entire canvas
  const cols = Math.ceil(canvasWidth / tileWidth) + 1;
  const rows = Math.ceil(canvasHeight / tileHeight) + 1;
  
  // Apply stroke-width to paths for stroke modes
  let svgContent = pattern.svgPath;
  if (pattern.mode === 'stroke' || pattern.mode === 'stroke-join') {
    svgContent = svgContent.replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`);
    if (!svgContent.includes('stroke-width=')) {
      svgContent = svgContent.replace(/<path /g, `<path stroke-width="${strokeWidth}" `);
    }
  }
  
  // Generate tiles using the same approach as Hero patterns (which work correctly)
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

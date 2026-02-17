export interface HeroPattern {
  name: string;
  image: string;
  svgWidth: number;
  svgHeight: number;
}

// Extract dimensions from SVG viewBox or width/height attributes
function extractSVGDimensions(svgString: string): { width: number; height: number } {
  // Try to extract from viewBox first
  const viewBoxMatch = svgString.match(/viewBox="([^"]+)"/);
  if (viewBoxMatch) {
    const viewBox = viewBoxMatch[1].split(' ');
    return {
      width: parseInt(viewBox[2]) || 100,
      height: parseInt(viewBox[3]) || 100,
    };
  }

  // Try to extract from width/height attributes
  const widthMatch = svgString.match(/width="(\d+)"/);
  const heightMatch = svgString.match(/height="(\d+)"/);
  
  return {
    width: widthMatch ? parseInt(widthMatch[1]) : 100,
    height: heightMatch ? parseInt(heightMatch[1]) : 100,
  };
}

// Clean and normalize Hero Pattern SVG
function cleanHeroPatternSVG(svgString: string): string {
  // Replace #000 with black
  let cleaned = svgString.replace(/fill="#000"/g, 'fill="black"');
  cleaned = cleaned.replace(/fill='#000'/g, "fill='black'");
  
  // Remove opacity attributes for solid black
  cleaned = cleaned.replace(/opacity="[^"]+"/g, '');
  cleaned = cleaned.replace(/opacity='[^']+'/g, '');
  
  // Extract just the inner content (everything between <svg> tags)
  const contentMatch = cleaned.match(/<svg[^>]*>(.*)<\/svg>/s);
  if (contentMatch) {
    return contentMatch[1];
  }
  
  return cleaned;
}

export async function loadHeroPatterns(): Promise<HeroPattern[]> {
  try {
    const response = await fetch('/heropatterns.json');
    const data = await response.json();
    
    return data.map((pattern: any) => {
      const dimensions = extractSVGDimensions(pattern.image);
      return {
        name: pattern.name,
        image: cleanHeroPatternSVG(pattern.image),
        svgWidth: dimensions.width,
        svgHeight: dimensions.height,
      };
    });
  } catch (error) {
    console.error('Error loading Hero Patterns:', error);
    return [];
  }
}

// Generate tiled Hero Pattern for canvas
export function generateHeroPattern(
  pattern: HeroPattern,
  canvasWidth: number,
  canvasHeight: number,
  scale: number = 1
): string {
  const tileWidth = pattern.svgWidth * scale;
  const tileHeight = pattern.svgHeight * scale;
  
  const cols = Math.ceil(canvasWidth / tileWidth) + 1;
  const rows = Math.ceil(canvasHeight / tileHeight) + 1;
  
  let result = '';
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * tileWidth;
      const y = row * tileHeight;
      
      result += `<g transform="translate(${x}, ${y}) scale(${scale})">`;
      result += pattern.image;
      result += '</g>';
    }
  }
  
  return result;
}

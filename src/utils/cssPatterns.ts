export interface CSSPattern {
  name: string;
  image: string;
}

let cssPatternsCache: CSSPattern[] | null = null;

// Load CSS patterns from JSON file
export async function loadCSSPatterns(): Promise<CSSPattern[]> {
  if (cssPatternsCache) {
    return cssPatternsCache;
  }

  try {
    const response = await fetch('/css_patterns.json');
    if (!response.ok) {
      throw new Error(`Failed to load CSS patterns: ${response.status} ${response.statusText}`);
    }
    const patterns = await response.json();
    cssPatternsCache = patterns;
    return patterns;
  } catch (error) {
    console.error('Error loading CSS patterns:', error);
    return [];
  }
}

// Generate CSS pattern SVG content
export function generateCSSPattern(pattern: CSSPattern, pixelWidth: number, pixelHeight: number, scale: number = 1): string {
  if (!pattern.image) {
    return '';
  }

  // Extract the pattern content from the SVG image
  // The CSS patterns are already formatted as complete SVG patterns
  const patternSVG = pattern.image.replace(/<?xml[^>]*>/, ''); // Remove XML declaration if present
  
  // Create a wrapper SVG that scales the pattern to fit the canvas
  const scaledWidth = pixelWidth / scale;
  const scaledHeight = pixelHeight / scale;
  
  return `
    <svg width="${pixelWidth}" height="${pixelHeight}" viewBox="0 0 ${scaledWidth} ${scaledHeight}" xmlns="http://www.w3.org/2000/svg">
      ${patternSVG}
    </svg>
  `;
}

// Get pattern by name
export function getCSSPatternByName(patterns: CSSPattern[], name: string): CSSPattern | undefined {
  return patterns.find(pattern => pattern.name.toLowerCase().replace(/\s+/g, '-') === name.toLowerCase().replace(/\s+/g, '-'));
}
// Custom pattern loader for built-in patterns (Classic, Tech, Nature)

export interface BuiltInCustomPattern {
  id: string;
  name: string;
  width: number;
  height: number;
  svgPath: string;
  tags: string[];
  source?: string;
  svgContent?: string;
  description?: string;
}

export async function loadCustomPatterns(): Promise<BuiltInCustomPattern[]> {
  const patterns: BuiltInCustomPattern[] = [];
  
  // Load classic patterns
  try {
    const classicRes = await fetch('/classic_patterns.json');
    const classicData = await classicRes.json();
    if (classicData.patterns) {
      patterns.push(...classicData.patterns.map((p: any) => ({
        ...p,
        source: 'classic',
        svgContent: `<svg viewBox="0 0 ${p.width} ${p.height}"><path d="${p.svgPath}" /></svg>`
      })));
    }
  } catch (e) {
    console.error('Error loading classic patterns:', e);
  }
  
  // Load tech patterns
  try {
    const techRes = await fetch('/tech_patterns.json');
    const techData = await techRes.json();
    if (techData.patterns) {
      patterns.push(...techData.patterns.map((p: any) => ({
        ...p,
        source: 'tech',
        svgContent: `<svg viewBox="0 0 ${p.width} ${p.height}"><path d="${p.svgPath}" /></svg>`
      })));
    }
  } catch (e) {
    console.error('Error loading tech patterns:', e);
  }
  
  // Load nature patterns
  try {
    const natureRes = await fetch('/nature_patterns.json');
    const natureData = await natureRes.json();
    if (natureData.patterns) {
      patterns.push(...natureData.patterns.map((p: any) => ({
        ...p,
        source: 'nature',
        svgContent: `<svg viewBox="0 0 ${p.width} ${p.height}"><path d="${p.svgPath}" /></svg>`
      })));
    }
  } catch (e) {
    console.error('Error loading nature patterns:', e);
  }
  
  return patterns;
}

export function generateCustomPattern(
  pattern: BuiltInCustomPattern,
  canvasWidth: number,
  canvasHeight: number,
  scale: number = 1,
  strokeWidth: number = 2
): string {
  const tileWidth = pattern.width * scale;
  const tileHeight = pattern.height * scale;
  
  const cols = Math.ceil(canvasWidth / tileWidth) + 1;
  const rows = Math.ceil(canvasHeight / tileHeight) + 1;
  
  let result = '';
  
  // Get the path content from svgPath or svgContent
  let pathContent = pattern.svgPath;
  if (!pathContent && pattern.svgContent) {
    const match = pattern.svgContent.match(/<path[^>]*d="([^"]*)"/);
    if (match) pathContent = match[1];
  }
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * tileWidth;
      const y = row * tileHeight;
      
      result += `<g transform="translate(${x}, ${y}) scale(${scale})">`;
      result += `<svg width="${tileWidth}" height="${tileHeight}" viewBox="0 0 ${pattern.width} ${pattern.height}">`;
      result += `<path d="${pathContent}" stroke="currentColor" fill="none" stroke-width="${strokeWidth / scale}"/>`;
      result += '</svg>';
      result += '</g>';
    }
  }
  
  return result;
}

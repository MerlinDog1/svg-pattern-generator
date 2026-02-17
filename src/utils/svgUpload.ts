// SVG Upload and Validation Utilities
// Processes uploaded SVG files for pattern generation

export interface SVGUploadResult {
  success: boolean;
  data?: SVGPatternData;
  error?: string;
  warnings?: string[];
}

export interface SVGPatternData {
  id: string;
  name: string;
  category: string;
  description: string;
  complexity: number;
  svgContent: string;
  metadata: SVGMetadata;
  extractedElements: SVGElements;
  validationResults: ValidationResults;
}

export interface SVGMetadata {
  fileName: string;
  fileSize: number;
  dimensions: {
    width: number;
    height: number;
    viewBox?: string;
  };
  complexity: 'simple' | 'moderate' | 'complex';
  elements: {
    paths: number;
    circles: number;
    rectangles: number;
    polygons: number;
    lines: number;
    text: number;
    groups: number;
    gradients: number;
    transforms: number;
  };
}

export interface SVGElements {
  paths: SVGElementData[];
  circles: SVGElementData[];
  rectangles: SVGElementData[];
  polygons: SVGElementData[];
  lines: SVGElementData[];
  groups: SVGElementData[];
  defs: SVGElementData[];
}

export interface SVGElementData {
  type: string;
  attributes: Record<string, string>;
  content?: string;
  hasGradient: boolean;
  hasTransform: boolean;
  complexity: number;
}

export interface ValidationResults {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

// Configuration constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = ['.svg'];
const MIN_COMPLEXITY_THRESHOLD = 10;
const MAX_COMPLEXITY_THRESHOLD = 1000;

/**
 * Parse and validate uploaded SVG files
 * @param files - Array of File objects
 * @returns Promise<SVGUploadResult[]>
 */
export async function parseSVGFiles(files: File[]): Promise<SVGUploadResult[]> {
  const results: SVGUploadResult[] = [];

  for (const file of files) {
    try {
      // Validate file
      const fileValidation = validateFile(file);
      if (!fileValidation.isValid) {
        results.push({
          success: false,
          error: fileValidation.error
        });
        continue;
      }

      // Read file content
      const content = await readFileContent(file);
      
      // Validate SVG structure
      const structureValidation = validateSVGStructure(content);
      if (!structureValidation.isValid) {
        results.push({
          success: false,
          error: structureValidation.errors[0] || 'Invalid SVG structure'
        });
        continue;
      }

      // Extract content and metadata
      const patternData = await extractSVGContent(content, file);

      results.push({
        success: true,
        data: patternData,
        warnings: structureValidation.warnings
      });

    } catch (error) {
      results.push({
        success: false,
        error: handleSVGErrors(error as Error)
      });
    }
  }

  return results;
}

/**
 * Check if uploaded file is valid SVG
 * @param svgContent - SVG content as string
 * @returns ValidationResults
 */
export function validateSVGStructure(svgContent: string): ValidationResults {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  try {
    // Parse as XML to check structure
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');

    // Check for parsing errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      errors.push('Invalid XML structure in SVG file');
      return { isValid: false, errors, warnings, suggestions };
    }

    // Check for root SVG element
    const svgElement = doc.documentElement;
    if (svgElement.tagName.toLowerCase() !== 'svg') {
      errors.push('Missing root <svg> element');
    }

    // Validate required attributes
    const hasViewBox = svgElement.hasAttribute('viewBox');
    const hasWidth = svgElement.hasAttribute('width');
    const hasHeight = svgElement.hasAttribute('height');

    if (!hasViewBox && (!hasWidth || !hasHeight)) {
      warnings.push('SVG should have either viewBox or width/height attributes');
      suggestions.push('Add viewBox attribute for better scaling');
    }

    // Check for dangerous elements
    const scriptElements = doc.querySelectorAll('script');
    if (scriptElements.length > 0) {
      errors.push('SVG contains script elements - security risk');
    }

    const externalReferences = svgContent.match(/href\s*=\s*['"](?!#)/g);
    if (externalReferences && externalReferences.length > 0) {
      warnings.push('SVG contains external references that may not work in patterns');
      suggestions.push('Consider embedding all resources or using absolute paths');
    }

    // Check complexity metrics
    const elements = doc.querySelectorAll('*');
    const pathElements = doc.querySelectorAll('path').length;
    const gradientElements = doc.querySelectorAll('linearGradient, radialGradient').length;

    if (elements.length > MAX_COMPLEXITY_THRESHOLD) {
      warnings.push('SVG has very high element count - may impact performance');
      suggestions.push('Consider simplifying the design for better pattern generation');
    }

    if (gradientElements > 10) {
      warnings.push('Multiple gradients detected - may not render correctly in patterns');
      suggestions.push('Limit gradient complexity for better pattern compatibility');
    }

    // Check for unsupported features in pattern context
    const filterElements = doc.querySelectorAll('filter');
    if (filterElements.length > 0) {
      warnings.push('SVG filters may not be supported in pattern generation');
      suggestions.push('Consider removing filter elements for better compatibility');
    }

    const maskElements = doc.querySelectorAll('mask, clipPath');
    if (maskElements.length > 0) {
      warnings.push('SVG masks and clipPaths may not be fully supported');
      suggestions.push('Test pattern generation with masks/clipPaths removed');
    }

  } catch (error) {
    errors.push(`Parsing error: ${error}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  };
}

/**
 * Extract the SVG content for pattern generation
 * @param svgContent - Raw SVG content
 * @param file - Original file object
 * @returns Promise<SVGPatternData>
 */
export async function extractSVGContent(svgContent: string, file: File): Promise<SVGPatternData> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');
  const svgElement = doc.documentElement;

  // Extract metadata
  const metadata = extractSVGMetadata(svgElement, file);
  
  // Extract elements
  const extractedElements = extractSVGElements(doc);
  
  // Generate pattern ID
  const patternId = generatePatternId(file.name);
  
  // Determine complexity
  const complexity = calculateComplexity(extractedElements, metadata);

  return {
    id: patternId,
    name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
    category: determinePatternCategory(extractedElements),
    description: generatePatternDescription(extractedElements, metadata),
    complexity,
    svgContent: svgContent,
    metadata,
    extractedElements,
    validationResults: { isValid: true, errors: [], warnings: [], suggestions: [] }
  };
}

/**
 * Graceful error handling for malformed SVGs
 * @param error - Error object or string
 * @returns Standardized error message
 */
export function handleSVGErrors(error: Error | string): string {
  const message = typeof error === 'string' ? error : error.message;
  
  const errorMappings: Record<string, string> = {
    'Invalid XML': 'The file is not valid XML/SVG format',
    'NetworkError': 'Unable to read the file - network or permission error',
    'SecurityError': 'File access denied - check browser permissions',
    'NotFoundError': 'File not found or corrupted',
    'SyntaxError': 'Invalid SVG syntax - check XML structure'
  };

  // Check for specific error patterns
  for (const [pattern, description] of Object.entries(errorMappings)) {
    if (message.includes(pattern)) {
      return description;
    }
  }

  // Default error messages
  if (message.includes('size')) {
    return 'File size too large - please use a smaller SVG file';
  }
  
  if (message.includes('format') || message.includes('type')) {
    return 'Invalid file format - only SVG files are supported';
  }
  
  if (message.includes('parse') || message.includes('XML')) {
    return 'Unable to parse SVG file - check for XML syntax errors';
  }

  return `SVG processing error: ${message}`;
}

// Helper Functions

function validateFile(file: File): { isValid: boolean; error?: string } {
  // Check file extension
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
    return { isValid: false, error: 'Only SVG files are supported' };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { 
      isValid: false, 
      error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum limit (${MAX_FILE_SIZE / 1024 / 1024}MB)` 
    };
  }

  if (file.size === 0) {
    return { isValid: false, error: 'File is empty' };
  }

  return { isValid: true };
}

function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

function extractSVGMetadata(svgElement: Element, file: File): SVGMetadata {
  const getDimension = (attr: string): number => {
    const value = svgElement.getAttribute(attr);
    if (!value) return 0;
    
    // Extract numeric value from strings like "100px", "100", etc.
    const match = value.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const width = getDimension('width');
  const height = getDimension('height');
  const viewBox = svgElement.getAttribute('viewBox') || undefined;

  // Count elements
  const allElements = svgElement.querySelectorAll('*');
  const pathElements = svgElement.querySelectorAll('path').length;
  const circleElements = svgElement.querySelectorAll('circle').length;
  const rectElements = svgElement.querySelectorAll('rect').length;
  const polygonElements = svgElement.querySelectorAll('polygon').length;
  const lineElements = svgElement.querySelectorAll('line').length;
  const textElements = svgElement.querySelectorAll('text').length;
  const groupElements = svgElement.querySelectorAll('g').length;
  const gradientElements = svgElement.querySelectorAll('linearGradient, radialGradient').length;

  // Check for transforms
  let hasTransforms = false;
  allElements.forEach(element => {
    if (element.hasAttribute('transform')) {
      hasTransforms = true;
    }
  });

  // Determine complexity level
  const totalElements = allElements.length;
  let complexity: 'simple' | 'moderate' | 'complex';
  
  if (totalElements < MIN_COMPLEXITY_THRESHOLD) {
    complexity = 'simple';
  } else if (totalElements < MAX_COMPLEXITY_THRESHOLD) {
    complexity = 'moderate';
  } else {
    complexity = 'complex';
  }

  return {
    fileName: file.name,
    fileSize: file.size,
    dimensions: { width, height, viewBox },
    complexity,
    elements: {
      paths: pathElements,
      circles: circleElements,
      rectangles: rectElements,
      polygons: polygonElements,
      lines: lineElements,
      text: textElements,
      groups: groupElements,
      gradients: gradientElements,
      transforms: hasTransforms ? 1 : 0
    }
  };
}

function extractSVGElements(doc: Document): SVGElements {
  const extractElementData = (elements: NodeListOf<Element> | Element[]): SVGElementData[] => {
    return Array.from(elements as any).map((element: Element) => {
      const attributes: Record<string, string> = {};
      
      // Extract all attributes
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        attributes[attr.name] = attr.value;
      }

      // Check for gradients and transforms
      const hasGradient = element.querySelectorAll('linearGradient, radialGradient').length > 0;
      const hasTransform = element.hasAttribute('transform');

      // Calculate complexity score
      let complexity = 1;
      if (hasGradient) complexity += 2;
      if (hasTransform) complexity += 1;
      if (element.children.length > 0) complexity += element.children.length;

      return {
        type: element.tagName.toLowerCase(),
        attributes,
        content: element.textContent || undefined,
        hasGradient,
        hasTransform,
        complexity
      };
    });
  };

  return {
    paths: extractElementData(doc.querySelectorAll('path') as NodeListOf<Element>),
    circles: extractElementData(doc.querySelectorAll('circle') as NodeListOf<Element>),
    rectangles: extractElementData(doc.querySelectorAll('rect') as NodeListOf<Element>),
    polygons: extractElementData(doc.querySelectorAll('polygon') as NodeListOf<Element>),
    lines: extractElementData(doc.querySelectorAll('line') as NodeListOf<Element>),
    groups: extractElementData(doc.querySelectorAll('g') as NodeListOf<Element>),
    defs: extractElementData(doc.querySelectorAll('defs') as NodeListOf<Element>)
  };
}

function generatePatternId(fileName: string): string {
  const baseName = fileName.replace(/\.[^/.]+$/, ""); // Remove extension
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  
  return `uploaded_${baseName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${timestamp}_${random}`;
}

function calculateComplexity(elements: SVGElements, metadata: SVGMetadata): number {
  let complexity = 1;

  // Base complexity from element count
  const totalElements = Object.values(elements).reduce((sum, arr) => sum + arr.length, 0);
  complexity += totalElements * 0.1;

  // Add complexity for gradients and transforms
  complexity += metadata.elements.gradients * 2;
  complexity += metadata.elements.transforms * 1.5;

  // Add complexity for element diversity
  const elementTypes = Object.keys(elements).filter(key => elements[key].length > 0).length;
  complexity += elementTypes * 0.5;

  // Cap complexity at 4 stars
  return Math.min(Math.ceil(complexity), 4);
}

function determinePatternCategory(elements: SVGElements): string {
  const elementCounts = {
    paths: elements.paths.length,
    circles: elements.circles.length,
    rectangles: elements.rectangles.length,
    polygons: elements.polygons.length,
    lines: elements.lines.length
  };

  const totalShapes = Object.values(elementCounts).reduce((sum, count) => sum + count, 0);

  // Categorize based on dominant element type
  if (elementCounts.paths > totalShapes * 0.6) {
    return 'Path-based';
  } else if (elementCounts.circles > totalShapes * 0.6) {
    return 'Circular';
  } else if (elementCounts.rectangles > totalShapes * 0.6) {
    return 'Geometric';
  } else if (elementCounts.polygons > totalShapes * 0.6) {
    return 'Polygonal';
  } else if (elementCounts.lines > totalShapes * 0.6) {
    return 'Linear';
  }

  return 'Mixed';
}

function generatePatternDescription(elements: SVGElements, metadata: SVGMetadata): string {
  const totalElements = Object.values(elements).reduce((sum, arr) => sum + arr.length, 0);
  const complexityText = metadata.complexity === 'simple' ? 'simple' : 
                        metadata.complexity === 'moderate' ? 'moderate' : 'complex';
  
  const elementTypes = Object.keys(elements).filter(key => elements[key].length > 0);
  const mainTypes = elementTypes.slice(0, 3).join(', ');
  
  return `Uploaded SVG pattern with ${totalElements} elements (${complexityText} complexity). Contains ${mainTypes} elements.`;
}

/**
 * Process SVG content to be compatible with pattern generator
 * @param svgContent - Raw SVG content
 * @returns Processed SVG string optimized for patterns
 */
export function processSVGForPattern(svgContent: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    
    // Remove unsupported elements for patterns
    const elementsToRemove = ['script', 'style', 'foreignObject'];
    elementsToRemove.forEach(tag => {
      doc.querySelectorAll(tag).forEach(el => el.remove());
    });

    // Clean up attributes that might cause issues
    doc.querySelectorAll('*').forEach(element => {
      // Remove event handlers
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        if (attr.name.startsWith('on')) {
          element.removeAttribute(attr.name);
        }
      }
    });

    // Return cleaned SVG
    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc);
    
  } catch (error) {
    // If processing fails, return original content
    return svgContent;
  }
}

/**
 * Validate SVG compatibility with pattern generation
 * @param svgContent - SVG content to check
 * @returns Compatibility report
 */
export function checkPatternCompatibility(svgContent: string): {
  compatible: boolean;
  score: number;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    
    // Check for problematic elements
    const problematicElements = [
      { selector: 'script', penalty: 50, issue: 'Script elements not supported' },
      { selector: 'style', penalty: 20, issue: 'Embedded styles may not work' },
      { selector: 'foreignObject', penalty: 30, issue: 'Foreign objects not supported' },
      { selector: 'filter', penalty: 15, issue: 'Filters may not render correctly' },
      { selector: 'mask, clipPath', penalty: 10, issue: 'Masks/clipPaths have limited support' }
    ];

    problematicElements.forEach(({ selector, penalty, issue }) => {
      const count = doc.querySelectorAll(selector).length;
      if (count > 0) {
        issues.push(`${count} ${issue}`);
        score -= penalty * Math.min(count, 3);
      }
    });

    // Check for external references
    const externalRefs = svgContent.match(/url\(['"](?!#)/g);
    if (externalRefs) {
      issues.push('External references found');
      recommendations.push('Embed resources or use internal references');
      score -= externalRefs.length * 5;
    }

    // Check complexity
    const elementCount = doc.querySelectorAll('*').length;
    if (elementCount > 500) {
      issues.push('High element count may impact performance');
      recommendations.push('Consider simplifying the design');
      score -= Math.min(elementCount - 500, 200) / 10;
    }

    // Ensure score doesn't go below 0
    score = Math.max(score, 0);

  } catch (error) {
    issues.push('Failed to parse SVG for compatibility check');
    score = 0;
  }

  return {
    compatible: score >= 60,
    score: Math.round(score),
    issues,
    recommendations
  };
}
// Example usage of SVG Upload Utilities
// This file demonstrates how to integrate SVG upload functionality with your pattern system

import { 
  parseSVGFiles, 
  extractSVGContent, 
  validateSVGStructure, 
  handleSVGErrors,
  processSVGForPattern,
  checkPatternCompatibility,
  SVGUploadResult,
  SVGPatternData
} from './svgUpload';

// Example 1: Basic file upload handling
export async function handleSVGFileUpload(files: FileList): Promise<void> {
  try {
    // Convert FileList to File array
    const fileArray = Array.from(files);
    
    // Parse and validate all files
    const results = await parseSVGFiles(fileArray);
    
    results.forEach((result, index) => {
      if (result.success && result.data) {
        console.log(`✅ File ${index + 1} processed successfully:`, result.data.name);
        
        // Add to pattern catalog
        addPatternToCatalog(result.data);
        
        // Show any warnings
        if (result.warnings && result.warnings.length > 0) {
          console.warn(`⚠️  Warnings for ${result.data.name}:`, result.warnings);
        }
      } else {
        console.error(`❌ File ${index + 1} failed:`, result.error);
      }
    });
    
  } catch (error) {
    console.error('Upload failed:', handleSVGErrors(error as Error));
  }
}

// Example 2: Single SVG processing
export async function processSingleSVG(file: File): Promise<SVGPatternData | null> {
  try {
    // Validate file first
    const validation = validateSVGStructure(await file.text());
    if (!validation.isValid) {
      console.error('Invalid SVG:', validation.errors);
      return null;
    }
    
    // Extract content
    const patternData = await extractSVGContent(await file.text(), file);
    
    // Check compatibility for pattern generation
    const compatibility = checkPatternCompatibility(patternData.svgContent);
    console.log(`Pattern compatibility: ${compatibility.score}/100`);
    
    if (compatibility.issues.length > 0) {
      console.warn('Compatibility issues:', compatibility.issues);
    }
    
    return patternData;
    
  } catch (error) {
    console.error('Processing failed:', handleSVGErrors(error as Error));
    return null;
  }
}

// Example 3: Integration with existing pattern system
function addPatternToCatalog(patternData: SVGPatternData): void {
  // This would integrate with your existing pattern catalog
  const patternConfig = {
    id: patternData.id,
    name: patternData.name,
    category: patternData.category,
    description: patternData.description,
    complexity: patternData.complexity,
    parameters: [
      {
        id: 'tileSize',
        label: 'Tile Size',
        type: 'slider',
        min: 10,
        max: 200,
        step: 5,
        default: 100
      },
      {
        id: 'opacity',
        label: 'Opacity',
        type: 'slider',
        min: 0.1,
        max: 1,
        step: 0.1,
        default: 1
      }
    ]
  };
  
  console.log('Added pattern to catalog:', patternConfig);
}

// Example 4: Drag and drop handler
export function setupDragAndDrop(dropZone: HTMLElement): void {
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });
  
  dropZone.addEventListener('drop', async (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      await handleSVGFileUpload(files);
    }
  });
}

// Example 5: React component integration
export class SVGUploadComponent {
  private inputElement: HTMLInputElement;
  
  constructor(inputId: string) {
    this.inputElement = document.getElementById(inputId) as HTMLInputElement;
    this.setupEventListeners();
  }
  
  private setupEventListeners(): void {
    this.inputElement.addEventListener('change', async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        await handleSVGFileUpload(files);
      }
    });
  }
  
  public async processFile(file: File): Promise<void> {
    const result = await parseSVGFiles([file]);
    
    if (result[0].success && result[0].data) {
      // Handle successful upload
      this.onUploadSuccess(result[0].data);
    } else {
      // Handle error
      this.onUploadError(result[0].error || 'Unknown error');
    }
  }
  
  private onUploadSuccess(patternData: SVGPatternData): void {
    console.log('Upload successful:', patternData);
    // Trigger UI updates, add to catalog, etc.
  }
  
  private onUploadError(error: string): void {
    console.error('Upload error:', error);
    // Show error message to user
  }
}

// Example 6: Pattern generation integration
export function generatePatternFromSVG(
  patternData: SVGPatternData, 
  width: number, 
  height: number
): string {
  // Process SVG for pattern compatibility
  const processedSVG = processSVGForPattern(patternData.svgContent);
  
  // Create a pattern-compatible version
  // This would integrate with your existing pattern generation system
  const patternSVG = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <pattern id="${patternData.id}" patternUnits="userSpaceOnUse" width="100" height="100">
          ${processedSVG}
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#${patternData.id})"/>
    </svg>
  `;
  
  return patternSVG;
}

// Example 7: Batch processing with progress tracking
export async function batchProcessSVGFiles(
  files: File[], 
  onProgress: (progress: number, currentFile: string) => void
): Promise<SVGUploadResult[]> {
  const results: SVGUploadResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress((i / files.length) * 100, file.name);
    
    try {
      const fileResults = await parseSVGFiles([file]);
      results.push(...fileResults);
    } catch (error) {
      results.push({
        success: false,
        error: handleSVGErrors(error as Error)
      });
    }
  }
  
  onProgress(100, 'Complete');
  return results;
}

// Example 8: Error handling and user feedback
export class SVGUploadHandler {
  private errorContainer: HTMLElement;
  private successContainer: HTMLElement;
  
  constructor(errorElementId: string, successElementId: string) {
    this.errorContainer = document.getElementById(errorElementId) as HTMLElement;
    this.successContainer = document.getElementById(successElementId) as HTMLElement;
  }
  
  public async handleFiles(files: FileList): Promise<void> {
    this.clearMessages();
    
    try {
      const results = await parseSVGFiles(Array.from(files));
      
      const successCount = results.filter(r => r.success).length;
      const errorCount = results.filter(r => !r.success).length;
      
      if (successCount > 0) {
        this.showSuccess(`${successCount} SVG file(s) processed successfully`);
      }
      
      if (errorCount > 0) {
        const errors = results
          .filter(r => !r.success)
          .map(r => r.error)
          .filter(Boolean);
        this.showError(errors.join('\n'));
      }
      
    } catch (error) {
      this.showError(handleSVGErrors(error as Error));
    }
  }
  
  private showSuccess(message: string): void {
    this.successContainer.textContent = message;
    this.successContainer.style.display = 'block';
  }
  
  private showError(message: string): void {
    this.errorContainer.textContent = message;
    this.errorContainer.style.display = 'block';
  }
  
  private clearMessages(): void {
    this.errorContainer.style.display = 'none';
    this.successContainer.style.display = 'none';
  }
}

// Example 9: Validation utilities for real-time feedback
export class SVGValidator {
  public static validateFile(file: File): { valid: boolean; message?: string } {
    // Check file type
    if (!file.name.toLowerCase().endsWith('.svg')) {
      return { valid: false, message: 'Please select an SVG file' };
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return { valid: false, message: 'File size must be less than 5MB' };
    }
    
    return { valid: true };
  }
  
  public static async quickValidate(file: File): Promise<{ valid: boolean; message?: string }> {
    const fileValidation = this.validateFile(file);
    if (!fileValidation.valid) return fileValidation;
    
    try {
      const content = await file.text();
      const validation = validateSVGStructure(content);
      
      if (!validation.isValid) {
        return { 
          valid: false, 
          message: `Invalid SVG: ${validation.errors[0]}` 
        };
      }
      
      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        message: 'Unable to read file' 
      };
    }
  }
}

// Example 10: Integration with Canvas component
export async function loadSVGIntoCanvas(
  canvasElement: SVGSVGElement, 
  patternData: SVGPatternData
): Promise<void> {
  try {
    // Process SVG for canvas compatibility
    const processedSVG = processSVGForPattern(patternData.svgContent);
    
    // Parse and insert into canvas
    const parser = new DOMParser();
    const doc = parser.parseFromString(processedSVG, 'image/svg+xml');
    const svgElement = doc.documentElement;
    
    // Clear existing content
    while (canvasElement.firstChild) {
      canvasElement.removeChild(canvasElement.firstChild);
    }
    
    // Import and add SVG content
    const importedNode = document.importNode(svgElement, true);
    canvasElement.appendChild(importedNode);
    
    console.log('SVG loaded into canvas successfully');
    
  } catch (error) {
    console.error('Failed to load SVG into canvas:', error);
  }
}
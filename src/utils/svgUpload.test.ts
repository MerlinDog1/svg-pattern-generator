// Test file for SVG Upload Utilities
// This demonstrates and tests the SVG upload functionality

import { 
  parseSVGFiles,
  validateSVGStructure,
  extractSVGContent,
  handleSVGErrors,
  processSVGForPattern,
  checkPatternCompatibility
} from './svgUpload';

// Test SVG content for validation
const testSVGContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="10" y="10" width="80" height="80" fill="url(#grad1)" />
  <circle cx="50" cy="50" r="20" stroke="black" stroke-width="2" fill="none" />
  <path d="M 30 30 L 70 70 M 70 30 L 30 70" stroke="black" stroke-width="2" />
</svg>`;

const complexTestSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="grad1">
      <stop offset="0%" style="stop-color:rgb(255,255,255);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(0,0,255);stop-opacity:1" />
    </radialGradient>
    <filter id="f1">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
    </filter>
  </defs>
  <g transform="translate(100,100)">
    <polygon points="0,-50 25,-25 50,0 25,25 0,50 -25,25 -50,0 -25,-25" fill="url(#grad1)" />
  </g>
  <path d="M 10 10 Q 50 50 90 10 T 170 10" stroke="blue" stroke-width="3" fill="none" filter="url(#f1)" />
  <circle cx="30" cy="30" r="10" />
  <rect x="120" y="120" width="40" height="40" rx="5" ry="5" />
  <line x1="10" y1="100" x2="190" y2="100" stroke="red" stroke-width="2" />
  <text x="10" y="20" font-family="Arial" font-size="14">Test Pattern</text>
</svg>`;

const malformedSVG = `<svg>
  <rect x="10" y="10" width="80" height="80" 
  <circle cx="50" cy="50" r="20"
  <path d="M 30 30 L 70 70 M 70 30 L 30 70"
</svg>`;

// Test functions
export async function runSVGTests(): Promise<void> {
  console.log('🧪 Starting SVG Upload Utility Tests...\n');

  // Test 1: Validate simple SVG
  console.log('Test 1: Simple SVG validation');
  const simpleValidation = validateSVGStructure(testSVGContent);
  console.log('✅ Valid:', simpleValidation.isValid);
  console.log('⚠️  Warnings:', simpleValidation.warnings);
  console.log('💡 Suggestions:', simpleValidation.suggestions);
  console.log('');

  // Test 2: Validate complex SVG
  console.log('Test 2: Complex SVG validation');
  const complexValidation = validateSVGStructure(complexTestSVG);
  console.log('✅ Valid:', complexValidation.isValid);
  console.log('❌ Errors:', complexValidation.errors);
  console.log('⚠️  Warnings:', complexValidation.warnings);
  console.log('💡 Suggestions:', complexValidation.suggestions);
  console.log('');

  // Test 3: Validate malformed SVG
  console.log('Test 3: Malformed SVG validation');
  const malformedValidation = validateSVGStructure(malformedSVG);
  console.log('✅ Valid:', malformedValidation.isValid);
  console.log('❌ Errors:', malformedValidation.errors);
  console.log('');

  // Test 4: Check pattern compatibility
  console.log('Test 4: Pattern compatibility check');
  const compatibility = checkPatternCompatibility(complexTestSVG);
  console.log('✅ Compatible:', compatibility.compatible);
  console.log('📊 Score:', compatibility.score + '/100');
  console.log('❌ Issues:', compatibility.issues);
  console.log('💡 Recommendations:', compatibility.recommendations);
  console.log('');

  // Test 5: Process SVG for patterns
  console.log('Test 5: SVG processing for patterns');
  const processedSVG = processSVGForPattern(complexTestSVG);
  console.log('✅ Processing completed');
  console.log('📏 Original length:', complexTestSVG.length);
  console.log('📏 Processed length:', processedSVG.length);
  console.log('');

  // Test 6: Error handling
  console.log('Test 6: Error handling');
  const testError = new Error('Invalid XML structure');
  const handledError = handleSVGErrors(testError);
  console.log('❌ Error handled:', handledError);
  console.log('');

  // Test 7: File simulation (create mock File objects)
  console.log('Test 7: File simulation');
  const mockFiles = createMockSVGFiles();
  console.log('📁 Created', mockFiles.length, 'mock files');
  console.log('');

  console.log('✅ All tests completed!');
}

function createMockSVGFiles(): File[] {
  const svg1 = new File([testSVGContent], 'simple_pattern.svg', { type: 'image/svg+xml' });
  const svg2 = new File([complexTestSVG], 'complex_pattern.svg', { type: 'image/svg+xml' });
  const svg3 = new File([malformedSVG], 'malformed_pattern.svg', { type: 'image/svg+xml' });
  
  return [svg1, svg2, svg3];
}

// Example usage in browser environment
export function setupTestInterface(): void {
  // Create test buttons
  const testButton = document.createElement('button');
  testButton.textContent = 'Run SVG Tests';
  testButton.onclick = () => runSVGTests();
  
  const uploadButton = document.createElement('button');
  uploadButton.textContent = 'Test File Upload';
  uploadButton.onclick = () => testFileUpload();
  
  // Add to page if in browser
  if (typeof document !== 'undefined') {
    document.body.appendChild(testButton);
    document.body.appendChild(uploadButton);
  }
}

async function testFileUpload(): Promise<void> {
  console.log('🧪 Testing file upload...');
  
  const mockFiles = createMockSVGFiles();
  
  try {
    const results = await parseSVGFiles(mockFiles);
    
    results.forEach((result, index) => {
      console.log(`\n📄 File ${index + 1}: ${mockFiles[index].name}`);
      if (result.success && result.data) {
        console.log('✅ Success!');
        console.log('🏷️  ID:', result.data.id);
        console.log('📂 Category:', result.data.category);
        console.log('⭐ Complexity:', result.data.complexity, 'stars');
        console.log('📏 Dimensions:', result.data.metadata.dimensions);
        console.log('🔢 Elements:', Object.entries(result.data.metadata.elements)
          .filter(([_, count]) => count > 0)
          .map(([type, count]) => `${type}: ${count}`)
          .join(', '));
      } else {
        console.log('❌ Error:', result.error);
      }
    });
    
  } catch (error) {
    console.error('Upload test failed:', error);
  }
}

// Export for use in other files
export const svgTestUtils = {
  testSVGContent,
  complexTestSVG,
  malformedSVG,
  runSVGTests,
  createMockSVGFiles,
  setupTestInterface
};
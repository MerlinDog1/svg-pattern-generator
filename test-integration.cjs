// Integration test for SVG Upload feature
const fs = require('fs');
const path = require('path');

async function testSVGUploadIntegration() {
  console.log('🧪 Testing SVG Upload Integration...\n');
  
  // Test 1: Verify svgUpload utility exists and has the expected functions
  console.log('Test 1: Checking svgUpload utility...');
  try {
    const svgUploadPath = './src/utils/svgUpload.ts';
    const content = fs.readFileSync(svgUploadPath, 'utf8');
    
    const hasParseSVGFiles = content.includes('export async function parseSVGFiles');
    const hasValidateSVG = content.includes('export function validateSVGStructure');
    const hasProcessSVG = content.includes('export function processSVGForPattern');
    
    console.log('✅ parseSVGFiles function:', hasParseSVGFiles ? 'Found' : 'Missing');
    console.log('✅ validateSVGStructure function:', hasValidateSVG ? 'Found' : 'Missing');
    console.log('✅ processSVGForPattern function:', hasProcessSVG ? 'Found' : 'Missing');
    console.log('');
    
    if (!hasParseSVGFiles || !hasValidateSVG || !hasProcessSVG) {
      throw new Error('Missing required functions in svgUpload utility');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
  
  // Test 2: Verify App.tsx imports and uses parseSVGFiles
  console.log('Test 2: Checking App.tsx integration...');
  try {
    const appPath = './src/App.tsx';
    const content = fs.readFileSync(appPath, 'utf8');
    
    const hasImport = content.includes("import { parseSVGFiles } from './utils/svgUpload'");
    const hasCustomPatterns = content.includes('customPatterns');
    const hasSVGUploadHandler = content.includes('handleSVGUpload');
    const hasUploadedFiles = content.includes('uploadedSVGFiles');
    
    console.log('✅ parseSVGFiles import:', hasImport ? 'Found' : 'Missing');
    console.log('✅ customPatterns state:', hasCustomPatterns ? 'Found' : 'Missing');
    console.log('✅ handleSVGUpload function:', hasSVGUploadHandler ? 'Found' : 'Missing');
    console.log('✅ uploadedSVGFiles state:', hasUploadedFiles ? 'Found' : 'Missing');
    console.log('');
    
    if (!hasImport || !hasCustomPatterns || !hasSVGUploadHandler || !hasUploadedFiles) {
      throw new Error('Missing required integration in App.tsx');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
  
  // Test 3: Verify SVGUpload component has correct interface
  console.log('Test 3: Checking SVGUpload component...');
  try {
    const uploadPath = './src/components/SVGUpload.tsx';
    const content = fs.readFileSync(uploadPath, 'utf8');
    
    const hasFileArrayInterface = content.includes('onSVGUpload: (svgFiles: File[]) => void');
    const hasFileProcessing = content.includes('handleFileProcessing');
    
    console.log('✅ File array interface:', hasFileArrayInterface ? 'Found' : 'Missing');
    console.log('✅ File processing:', hasFileProcessing ? 'Found' : 'Missing');
    console.log('');
    
    if (!hasFileArrayInterface || !hasFileProcessing) {
      throw new Error('Missing required interface in SVGUpload component');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
  
  // Test 4: Verify ControlPanel properly passes through SVG upload
  console.log('Test 4: Checking ControlPanel integration...');
  try {
    const controlPath = './src/components/ControlPanel.tsx';
    const content = fs.readFileSync(controlPath, 'utf8');
    
    const hasSVGUploadImport = content.includes("import { SVGUpload } from './SVGUpload'");
    const hasCorrectInterface = content.includes('onSVGUpload: (svgFiles: File[]) => void');
    const hasSVGUploadRender = content.includes('<SVGUpload onSVGUpload={onSVGUpload} />');
    
    console.log('✅ SVGUpload import:', hasSVGUploadImport ? 'Found' : 'Missing');
    console.log('✅ Correct interface:', hasCorrectInterface ? 'Found' : 'Missing');
    console.log('✅ SVGUpload render:', hasSVGUploadRender ? 'Found' : 'Missing');
    console.log('');
    
    if (!hasSVGUploadImport || !hasCorrectInterface || !hasSVGUploadRender) {
      throw new Error('Missing required integration in ControlPanel component');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
  
  // Test 5: Verify CustomPattern type definition
  console.log('Test 5: Checking CustomPattern types...');
  try {
    const typesPath = './src/types/patterns.ts';
    const content = fs.readFileSync(typesPath, 'utf8');
    
    const hasCustomPattern = content.includes('export interface CustomPattern');
    const hasSvgContent = content.includes('svgContent: string');
    const hasOriginalFileName = content.includes('originalFileName: string');
    const hasUploadTimestamp = content.includes('uploadTimestamp: number');
    
    console.log('✅ CustomPattern interface:', hasCustomPattern ? 'Found' : 'Missing');
    console.log('✅ svgContent property:', hasSvgContent ? 'Found' : 'Missing');
    console.log('✅ originalFileName property:', hasOriginalFileName ? 'Found' : 'Missing');
    console.log('✅ uploadTimestamp property:', hasUploadTimestamp ? 'Found' : 'Missing');
    console.log('');
    
    if (!hasCustomPattern || !hasSvgContent || !hasOriginalFileName || !hasUploadTimestamp) {
      throw new Error('Missing required properties in CustomPattern interface');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
  
  console.log('✅ All integration tests passed!');
  return true;
}

testSVGUploadIntegration().catch(console.error);
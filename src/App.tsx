import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { Canvas } from './components/Canvas';
import { patternCatalog } from './data/patternCatalog';
import { generatePattern } from './utils/patternGenerators';
import { loadHeroPatterns, generateHeroPattern, HeroPattern } from './utils/heroPatterns';
import { loadPatternMonsterPatterns, generatePatternMonsterPattern, PatternMonsterPattern } from './utils/patternMonsterPatterns';
import { loadIroPatterns, generateIroPattern, IroPattern } from './utils/iroPatterns';
import { loadSveltePatterns, generateSveltePattern, SveltePattern } from './utils/sveltePatterns';
import { loadCSSPatterns, generateCSSPattern, CSSPattern } from './utils/cssPatterns';
import { loadTetoCustomPatterns, generateTetoCustomPattern, TetoCustomPattern } from './utils/tetoCustomPatterns';
import { parseSVGFiles } from './utils/svgUpload';

import { mmToPx } from './utils/unitConversion';
import { CanvasSettings, PatternState, PatternConfig, CustomPattern } from './types/patterns';
import './App.css';

function App() {
  const [heroPatterns, setHeroPatterns] = useState<HeroPattern[]>([]);
  const [patternMonsterPatterns, setPatternMonsterPatterns] = useState<PatternMonsterPattern[]>([]);
  const [iroPatterns, setIroPatterns] = useState<IroPattern[]>([]);
  const [sveltePatterns, setSveltePatterns] = useState<SveltePattern[]>([]);
  const [cssPatterns, setCSSPatterns] = useState<CSSPattern[]>([]);
  const [tetoCustomPatterns, setTetoCustomPatterns] = useState<TetoCustomPattern[]>([]);
  const [customPatterns, setCustomPatterns] = useState<CustomPattern[]>([]);
  const [uploadedSVGFiles, setUploadedSVGFiles] = useState<File[]>([]);

  const [allPatterns, setAllPatterns] = useState<PatternConfig[]>(patternCatalog);
  

  
  const [state, setState] = useState<PatternState>({
    selectedPattern: 'checkerboard',
    canvasSettings: {
      width: 600,
      height: 400,
      unit: 'px',
      tileSize: 30,
    },
    patternParameters: {},
  });

  // Load Hero Patterns, Pattern Monster patterns, Iro patterns, Svelte patterns, and CSS patterns on mount
  useEffect(() => {
    Promise.all([
      loadHeroPatterns(), 
      loadPatternMonsterPatterns(),
      loadIroPatterns(),
      loadSveltePatterns(),
      loadCSSPatterns(),
      loadTetoCustomPatterns()
    ]).then(([heroPatts, pmPatts, iroPatts, sveltePatts, cssPatts, tetoCustomPatts]) => {
      setHeroPatterns(heroPatts);
      setPatternMonsterPatterns(pmPatts);
      setIroPatterns(iroPatts);
      setSveltePatterns(sveltePatts);
      setCSSPatterns(cssPatts);
      setTetoCustomPatterns(tetoCustomPatts);
      
      // Create pattern config entries for Hero Patterns
      const heroPatternConfigs: PatternConfig[] = heroPatts.map((pattern) => ({
        id: `hero-${pattern.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: pattern.name,
        category: 'Hero Patterns',
        description: `Hero Pattern: ${pattern.name}`,
        complexity: 1,
        parameters: [
          {
            id: 'scale',
            label: 'Scale',
            type: 'slider',
            min: 0.25,
            max: 3,
            step: 0.25,
            default: 1,
          },
        ],
      }));
      
      // Create pattern config entries for Pattern Monster patterns
      const patternMonsterConfigs: PatternConfig[] = pmPatts.map((pattern) => ({
        id: `pm-${pattern.id}`,
        name: pattern.name,
        category: `Pattern Monster - ${pattern.subcategory}`,
        description: `Pattern Monster: ${pattern.name}`,
        complexity: 1,
        parameters: [
          {
            id: 'scale',
            label: 'Scale',
            type: 'slider',
            min: 0.25,
            max: 3,
            step: 0.25,
            default: 1,
          },
          ...(pattern.mode === 'stroke' || pattern.mode === 'stroke-join' ? [{
            id: 'strokeWidth',
            label: 'Stroke Width',
            type: 'slider' as const,
            min: 0.5,
            max: 10,
            step: 0.5,
            default: 2,
          }] : []),
        ],
      }));
      
      // Create pattern config entries for Iro patterns
      const iroConfigs: PatternConfig[] = iroPatts.map((pattern) => ({
        id: `iro-${pattern.id}`,
        name: pattern.name,
        category: 'Iro Patternfills',
        description: `Iro Pattern: ${pattern.name}`,
        complexity: 1,
        parameters: [
          {
            id: 'scale',
            label: 'Scale',
            type: 'slider',
            min: 0.25,
            max: 3,
            step: 0.25,
            default: 1,
          },
          ...(pattern.mode === 'stroke' || pattern.mode === 'stroke-join' ? [{
            id: 'strokeWidth',
            label: 'Stroke Width',
            type: 'slider' as const,
            min: 0.5,
            max: 10,
            step: 0.5,
            default: 2,
          }] : []),
        ],
      }));
      
      // Create pattern config entries for Svelte patterns
      const svelteConfigs: PatternConfig[] = sveltePatts.map((pattern) => ({
        id: `svelte-${pattern.id}`,
        name: pattern.name,
        category: 'Svelte SVG Patterns',
        description: `Svelte Pattern: ${pattern.name}`,
        complexity: 1,
        parameters: [
          {
            id: 'scale',
            label: 'Scale',
            type: 'slider',
            min: 0.25,
            max: 3,
            step: 0.25,
            default: 1,
          },
          ...(pattern.mode === 'stroke' || pattern.mode === 'stroke-join' ? [{
            id: 'strokeWidth',
            label: 'Stroke Width',
            type: 'slider' as const,
            min: 0.5,
            max: 10,
            step: 0.5,
            default: 2,
          }] : []),
        ],
      }));
      
      // Create pattern config entries for CSS patterns
      const cssConfigs: PatternConfig[] = cssPatts.map((pattern) => ({
        id: `css-${pattern.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: pattern.name,
        category: 'CSS Patterns',
        description: `CSS Pattern: ${pattern.name}`,
        complexity: 1,
        parameters: [
          {
            id: 'scale',
            label: 'Scale',
            type: 'slider' as const,
            min: 0.25,
            max: 3,
            step: 0.25,
            default: 1,
          },
        ],
      }));
      
      // Create pattern config entries for Teto Custom Patterns
      const tetoCustomConfigs: PatternConfig[] = tetoCustomPatts.map((pattern) => ({
        id: `teto-${pattern.id}`,
        name: pattern.name,
        category: `🧱 Teto Custom`,
        description: `Teto Custom: ${pattern.name}`,
        complexity: 1,
        parameters: [
          {
            id: 'scale',
            label: 'Scale',
            type: 'slider' as const,
            min: 0.25,
            max: 3,
            step: 0.25,
            default: 1,
          },
          {
            id: 'strokeWidth',
            label: 'Stroke Width',
            type: 'slider' as const,
            min: 0.5,
            max: 10,
            step: 0.5,
            default: 2,
          },
        ],
      }));
      
      // Combine all patterns with deduplication by ID
      const allConfigs = [...patternCatalog, ...heroPatternConfigs, ...patternMonsterConfigs, ...iroConfigs, ...svelteConfigs, ...cssConfigs, ...tetoCustomConfigs, ...customPatterns];
      
      // Remove duplicates based on pattern ID
      const seenIds = new Set();
      const finalPatterns = allConfigs.filter(pattern => {
        if (seenIds.has(pattern.id)) {
          console.log('⚠️ Duplicate pattern ID found in initial load, skipping:', pattern.id);
          return false;
        }
        seenIds.add(pattern.id);
        return true;
      });
      
      setAllPatterns(finalPatterns);
    });
  }, []);

  // Load custom patterns from localStorage on mount
  useEffect(() => {
    const savedCustomPatterns = localStorage.getItem('svg-pattern-generator-custom-patterns');
    if (savedCustomPatterns) {
      try {
        const parsed = JSON.parse(savedCustomPatterns);
        setCustomPatterns(parsed);
      } catch (error) {
        console.warn('Failed to load custom patterns from localStorage:', error);
      }
    }
  }, []);

  // Save custom patterns to localStorage whenever they change
  useEffect(() => {
    if (customPatterns.length > 0) {
      localStorage.setItem('svg-pattern-generator-custom-patterns', JSON.stringify(customPatterns));
    }
  }, [customPatterns]);

  // Regenerate all patterns including custom patterns
  const regenerateAllPatterns = async () => {
    console.log('🔄 Regenerating all patterns...', { 
      customPatternsCount: customPatterns.length,
      heroPatternsCount: heroPatterns.length,
      patternMonsterPatternsCount: patternMonsterPatterns.length,
      iroPatternsCount: iroPatterns.length,
      sveltePatternsCount: sveltePatterns.length,
      cssPatternsCount: cssPatterns.length
    });

    // Create pattern config entries for custom patterns
    const customPatternConfigs: PatternConfig[] = customPatterns.map((pattern) => ({
      id: pattern.id,
      name: pattern.name,
      category: 'Custom Patterns',
      description: pattern.description,
      complexity: 1,
      parameters: [
        {
          id: 'scale',
          label: 'Scale',
          type: 'slider' as const,
          min: 0.25,
          max: 3,
          step: 0.25,
          default: 1,
        },
      ],
    }));

    // Create pattern config entries for Hero Patterns
    const heroPatternConfigs: PatternConfig[] = heroPatterns.map((pattern) => ({
      id: `hero-${pattern.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: pattern.name,
      category: 'Hero Patterns',
      description: `Hero Pattern: ${pattern.name}`,
      complexity: 1,
      parameters: [
        {
          id: 'scale',
          label: 'Scale',
          type: 'slider',
          min: 0.25,
          max: 3,
          step: 0.25,
          default: 1,
        },
      ],
    }));
    
    // Create pattern config entries for Pattern Monster patterns
    const patternMonsterConfigs: PatternConfig[] = patternMonsterPatterns.map((pattern) => ({
      id: `pm-${pattern.id}`,
      name: pattern.name,
      category: `Pattern Monster - ${pattern.subcategory}`,
      description: `Pattern Monster: ${pattern.name}`,
      complexity: 1,
      parameters: [
        {
          id: 'scale',
          label: 'Scale',
          type: 'slider',
          min: 0.25,
          max: 3,
          step: 0.25,
          default: 1,
        },
        ...(pattern.mode === 'stroke' || pattern.mode === 'stroke-join' ? [{
          id: 'strokeWidth',
          label: 'Stroke Width',
          type: 'slider' as const,
          min: 0.5,
          max: 10,
          step: 0.5,
          default: 2,
        }] : []),
      ],
    }));
    
    // Create pattern config entries for Iro patterns
    const iroConfigs: PatternConfig[] = iroPatterns.map((pattern) => ({
      id: `iro-${pattern.id}`,
      name: pattern.name,
      category: 'Iro Patternfills',
      description: `Iro Pattern: ${pattern.name}`,
      complexity: 1,
      parameters: [
        {
          id: 'scale',
          label: 'Scale',
          type: 'slider',
          min: 0.25,
          max: 3,
          step: 0.25,
          default: 1,
        },
        ...(pattern.mode === 'stroke' || pattern.mode === 'stroke-join' ? [{
          id: 'strokeWidth',
          label: 'Stroke Width',
          type: 'slider' as const,
          min: 0.5,
          max: 10,
          step: 0.5,
          default: 2,
        }] : []),
      ],
    }));
    
    // Create pattern config entries for Svelte patterns
    const svelteConfigs: PatternConfig[] = sveltePatterns.map((pattern) => ({
      id: `svelte-${pattern.id}`,
      name: pattern.name,
      category: 'Svelte SVG Patterns',
      description: `Svelte Pattern: ${pattern.name}`,
      complexity: 1,
      parameters: [
        {
          id: 'scale',
          label: 'Scale',
          type: 'slider',
          min: 0.25,
          max: 3,
          step: 0.25,
          default: 1,
        },
        ...(pattern.mode === 'stroke' || pattern.mode === 'stroke-join' ? [{
          id: 'strokeWidth',
          label: 'Stroke Width',
          type: 'slider' as const,
          min: 0.5,
          max: 10,
          step: 0.5,
          default: 2,
        }] : []),
      ],
    }));
    
    // Create pattern config entries for CSS patterns
    const cssConfigs: PatternConfig[] = cssPatterns.map((pattern) => ({
      id: `css-${pattern.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: pattern.name,
      category: 'CSS Patterns',
      description: `CSS Pattern: ${pattern.name}`,
      complexity: 1,
      parameters: [
        {
          id: 'scale',
          label: 'Scale',
          type: 'slider' as const,
          min: 0.25,
          max: 3,
          step: 0.25,
          default: 1,
        },
      ],
    }));
    
    // Combine all patterns with deduplication by ID
    const allConfigs = [
      ...patternCatalog,
      ...heroPatternConfigs,
      ...patternMonsterConfigs,
      ...iroConfigs,
      ...svelteConfigs,
      ...cssConfigs,
      ...customPatternConfigs
    ];
    
    // Remove duplicates based on pattern ID
    const seenIds = new Set();
    const finalPatterns = allConfigs.filter(pattern => {
      if (seenIds.has(pattern.id)) {
        console.log('⚠️ Duplicate pattern ID found, skipping:', pattern.id);
        return false;
      }
      seenIds.add(pattern.id);
      return true;
    });
    
    console.log('✅ Updated allPatterns with', finalPatterns.length, 'total patterns');
    console.log('📋 Custom patterns included:', customPatternConfigs.map(p => p.name));
    
    setAllPatterns(finalPatterns);
  };

  // Call regenerate when custom patterns change
  useEffect(() => {
    console.log('🔔 Custom patterns changed:', customPatterns.length, 'patterns');
    regenerateAllPatterns();
  }, [customPatterns]);

  // Add explicit useEffect to update allPatterns when customPatterns change
  // This ensures the dropdown gets updated immediately
  useEffect(() => {
    if (customPatterns.length > 0) {
      console.log('🔄 Explicitly updating allPatterns due to custom patterns change');
      
      // Create pattern config entries for custom patterns
      const customPatternConfigs: PatternConfig[] = customPatterns.map((pattern) => ({
        id: pattern.id,
        name: pattern.name,
        category: 'Custom Patterns',
        description: pattern.description,
        complexity: 1,
        parameters: [
          {
            id: 'scale',
            label: 'Scale',
            type: 'slider' as const,
            min: 0.25,
            max: 3,
            step: 0.25,
            default: 1,
          },
        ],
      }));

      // Find existing patterns (excluding old custom patterns)
      const existingPatterns = allPatterns.filter(p => p.category !== 'Custom Patterns');
      
      // Add new custom patterns to existing patterns
      const combinedPatterns = [...existingPatterns, ...customPatternConfigs];
      
      // Remove duplicates based on pattern ID
      const seenIds = new Set();
      const updatedPatterns = combinedPatterns.filter(pattern => {
        if (seenIds.has(pattern.id)) {
          console.log('⚠️ Duplicate pattern ID found in explicit update, skipping:', pattern.id);
          return false;
        }
        seenIds.add(pattern.id);
        return true;
      });
      
      console.log('🔄 Updated patterns array:', {
        total: updatedPatterns.length,
        existing: existingPatterns.length,
        custom: customPatternConfigs.length,
        customNames: customPatternConfigs.map(p => p.name)
      });
      
      setAllPatterns(updatedPatterns);
    }
  }, [customPatterns]);

  // Debug logging for allPatterns changes
  useEffect(() => {
    console.log('📊 allPatterns updated:', {
      totalPatterns: allPatterns.length,
      categories: [...new Set(allPatterns.map(p => p.category))],
      customPatterns: allPatterns.filter(p => p.category === 'Custom Patterns').map(p => p.name)
    });
  }, [allPatterns]);

  // Initialize pattern parameters with defaults
  useEffect(() => {
    const currentPattern = allPatterns.find((p) => p.id === state.selectedPattern);
    if (currentPattern) {
      const defaultParams: Record<string, any> = {};
      currentPattern.parameters.forEach((param) => {
        defaultParams[param.id] = param.default;
      });
      setState((prev) => ({
        ...prev,
        patternParameters: defaultParams,
      }));
    }
  }, [state.selectedPattern, allPatterns]);

  // Always work in pixels internally for pattern generation
  const pixelWidth = useMemo(() => {
    return state.canvasSettings.unit === 'mm' 
      ? mmToPx(state.canvasSettings.width)
      : state.canvasSettings.width;
  }, [state.canvasSettings.width, state.canvasSettings.unit]);

  const pixelHeight = useMemo(() => {
    return state.canvasSettings.unit === 'mm'
      ? mmToPx(state.canvasSettings.height)
      : state.canvasSettings.height;
  }, [state.canvasSettings.height, state.canvasSettings.unit]);

  // Generate SVG content
  const svgContent = useMemo(() => {
    // Check if this is a Hero Pattern
    if (state.selectedPattern.startsWith('hero-')) {
      const heroPattern = heroPatterns.find(
        (p) => `hero-${p.name.toLowerCase().replace(/\s+/g, '-')}` === state.selectedPattern
      );
      
      if (heroPattern) {
        const scale = state.patternParameters.scale || 1;
        return generateHeroPattern(heroPattern, pixelWidth, pixelHeight, scale);
      }
    }
    
    // Check if this is a Pattern Monster pattern
    if (state.selectedPattern.startsWith('pm-')) {
      const patternId = state.selectedPattern.substring(3); // Remove 'pm-' prefix
      const pmPattern = patternMonsterPatterns.find((p) => p.id === patternId);
      
      if (pmPattern) {
        const scale = state.patternParameters.scale || 1;
        const strokeWidth = state.patternParameters.strokeWidth || 2;
        return generatePatternMonsterPattern(pmPattern, pixelWidth, pixelHeight, scale, strokeWidth);
      }
    }
    
    // Check if this is an Iro pattern
    if (state.selectedPattern.startsWith('iro-')) {
      const patternId = state.selectedPattern.substring(4); // Remove 'iro-' prefix
      const iroPattern = iroPatterns.find((p) => p.id === patternId);
      
      if (iroPattern) {
        const scale = state.patternParameters.scale || 1;
        const strokeWidth = state.patternParameters.strokeWidth || 2;
        return generateIroPattern(iroPattern, pixelWidth, pixelHeight, scale, strokeWidth);
      }
    }
    
    // Check if this is a Svelte pattern
    if (state.selectedPattern.startsWith('svelte-')) {
      const patternId = state.selectedPattern.substring(7); // Remove 'svelte-' prefix
      const sveltePattern = sveltePatterns.find((p) => p.id === patternId);
      
      if (sveltePattern) {
        const scale = state.patternParameters.scale || 1;
        const strokeWidth = state.patternParameters.strokeWidth || 2;
        return generateSveltePattern(sveltePattern, pixelWidth, pixelHeight, scale, strokeWidth);
      }
    }
    
    // Check if this is a CSS pattern
    if (state.selectedPattern.startsWith('css-')) {
      const patternName = state.selectedPattern.substring(4); // Remove 'css-' prefix
      const cssPattern = cssPatterns.find(
        (p) => p.name.toLowerCase().replace(/\s+/g, '-') === patternName
      );
      
      if (cssPattern) {
        const scale = state.patternParameters.scale || 1;
        return generateCSSPattern(cssPattern, pixelWidth, pixelHeight, scale);
      }
    }
    
    // Check if this is a Teto Custom pattern
    if (state.selectedPattern.startsWith('teto-')) {
      const patternId = state.selectedPattern.substring(5); // Remove 'teto-' prefix
      const tetoPattern = tetoCustomPatterns.find((p) => p.id === patternId);
      
      if (tetoPattern) {
        const scale = state.patternParameters.scale || 1;
        const strokeWidth = state.patternParameters.strokeWidth || 2;
        return generateTetoCustomPattern(tetoPattern, pixelWidth, pixelHeight, scale, strokeWidth);
      }
    }
    
    // Check if this is a custom pattern
    if (state.selectedPattern.startsWith('custom-')) {
      console.log('🎨 Rendering custom pattern:', state.selectedPattern);
      const customPattern = customPatterns.find((p) => p.id === state.selectedPattern);
      
      if (customPattern) {
        console.log('✅ Found custom pattern:', customPattern.name);
        const scale = state.patternParameters.scale || 1;
        // Extract the pattern content from the SVG
        const svgMatch = customPattern.svgContent.match(/<svg[^>]*>(.*?)<\/svg>/s);
        if (svgMatch) {
          const patternContent = svgMatch[1];
          console.log('📋 Extracted pattern content length:', patternContent.length);
          // Create a tiled pattern by repeating the content
          const tileSize = state.canvasSettings.tileSize || 30;
          const tilesX = Math.ceil(pixelWidth / tileSize);
          const tilesY = Math.ceil(pixelHeight / tileSize);
          
          console.log('🔢 Tile grid:', { tilesX, tilesY, tileSize, scale });
          
          let tiledContent = '';
          for (let y = 0; y < tilesY; y++) {
            for (let x = 0; x < tilesX; x++) {
              const transform = `translate(${x * tileSize}, ${y * tileSize}) scale(${scale})`;
              tiledContent += `<g transform="${transform}">${patternContent}</g>`;
            }
          }
          
          console.log('🖼️ Generated tiled content length:', tiledContent.length);
          return tiledContent;
        } else {
          console.log('❌ Could not extract pattern content from SVG');
        }
      } else {
        console.log('❌ Custom pattern not found:', state.selectedPattern);
        console.log('Available custom patterns:', customPatterns.map(p => p.id));
      }
    }

    // Otherwise use algorithmic pattern generation
    return generatePattern(
      state.selectedPattern,
      pixelWidth,
      pixelHeight,
      state.patternParameters
    );
  }, [state.selectedPattern, pixelWidth, pixelHeight, state.patternParameters, heroPatterns, patternMonsterPatterns, iroPatterns, sveltePatterns, cssPatterns, tetoCustomPatterns, customPatterns]);

  const handlePatternChange = (patternId: string) => {
    setState((prev) => ({
      ...prev,
      selectedPattern: patternId,
    }));
  };

  const handleCanvasSettingChange = (key: keyof CanvasSettings, value: any) => {
    setState((prev) => ({
      ...prev,
      canvasSettings: {
        ...prev.canvasSettings,
        [key]: value,
      },
    }));
  };

  const handleUnitChange = (newUnit: 'px' | 'mm') => {
    // Just switch the unit label, keep the same numeric values
    setState((prev) => ({
      ...prev,
      canvasSettings: {
        ...prev.canvasSettings,
        unit: newUnit,
      },
    }));
  };

  const handlePatternParamChange = (paramId: string, value: any) => {
    setState((prev) => ({
      ...prev,
      patternParameters: {
        ...prev.patternParameters,
        [paramId]: value,
      },
    }));
  };

  const handleSVGUpload = async (svgFiles: File[]) => {
    try {
      // Parse uploaded SVG files using the utility function
      const results = await parseSVGFiles(svgFiles);
      
      // Update uploaded SVG files state
      setUploadedSVGFiles(prev => [...prev, ...svgFiles]);
      
      // Process successful uploads
      const successfulResults = results.filter(result => result.success && result.data);
      
      if (successfulResults.length > 0) {
        // Create CustomPattern entries from parsed results
        const newCustomPatterns: CustomPattern[] = successfulResults.map(result => {
          const data = result.data!;
          return {
            id: data.id,
            name: data.name,
            category: 'Custom Patterns',
            description: data.description,
            complexity: data.complexity,
            parameters: [
              {
                id: 'scale',
                label: 'Scale',
                type: 'slider',
                min: 0.25,
                max: 3,
                step: 0.25,
                default: 1,
              },
            ],
            svgContent: data.svgContent,
            originalFileName: data.metadata.fileName,
            uploadTimestamp: Date.now(),
          };
        });
        
        // Add to custom patterns
        console.log('📤 Adding', newCustomPatterns.length, 'new custom patterns:', newCustomPatterns.map(p => p.name));
        setCustomPatterns(prev => [...prev, ...newCustomPatterns]);
        
        // Switch to the most recently uploaded pattern
        const latestPattern = newCustomPatterns[newCustomPatterns.length - 1];
        if (latestPattern) {
          console.log('🎯 Switching to newly uploaded pattern:', latestPattern.name);
          setState((prev) => ({
            ...prev,
            selectedPattern: latestPattern.id,
          }));
        }
      }
      
      // Log any errors for debugging
      const failedResults = results.filter(result => !result.success);
      if (failedResults.length > 0) {
        console.warn('Some SVG uploads failed:', failedResults.map(r => r.error));
      }
      
    } catch (error) {
      console.error('Error processing SVG uploads:', error);
    }
  };

  const handleExport = () => {
    const { width, height, unit } = state.canvasSettings;
    const currentPattern = allPatterns.find((p) => p.id === state.selectedPattern);
    const patternName = currentPattern?.name.toLowerCase().replace(/\s+/g, '-') || 'pattern';

    // Use pixel dimensions for viewBox, set width/height with units
    const widthAttr = unit === 'mm' ? `${width}mm` : `${width}`;
    const heightAttr = unit === 'mm' ? `${height}mm` : `${height}`;

    const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${widthAttr}" height="${heightAttr}" viewBox="0 0 ${pixelWidth} ${pixelHeight}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="white"/>
  ${svgContent}
</svg>`;

    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${patternName}-${width}x${height}${unit}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onExport={handleExport} customPatternsCount={customPatterns.length} />
      
      {/* Vertical Stack Layout: Canvas Top (Full Width) + Controls Below (Full Width) */}
      <div className="flex flex-col pt-16">
        <Canvas
          width={pixelWidth}
          height={pixelHeight}
          unit={state.canvasSettings.unit}
          displayWidth={state.canvasSettings.width}
          displayHeight={state.canvasSettings.height}
          svgContent={svgContent}
        />
        <ControlPanel
          key={`patterns-${allPatterns.length}-${customPatterns.length}`} // Force re-render when patterns change
          patterns={allPatterns}
          selectedPattern={state.selectedPattern}
          onPatternChange={handlePatternChange}
          canvasWidth={state.canvasSettings.width}
          canvasHeight={state.canvasSettings.height}
          unit={state.canvasSettings.unit}
          tileSize={state.canvasSettings.tileSize}
          onCanvasWidthChange={(width) => handleCanvasSettingChange('width', width)}
          onCanvasHeightChange={(height) => handleCanvasSettingChange('height', height)}
          onUnitChange={handleUnitChange}
          onTileSizeChange={(size) => handleCanvasSettingChange('tileSize', size)}
          patternParams={state.patternParameters}
          onPatternParamChange={handlePatternParamChange}
          onSVGUpload={handleSVGUpload}
        />
      </div>
    </div>
  );
}

export default App;

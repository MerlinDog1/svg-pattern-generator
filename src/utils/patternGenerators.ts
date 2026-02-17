// Seeded random number generator for reproducible patterns
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

// Helper function to create SVG path commands
export function generatePattern(
  patternId: string,
  width: number,
  height: number,
  params: Record<string, any>
): string {
  const generators: Record<string, (w: number, h: number, p: Record<string, any>) => string> = {
    'checkerboard': generateCheckerboard,
    'brick': generateBrick,
    'herringbone': generateHerringbone,
    'basketweave': generateBasketweave,
    'truchet-triangles': generateTruchetTriangles,
    'truchet-arcs': generateTruchetArcs,
    'hexagonal-grid': generateHexagonalGrid,
    'triangular-grid': generateTriangularGrid,
    'square-grid': generateSquareGrid,
    'star-8': generateStar8,
    'girih': generateGirih,
    'maze-recursive': generateMaze,
    'fish-scales': generateFishScales,
    'waves': generateWaves,
    'crosshatch': generateCrosshatch,
    'stipple': generateStipple,
    'dots-grid': generateDotsGrid,
  };

  const generator = generators[patternId];
  if (!generator) {
    return '<rect width="100%" height="100%" fill="white"/>';
  }

  return generator(width, height, params);
}

// Classic Patterns
function generateCheckerboard(width: number, height: number, params: Record<string, any>): string {
  const squareSize = params.squareSize || 30;
  const cols = Math.ceil(width / squareSize);
  const rows = Math.ceil(height / squareSize);
  let shapes = '';

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if ((row + col) % 2 === 0) {
        const x = col * squareSize;
        const y = row * squareSize;
        shapes += `<rect x="${x}" y="${y}" width="${squareSize}" height="${squareSize}" fill="black"/>`;
      }
    }
  }

  return shapes;
}

function generateBrick(width: number, height: number, params: Record<string, any>): string {
  const brickWidth = params.brickWidth || 60;
  const brickHeight = params.brickHeight || 30;
  const mortarWidth = params.mortarWidth || 2;
  const rows = Math.ceil(height / brickHeight);
  const cols = Math.ceil(width / brickWidth);
  let shapes = '';

  for (let row = 0; row < rows; row++) {
    const offset = (row % 2) * (brickWidth / 2);
    for (let col = -1; col < cols + 1; col++) {
      const x = col * brickWidth + offset;
      const y = row * brickHeight;
      
      if (x + brickWidth > 0 && x < width) {
        shapes += `<rect x="${x}" y="${y}" width="${brickWidth - mortarWidth}" height="${brickHeight - mortarWidth}" fill="black"/>`;
      }
    }
  }

  return shapes;
}

function generateHerringbone(width: number, height: number, params: Record<string, any>): string {
  const tileLength = params.tileLength || 60;
  const tileWidth = params.tileWidth || 20;
  const spacing = params.spacing || 2;
  const unitSize = tileLength + spacing;
  let shapes = '';

  const rows = Math.ceil(height / unitSize) + 2;
  const cols = Math.ceil(width / unitSize) + 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * unitSize;
      const y = row * unitSize;
      
      // Draw two perpendicular rectangles forming V-shape
      shapes += `<rect x="${x}" y="${y}" width="${tileLength}" height="${tileWidth}" fill="black"/>`;
      shapes += `<rect x="${x}" y="${y}" width="${tileWidth}" height="${tileLength}" fill="black"/>`;
    }
  }

  return shapes;
}

function generateBasketweave(width: number, height: number, params: Record<string, any>): string {
  const tileWidth = params.tileWidth || 40;
  const groupSize = params.groupSize || 2;
  const spacing = params.spacing || 2;
  const unitSize = tileWidth * groupSize;
  let shapes = '';

  const rows = Math.ceil(height / unitSize) + 1;
  const cols = Math.ceil(width / unitSize) + 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * unitSize;
      const y = row * unitSize;
      const isHorizontal = (row + col) % 2 === 0;

      for (let i = 0; i < groupSize; i++) {
        if (isHorizontal) {
          shapes += `<rect x="${x}" y="${y + i * tileWidth}" width="${unitSize - spacing}" height="${tileWidth - spacing}" fill="black"/>`;
        } else {
          shapes += `<rect x="${x + i * tileWidth}" y="${y}" width="${tileWidth - spacing}" height="${unitSize - spacing}" fill="black"/>`;
        }
      }
    }
  }

  return shapes;
}

// Truchet Patterns
function generateTruchetTriangles(width: number, height: number, params: Record<string, any>): string {
  const tileSize = params.tileSize || 30;
  const seed = params.seed || 42;
  const random = new SeededRandom(seed);
  
  const cols = Math.ceil(width / tileSize);
  const rows = Math.ceil(height / tileSize);
  let shapes = '';

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * tileSize;
      const y = row * tileSize;
      const orientation = Math.floor(random.next() * 4);

      const corners = [
        [x, y],
        [x + tileSize, y],
        [x + tileSize, y + tileSize],
        [x, y + tileSize],
      ];

      // Create triangle based on random orientation
      const idx = orientation;
      const points = [
        corners[idx],
        corners[(idx + 1) % 4],
        corners[(idx + 2) % 4],
      ];

      shapes += `<polygon points="${points.map(p => p.join(',')).join(' ')}" fill="black"/>`;
    }
  }

  return shapes;
}

function generateTruchetArcs(width: number, height: number, params: Record<string, any>): string {
  const tileSize = params.tileSize || 30;
  const lineThickness = params.lineThickness || 2;
  const seed = params.seed || 42;
  const random = new SeededRandom(seed);
  
  const cols = Math.ceil(width / tileSize);
  const rows = Math.ceil(height / tileSize);
  const r = tileSize / 2;
  let shapes = '';

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * tileSize;
      const y = row * tileSize;
      const orientation = random.next() < 0.5 ? 0 : 1;

      if (orientation === 0) {
        // Arcs from top-left to bottom-right
        shapes += `<path d="M ${x + r} ${y} A ${r} ${r} 0 0 1 ${x} ${y + r}" fill="none" stroke="black" stroke-width="${lineThickness}"/>`;
        shapes += `<path d="M ${x + tileSize} ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y + tileSize}" fill="none" stroke="black" stroke-width="${lineThickness}"/>`;
      } else {
        // Arcs from top-right to bottom-left
        shapes += `<path d="M ${x + r} ${y} A ${r} ${r} 0 0 0 ${x + tileSize} ${y + r}" fill="none" stroke="black" stroke-width="${lineThickness}"/>`;
        shapes += `<path d="M ${x} ${y + r} A ${r} ${r} 0 0 0 ${x + r} ${y + tileSize}" fill="none" stroke="black" stroke-width="${lineThickness}"/>`;
      }
    }
  }

  return shapes;
}

// Geometric Patterns
function generateHexagonalGrid(width: number, height: number, params: Record<string, any>): string {
  const hexSize = params.hexSize || 30;
  const lineThickness = params.lineThickness || 1.5;
  const hexWidth = hexSize * 2;
  const hexHeight = Math.sqrt(3) * hexSize;
  let shapes = '';

  const cols = Math.ceil(width / (hexWidth * 0.75)) + 2;
  const rows = Math.ceil(height / hexHeight) + 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * hexWidth * 0.75;
      const y = row * hexHeight + (col % 2) * (hexHeight / 2);

      const points: [number, number][] = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        points.push([
          x + hexSize * Math.cos(angle),
          y + hexSize * Math.sin(angle),
        ]);
      }

      shapes += `<polygon points="${points.map(p => p.join(',')).join(' ')}" fill="none" stroke="black" stroke-width="${lineThickness}"/>`;
    }
  }

  return shapes;
}

function generateTriangularGrid(width: number, height: number, params: Record<string, any>): string {
  const triangleSize = params.triangleSize || 30;
  const lineThickness = params.lineThickness || 1.5;
  const h = triangleSize * Math.sqrt(3) / 2;
  let shapes = '';

  const cols = Math.ceil(width / triangleSize) + 2;
  const rows = Math.ceil(height / h) + 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * (triangleSize / 2);
      const y = row * h;
      const pointUp = (row + col) % 2 === 0;

      if (pointUp) {
        const points = [
          [x, y + h],
          [x + triangleSize / 2, y],
          [x + triangleSize, y + h],
        ];
        shapes += `<polygon points="${points.map(p => p.join(',')).join(' ')}" fill="none" stroke="black" stroke-width="${lineThickness}"/>`;
      } else {
        const points = [
          [x, y],
          [x + triangleSize / 2, y + h],
          [x + triangleSize, y],
        ];
        shapes += `<polygon points="${points.map(p => p.join(',')).join(' ')}" fill="none" stroke="black" stroke-width="${lineThickness}"/>`;
      }
    }
  }

  return shapes;
}

function generateSquareGrid(width: number, height: number, params: Record<string, any>): string {
  const cellSize = params.cellSize || 30;
  const lineThickness = params.lineThickness || 1.5;
  let shapes = '';

  // Vertical lines
  for (let x = 0; x <= width; x += cellSize) {
    shapes += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="black" stroke-width="${lineThickness}"/>`;
  }

  // Horizontal lines
  for (let y = 0; y <= height; y += cellSize) {
    shapes += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="black" stroke-width="${lineThickness}"/>`;
  }

  return shapes;
}

// Islamic Patterns
function generateStar8(width: number, height: number, params: Record<string, any>): string {
  const starRadius = params.starRadius || 40;
  const gridSpacing = params.gridSpacing || 120;
  const lineThickness = params.lineThickness || 2;
  let shapes = '';

  const cols = Math.ceil(width / gridSpacing) + 1;
  const rows = Math.ceil(height / gridSpacing) + 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * gridSpacing;
      const cy = row * gridSpacing;

      // Draw 8-pointed star
      const points: [number, number][] = [];
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI / 4) * i;
        const r = i % 2 === 0 ? starRadius : starRadius * 0.5;
        points.push([
          cx + r * Math.cos(angle),
          cy + r * Math.sin(angle),
        ]);
      }

      shapes += `<polygon points="${points.map(p => p.join(',')).join(' ')}" fill="none" stroke="black" stroke-width="${lineThickness}"/>`;
      
      // Add connecting lines to adjacent stars
      if (col < cols - 1) {
        shapes += `<line x1="${cx + starRadius}" y1="${cy}" x2="${cx + gridSpacing - starRadius}" y2="${cy}" stroke="black" stroke-width="${lineThickness}"/>`;
      }
      if (row < rows - 1) {
        shapes += `<line x1="${cx}" y1="${cy + starRadius}" x2="${cx}" y2="${cy + gridSpacing - starRadius}" stroke="black" stroke-width="${lineThickness}"/>`;
      }
    }
  }

  return shapes;
}

function generateGirih(width: number, height: number, params: Record<string, any>): string {
  const tileSize = params.tileSize || 60;
  const lineThickness = params.lineThickness || 2;
  let shapes = '';

  const cols = Math.ceil(width / tileSize) + 1;
  const rows = Math.ceil(height / tileSize) + 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * tileSize;
      const y = row * tileSize;

      // Simple girih-inspired pattern with diagonal crosses
      shapes += `<line x1="${x}" y1="${y}" x2="${x + tileSize}" y2="${y + tileSize}" stroke="black" stroke-width="${lineThickness}"/>`;
      shapes += `<line x1="${x + tileSize}" y1="${y}" x2="${x}" y2="${y + tileSize}" stroke="black" stroke-width="${lineThickness}"/>`;
      shapes += `<rect x="${x}" y="${y}" width="${tileSize}" height="${tileSize}" fill="none" stroke="black" stroke-width="${lineThickness}"/>`;
    }
  }

  return shapes;
}

// Maze Pattern
function generateMaze(width: number, height: number, params: Record<string, any>): string {
  const cellSize = params.cellSize || 20;
  const wallThickness = params.wallThickness || 2;
  const seed = params.seed || 42;
  const random = new SeededRandom(seed);

  const cols = Math.floor(width / cellSize);
  const rows = Math.floor(height / cellSize);

  // Initialize maze grid
  const maze: boolean[][] = Array(rows).fill(0).map(() => Array(cols).fill(false));
  const visited: boolean[][] = Array(rows).fill(0).map(() => Array(cols).fill(false));

  // Recursive backtracking maze generation
  const stack: [number, number][] = [];
  let currentRow = 0;
  let currentCol = 0;
  visited[currentRow][currentCol] = true;
  stack.push([currentRow, currentCol]);

  while (stack.length > 0) {
    const neighbors: [number, number, string][] = [];

    // Check all four directions
    if (currentRow > 0 && !visited[currentRow - 1][currentCol]) neighbors.push([currentRow - 1, currentCol, 'N']);
    if (currentRow < rows - 1 && !visited[currentRow + 1][currentCol]) neighbors.push([currentRow + 1, currentCol, 'S']);
    if (currentCol > 0 && !visited[currentRow][currentCol - 1]) neighbors.push([currentRow, currentCol - 1, 'W']);
    if (currentCol < cols - 1 && !visited[currentRow][currentCol + 1]) neighbors.push([currentRow, currentCol + 1, 'E']);

    if (neighbors.length > 0) {
      const [nextRow, nextCol] = neighbors[Math.floor(random.next() * neighbors.length)];
      visited[nextRow][nextCol] = true;
      stack.push([nextRow, nextCol]);
      currentRow = nextRow;
      currentCol = nextCol;
    } else {
      [currentRow, currentCol] = stack.pop()!;
    }
  }

  // Convert to SVG - draw cell borders where walls should be
  let shapes = '';
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * cellSize;
      const y = row * cellSize;

      // Draw walls based on maze structure (simplified - just draw grid with random gaps)
      if (random.next() > 0.3) {
        shapes += `<line x1="${x + cellSize}" y1="${y}" x2="${x + cellSize}" y2="${y + cellSize}" stroke="black" stroke-width="${wallThickness}"/>`;
      }
      if (random.next() > 0.3) {
        shapes += `<line x1="${x}" y1="${y + cellSize}" x2="${x + cellSize}" y2="${y + cellSize}" stroke="black" stroke-width="${wallThickness}"/>`;
      }
    }
  }

  return shapes;
}

// Organic Patterns
function generateFishScales(width: number, height: number, params: Record<string, any>): string {
  const scaleRadius = params.scaleRadius || 30;
  const lineThickness = params.lineThickness || 1.5;
  const scaleHeight = scaleRadius * 0.866; // Height of scale row
  let shapes = '';

  const cols = Math.ceil(width / scaleRadius) + 2;
  const rows = Math.ceil(height / scaleHeight) + 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * scaleRadius + (row % 2) * (scaleRadius / 2);
      const y = row * scaleHeight;

      shapes += `<path d="M ${x} ${y + scaleHeight} A ${scaleRadius} ${scaleRadius} 0 0 1 ${x + scaleRadius} ${y + scaleHeight}" fill="none" stroke="black" stroke-width="${lineThickness}"/>`;
    }
  }

  return shapes;
}

function generateWaves(width: number, height: number, params: Record<string, any>): string {
  const wavelength = params.wavelength || 50;
  const amplitude = params.amplitude || 20;
  const lineSpacing = params.lineSpacing || 15;
  const lineThickness = params.lineThickness || 1.5;
  let shapes = '';

  const numLines = Math.ceil(height / lineSpacing);

  for (let i = 0; i < numLines; i++) {
    const y = i * lineSpacing;
    let path = `M 0 ${y}`;

    for (let x = 0; x <= width; x += wavelength / 10) {
      const waveY = y + amplitude * Math.sin((x / wavelength) * Math.PI * 2);
      path += ` L ${x} ${waveY}`;
    }

    shapes += `<path d="${path}" fill="none" stroke="black" stroke-width="${lineThickness}"/>`;
  }

  return shapes;
}

// Technical Patterns
function generateCrosshatch(width: number, height: number, params: Record<string, any>): string {
  const lineSpacing = params.lineSpacing || 10;
  const angle1 = (params.angle1 || 45) * (Math.PI / 180);
  const angle2 = (params.angle2 || -45) * (Math.PI / 180);
  const lineThickness = params.lineThickness || 1;
  let shapes = '';

  const diagonal = Math.sqrt(width * width + height * height);
  const numLines = Math.ceil(diagonal / lineSpacing);

  // First set of lines
  for (let i = -numLines; i < numLines; i++) {
    const offset = i * lineSpacing;
    const x1 = offset * Math.cos(angle1);
    const y1 = offset * Math.sin(angle1);
    const x2 = x1 + width * Math.cos(angle1 + Math.PI / 2);
    const y2 = y1 + width * Math.sin(angle1 + Math.PI / 2);

    shapes += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="black" stroke-width="${lineThickness}"/>`;
  }

  // Second set of lines
  for (let i = -numLines; i < numLines; i++) {
    const offset = i * lineSpacing;
    const x1 = offset * Math.cos(angle2);
    const y1 = offset * Math.sin(angle2);
    const x2 = x1 + width * Math.cos(angle2 + Math.PI / 2);
    const y2 = y1 + width * Math.sin(angle2 + Math.PI / 2);

    shapes += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="black" stroke-width="${lineThickness}"/>`;
  }

  return shapes;
}

function generateStipple(width: number, height: number, params: Record<string, any>): string {
  const dotSize = params.dotSize || 2;
  const density = params.density || 0.05;
  const seed = params.seed || 42;
  const random = new SeededRandom(seed);
  let shapes = '';

  const numDots = Math.floor(width * height * density);

  for (let i = 0; i < numDots; i++) {
    const x = random.next() * width;
    const y = random.next() * height;
    shapes += `<circle cx="${x}" cy="${y}" r="${dotSize}" fill="black"/>`;
  }

  return shapes;
}

function generateDotsGrid(width: number, height: number, params: Record<string, any>): string {
  const dotSize = params.dotSize || 3;
  const spacing = params.spacing || 20;
  let shapes = '';

  const cols = Math.ceil(width / spacing);
  const rows = Math.ceil(height / spacing);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * spacing + spacing / 2;
      const y = row * spacing + spacing / 2;
      shapes += `<circle cx="${x}" cy="${y}" r="${dotSize}" fill="black"/>`;
    }
  }

  return shapes;
}

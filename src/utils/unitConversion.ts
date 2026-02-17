// Unit conversion utilities
const PX_PER_MM = 3.7795275591; // 96 DPI standard (96px/inch, 25.4mm/inch)

export function mmToPx(mm: number): number {
  return Math.round(mm * PX_PER_MM);
}

export function pxToMm(px: number): number {
  return Math.round((px / PX_PER_MM) * 100) / 100; // Round to 2 decimal places
}

export function convertDimension(value: number, fromUnit: 'px' | 'mm', toUnit: 'px' | 'mm'): number {
  if (fromUnit === toUnit) return value;
  
  if (fromUnit === 'mm' && toUnit === 'px') {
    return mmToPx(value);
  }
  
  if (fromUnit === 'px' && toUnit === 'mm') {
    return pxToMm(value);
  }
  
  return value;
}

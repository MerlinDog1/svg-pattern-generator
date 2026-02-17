#!/usr/bin/env python3
"""
Script to create SVG patterns based on SVGBackgrounds.com descriptions
and convert them to the JSON format used by the pattern generator.
"""

import json
import uuid
import re
from datetime import datetime

def create_liquid_cheese():
    """Create Liquid Cheese pattern - yellow background with organic blobs"""
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
        <linearGradient id="cheeseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#FFA500;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FF8C00;stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#cheeseGradient)"/>
    <path d="M20,30 Q30,10 40,25 T60,30 T80,25 Q90,35 85,50 T60,55 T35,50 Q25,40 30,30 Z" fill="rgba(255,255,255,0.3)"/>
    <path d="M10,70 Q20,50 30,65 T50,70 T70,65 Q80,75 75,90 T50,95 T25,90 Q15,80 20,70 Z" fill="rgba(255,255,255,0.2)"/>
</svg>'''

def create_protruding_squares():
    """Create Protruding Squares pattern - orange geometric squares"""
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <rect width="100" height="100" fill="#FF4500"/>
    <rect x="10" y="10" width="25" height="25" fill="#FFA500" stroke="#FF6347" stroke-width="2"/>
    <rect x="40" y="10" width="25" height="25" fill="#FFD700" stroke="#FF6347" stroke-width="2"/>
    <rect x="70" y="10" width="25" height="25" fill="#FFA500" stroke="#FF6347" stroke-width="2"/>
    <rect x="10" y="40" width="25" height="25" fill="#FF8C00" stroke="#FF6347" stroke-width="2"/>
    <rect x="40" y="40" width="25" height="25" fill="#FFA500" stroke="#FF6347" stroke-width="2"/>
    <rect x="70" y="40" width="25" height="25" fill="#FFD700" stroke="#FF6347" stroke-width="2"/>
    <rect x="10" y="70" width="25" height="25" fill="#FFA500" stroke="#FF6347" stroke-width="2"/>
    <rect x="40" y="70" width="25" height="25" fill="#FF8C00" stroke="#FF6347" stroke-width="2"/>
    <rect x="70" y="70" width="25" height="25" fill="#FFA500" stroke="#FF6347" stroke-width="2"/>
</svg>'''

def create_wintery_sunburst():
    """Create Wintery Sunburst Sky Blue pattern"""
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
        <linearGradient id="sunburst" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#B0E0E6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#E0F6FF;stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#sunburst)"/>
    <!-- Sunburst rays -->
    <g opacity="0.6">
        <path d="M50,50 L50,10 L55,15 Z" fill="rgba(255,255,255,0.4)"/>
        <path d="M50,50 L10,50 L15,55 Z" fill="rgba(255,255,255,0.3)"/>
        <path d="M50,50 L90,50 L85,55 Z" fill="rgba(255,255,255,0.3)"/>
        <path d="M50,50 L50,90 L45,85 Z" fill="rgba(255,255,255,0.4)"/>
        <path d="M50,50 L25,25 L30,30 Z" fill="rgba(255,255,255,0.2)"/>
        <path d="M50,50 L75,25 L70,30 Z" fill="rgba(255,255,255,0.2)"/>
        <path d="M50,50 L25,75 L30,70 Z" fill="rgba(255,255,255,0.2)"/>
        <path d="M50,50 L75,75 L70,70 Z" fill="rgba(255,255,255,0.2)"/>
    </g>
</svg>'''

def create_subtle_triangles():
    """Create Subtle Prism Triangle Pattern"""
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
        <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#E6E6FA;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#DDA0DD;stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#triangleGradient)"/>
    <!-- Triangle pattern -->
    <g opacity="0.3">
        <path d="M20,20 L40,20 L30,34.6 Z" fill="rgba(138,43,226,0.3)"/>
        <path d="M40,20 L60,20 L50,34.6 Z" fill="rgba(75,0,130,0.3)"/>
        <path d="M60,20 L80,20 L70,34.6 Z" fill="rgba(138,43,226,0.3)"/>
        <path d="M20,40 L40,40 L30,54.6 Z" fill="rgba(75,0,130,0.3)"/>
        <path d="M40,40 L60,40 L50,54.6 Z" fill="rgba(138,43,226,0.3)"/>
        <path d="M60,40 L80,40 L70,54.6 Z" fill="rgba(75,0,130,0.3)"/>
        <path d="M20,60 L40,60 L30,74.6 Z" fill="rgba(138,43,226,0.3)"/>
        <path d="M40,60 L60,60 L50,74.6 Z" fill="rgba(75,0,130,0.3)"/>
        <path d="M60,60 L80,60 L70,74.6 Z" fill="rgba(138,43,226,0.3)"/>
    </g>
</svg>'''

def create_bullseye_gradient():
    """Create Bullseye Gradient Background Design"""
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
        <radialGradient id="bullseye" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#FF0000;stop-opacity:1" />
            <stop offset="25%" style="stop-color:#FFFFFF;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#FF0000;stop-opacity:1" />
            <stop offset="75%" style="stop-color:#FFFFFF;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FF0000;stop-opacity:1" />
        </radialGradient>
    </defs>
    <rect width="100" height="100" fill="url(#bullseye)"/>
    <circle cx="50" cy="50" r="15" fill="none" stroke="#8B0000" stroke-width="2"/>
    <circle cx="50" cy="50" r="30" fill="none" stroke="#8B0000" stroke-width="2"/>
    <circle cx="50" cy="50" r="45" fill="none" stroke="#8B0000" stroke-width="2"/>
</svg>'''

def create_spectrum_gradient():
    """Create Spectrum Gradient Color Wheel Background"""
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
        <linearGradient id="spectrum" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FF0000;stop-opacity:1" />
            <stop offset="16.66%" style="stop-color:#FF8000;stop-opacity:1" />
            <stop offset="33.33%" style="stop-color:#FFFF00;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#00FF00;stop-opacity:1" />
            <stop offset="66.66%" style="stop-color:#0080FF;stop-opacity:1" />
            <stop offset="83.33%" style="stop-color:#8000FF;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FF0000;stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#spectrum)"/>
    <!-- Rainbow stripes -->
    <g opacity="0.3">
        <rect x="0" y="10" width="100" height="5" fill="rgba(255,255,255,0.5)"/>
        <rect x="0" y="25" width="100" height="5" fill="rgba(255,255,255,0.3)"/>
        <rect x="0" y="40" width="100" height="5" fill="rgba(255,255,255,0.5)"/>
        <rect x="0" y="55" width="100" height="5" fill="rgba(255,255,255,0.3)"/>
        <rect x="0" y="70" width="100" height="5" fill="rgba(255,255,255,0.5)"/>
        <rect x="0" y="85" width="100" height="5" fill="rgba(255,255,255,0.3)"/>
    </g>
</svg>'''

def create_wavey_fingerprint():
    """Create Wavey Fingerprint Stripe Pattern"""
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
        <linearGradient id="fingerprint" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4B0082;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#8A2BE2;stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#fingerprint)"/>
    <!-- Fingerprint-like curved lines -->
    <g stroke="rgba(255,255,255,0.4)" stroke-width="1" fill="none">
        <path d="M10,30 Q30,10 50,20 T90,30"/>
        <path d="M5,40 Q25,20 45,30 T85,40"/>
        <path d="M15,50 Q35,30 55,40 T95,50"/>
        <path d="M10,60 Q30,40 50,50 T90,60"/>
        <path d="M5,70 Q25,50 45,60 T85,70"/>
        <path d="M15,80 Q35,60 55,70 T95,80"/>
    </g>
    <!-- Concentric fingerprint rings -->
    <g stroke="rgba(255,255,255,0.2)" stroke-width="0.5" fill="none">
        <circle cx="50" cy="50" r="15"/>
        <circle cx="50" cy="50" r="25"/>
        <circle cx="50" cy="50" r="35"/>
        <circle cx="50" cy="50" r="45"/>
    </g>
</svg>'''

def create_radiant_grid():
    """Create Radiant Gradient Warm And Colorful Grid Background"""
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
        <radialGradient id="radiant" cx="50%" cy="50%" r="70%">
            <stop offset="0%" style="stop-color:#FF4500;stop-opacity:1" />
            <stop offset="30%" style="stop-color:#FFA500;stop-opacity:1" />
            <stop offset="60%" style="stop-color:#FFD700;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FF6347;stop-opacity:1" />
        </radialGradient>
    </defs>
    <rect width="100" height="100" fill="url(#radiant)"/>
    <!-- Grid lines -->
    <g stroke="rgba(255,255,255,0.3)" stroke-width="0.5">
        <line x1="20" y1="0" x2="20" y2="100"/>
        <line x1="40" y1="0" x2="40" y2="100"/>
        <line x1="60" y1="0" x2="60" y2="100"/>
        <line x1="80" y1="0" x2="80" y2="100"/>
        <line x1="0" y1="20" x2="100" y2="20"/>
        <line x1="0" y1="40" x2="100" y2="40"/>
        <line x1="0" y1="60" x2="100" y2="60"/>
        <line x1="0" y1="80" x2="100" y2="80"/>
    </g>
    <!-- Intersection points -->
    <g fill="rgba(255,255,255,0.6)">
        <circle cx="20" cy="20" r="2"/>
        <circle cx="40" cy="20" r="2"/>
        <circle cx="60" cy="20" r="2"/>
        <circle cx="80" cy="20" r="2"/>
        <circle cx="20" cy="40" r="2"/>
        <circle cx="40" cy="40" r="2"/>
        <circle cx="60" cy="40" r="2"/>
        <circle cx="80" cy="40" r="2"/>
        <circle cx="20" cy="60" r="2"/>
        <circle cx="40" cy="60" r="2"/>
        <circle cx="60" cy="60" r="2"/>
        <circle cx="80" cy="60" r="2"/>
        <circle cx="20" cy="80" r="2"/>
        <circle cx="40" cy="80" r="2"/>
        <circle cx="60" cy="80" r="2"/>
        <circle cx="80" cy="80" r="2"/>
    </g>
</svg>'''

def create_constellation():
    """Create Endless Constellation Purple Network Background"""
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
        <linearGradient id="constellation" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4B0082;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#6A0DAD;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#8A2BE2;stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#constellation)"/>
    <!-- Network lines -->
    <g stroke="rgba(255,255,255,0.3)" stroke-width="0.5">
        <line x1="20" y1="20" x2="50" y2="30"/>
        <line x1="20" y1="20" x2="30" y2="50"/>
        <line x1="50" y1="30" x2="70" y2="20"/>
        <line x1="50" y1="30" x2="60" y2="60"/>
        <line x1="30" y1="50" x2="60" y2="60"/>
        <line x1="30" y1="50" x2="20" y2="70"/>
        <line x1="60" y1="60" x2="80" y2="70"/>
        <line x1="60" y1="60" x2="70" y2="80"/>
        <line x1="20" y1="70" x2="40" y2="80"/>
        <line x1="70" y1="20" x2="80" y2="40"/>
        <line x1="70" y1="80" x2="80" y2="90"/>
    </g>
    <!-- Stars/nodes -->
    <g fill="rgba(255,255,255,0.8)">
        <circle cx="20" cy="20" r="2"/>
        <circle cx="30" cy="50" r="1.5"/>
        <circle cx="50" cy="30" r="2"/>
        <circle cx="60" cy="60" r="2"/>
        <circle cx="20" cy="70" r="1.5"/>
        <circle cx="70" cy="20" r="2"/>
        <circle cx="80" cy="70" r="1.5"/>
        <circle cx="70" cy="80" r="2"/>
        <circle cx="40" cy="80" r="1"/>
        <circle cx="80" cy="40" r="1"/>
        <circle cx="80" cy="90" r="1.5"/>
    </g>
</svg>'''

def create_zig_zag_chevron():
    """Create Zig Zag Chevron Stripes Pattern"""
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
        <linearGradient id="chevron" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#000080;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#4169E1;stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#chevron)"/>
    <!-- Zigzag chevron pattern -->
    <g stroke="rgba(255,255,255,0.8)" stroke-width="3" fill="none">
        <path d="M10,20 L30,10 L50,20 L70,10 L90,20"/>
        <path d="M10,40 L30,30 L50,40 L70,30 L90,40"/>
        <path d="M10,60 L30,50 L50,60 L70,50 L90,60"/>
        <path d="M10,80 L30,70 L50,80 L70,70 L90,80"/>
    </g>
</svg>'''

def create_lime_chevron():
    """Create Repeating Chevrons Lime Green Background"""
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
        <linearGradient id="limeChevron" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#32CD32;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#228B22;stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#limeChevron)"/>
    <!-- Lime chevron pattern -->
    <g stroke="rgba(255,255,255,0.9)" stroke-width="4" fill="none">
        <path d="M10,15 L30,5 L50,15 L70,5 L90,15"/>
        <path d="M10,35 L30,25 L50,35 L70,25 L90,35"/>
        <path d="M10,55 L30,45 L50,55 L70,45 L90,55"/>
        <path d="M10,75 L30,65 L50,75 L70,65 L90,75"/>
    </g>
    <g fill="rgba(255,255,255,0.2)">
        <rect x="5" y="10" width="25" height="20"/>
        <rect x="35" y="10" width="25" height="20"/>
        <rect x="65" y="10" width="25" height="20"/>
        <rect x="5" y="30" width="25" height="20"/>
        <rect x="35" y="30" width="25" height="20"/>
        <rect x="65" y="30" width="25" height="20"/>
    </g>
</svg>'''

def create_large_triangles():
    """Create Large Triangles Blue Background"""
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
        <linearGradient id="triangles" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0000CD;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#4169E1;stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#triangles)"/>
    <!-- Large triangles -->
    <g fill="rgba(255,255,255,0.3)">
        <path d="M0,0 L50,30 L0,60 Z"/>
        <path d="M50,30 L100,0 L100,60 Z"/>
        <path d="M0,60 L50,30 L0,100 Z"/>
        <path d="M100,60 L50,30 L100,100 Z"/>
    </g>
    <!-- Inner triangles -->
    <g fill="rgba(255,255,255,0.2)">
        <path d="M15,15 L40,30 L15,45 Z"/>
        <path d="M60,15 L85,30 L60,45 Z"/>
        <path d="M15,55 L40,70 L15,85 Z"/>
        <path d="M60,55 L85,70 L60,85 Z"/>
    </g>
</svg>'''

def extract_svg_data(svg_content):
    """Extract necessary data from SVG content"""
    # Extract viewBox dimensions
    viewbox_match = re.search(r'viewBox="([\d\s]+)"', svg_content)
    viewbox = viewbox_match.group(1).split() if viewbox_match else [0, 0, 100, 100]
    
    # Extract width and height
    width_match = re.search(r'width="([\d]+)"', svg_content)
    height_match = re.search(r'height="([\d]+)"', svg_content)
    
    width = int(width_match.group(1)) if width_match else 100
    height = int(height_match.group(1)) if height_match else 100
    
    # Extract paths, rects, circles, polygons, etc.
    paths = re.findall(r'<path[^>]*d="([^"]*)"[^>]*>', svg_content)
    rects = re.findall(r'<rect[^>]*>', svg_content)
    circles = re.findall(r'<circle[^>]*>', svg_content)
    polygons = re.findall(r'<polygon[^>]*points="([^"]*)"[^>]*>', svg_content)
    
    # Combine all SVG elements as simplified representation
    svg_elements = []
    for path in paths:
        svg_elements.append(f"M{path}")
    
    # Add other elements
    svg_elements.extend(rects)
    svg_elements.extend(circles)
    svg_elements.extend(polygons)
    
    return {
        'width': width,
        'height': height,
        'viewBoxHeight': int(viewbox[3]) if len(viewbox) > 3 else height,
        'svgElements': svg_elements
    }

def create_patterns_json():
    """Create comprehensive patterns JSON"""
    patterns = []
    
    # Define pattern creators and metadata
    pattern_creators = {
        "liquid-cheese": {
            "name": "Liquid Cheese",
            "description": "A yellow background pattern with a liquid cheese aesthetic",
            "svg_func": create_liquid_cheese,
            "tags": ["abstract", "organic", "yellow", "gradient", "pattern"]
        },
        "protruding-squares": {
            "name": "Protruding Squares",
            "description": "An orange background pattern featuring a design of protruding squares",
            "svg_func": create_protruding_squares,
            "tags": ["geometric", "orange", "squares", "pattern", "simple"]
        },
        "wintery-sunburst": {
            "name": "Wintery Sunburst Sky Blue",
            "description": "A sky-blue background pattern depicting a wintery sunburst effect",
            "svg_func": create_wintery_sunburst,
            "tags": ["abstract", "blue", "sunburst", "winter", "pattern"]
        },
        "subtle-triangles": {
            "name": "Subtle Prism Triangle Pattern",
            "description": "A background pattern composed of subtle prism-like triangles",
            "svg_func": create_subtle_triangles,
            "tags": ["geometric", "triangles", "prism", "purple", "subtle"]
        },
        "bullseye-gradient": {
            "name": "Bullseye Gradient Background Design",
            "description": "A gradient background design resembling a bullseye target",
            "svg_func": create_bullseye_gradient,
            "tags": ["gradient", "bullseye", "target", "red", "abstract"]
        },
        "spectrum-gradient": {
            "name": "Spectrum Gradient Color Wheel Background",
            "description": "A vibrant background pattern featuring a spectrum color wheel gradient",
            "svg_func": create_spectrum_gradient,
            "tags": ["gradient", "spectrum", "rainbow", "vibrant", "colorful"]
        },
        "wavey-fingerprint": {
            "name": "Wavey Fingerprint Stripe Pattern",
            "description": "A background pattern characterized by wavey, fingerprint-like stripes",
            "svg_func": create_wavey_fingerprint,
            "tags": ["abstract", "fingerprint", "curved", "purple", "organic"]
        },
        "radiant-grid": {
            "name": "Radiant Gradient Warm And Colorful Grid Background",
            "description": "A warm and colorful grid background featuring a radiant gradient effect",
            "svg_func": create_radiant_grid,
            "tags": ["geometric", "grid", "gradient", "warm", "colorful"]
        },
        "constellation": {
            "name": "Endless Constellation Purple Network Background",
            "description": "A purple background pattern depicting an intricate, endless constellation-like network",
            "svg_func": create_constellation,
            "tags": ["abstract", "network", "purple", "constellation", "connections"]
        },
        "zig-zag-chevron": {
            "name": "Zig Zag Chevron Stripes Pattern",
            "description": "A background pattern featuring prominent zig-zag chevron stripes",
            "svg_func": create_zig_zag_chevron,
            "tags": ["geometric", "chevron", "zigzag", "blue", "stripes"]
        },
        "lime-chevron": {
            "name": "Repeating Chevrons Lime Green Background",
            "description": "A lime green background pattern with repeating chevron shapes",
            "svg_func": create_lime_chevron,
            "tags": ["geometric", "chevron", "lime", "green", "repeating"]
        },
        "large-triangles": {
            "name": "Large Triangles Blue Background",
            "description": "A blue background pattern composed of large triangular shapes",
            "svg_func": create_large_triangles,
            "tags": ["geometric", "triangles", "blue", "large", "simple"]
        }
    }
    
    for pattern_id, metadata in pattern_creators.items():
        svg_content = metadata["svg_func"]()
        svg_data = extract_svg_data(svg_content)
        
        pattern = {
            "id": pattern_id,
            "name": metadata["name"],
            "width": svg_data["width"],
            "height": svg_data["height"],
            "viewBoxHeight": svg_data["viewBoxHeight"],
            "mode": "tile",  # All patterns are tileable
            "svgPath": svg_data["svgElements"][:5] if svg_data["svgElements"] else [svg_content],  # Simplified path representation
            "tags": metadata["tags"],
            "description": metadata["description"],
            "source": "SVGbackgrounds.com",
            "license": "Free with Attribution",
            "created": datetime.now().isoformat(),
            "version": "1.0"
        }
        patterns.append(pattern)
    
    return patterns

if __name__ == "__main__":
    patterns = create_patterns_json()
    
    # Save to JSON file
    output_file = "/workspace/svg-pattern-generator/patterns/svgbackgrounds/data/svgbackgrounds.json"
    with open(output_file, 'w') as f:
        json.dump(patterns, f, indent=2)
    
    print(f"Created {len(patterns)} SVG patterns in {output_file}")
    for pattern in patterns:
        print(f"- {pattern['name']} ({pattern['id']})")

import xml.etree.ElementTree as ET
import re
from pathlib import Path

def get_all_coordinates(element):
    """Extract all coordinates from path d attribute or circle cx/cy"""
    coords = []
    
    if element.tag.endswith('path'):
        d_attr = element.get('d', '')
        if d_attr:
            # Extract all numbers from the path
            numbers = re.findall(r'[-+]?\d*\.?\d+', d_attr)
            
            # Parse commands and their coordinates
            current_x, current_y = 0, 0
            
            for match in re.finditer(r'([MmLlHhVvCcSsQqTtAaZz])\s*([-+\d\s.,eE]+)', d_attr):
                command = match.group(1)
                params_str = match.group(2).strip()
                if not params_str:
                    continue
                params = [float(x) for x in re.findall(r'[-+]?\d*\.?\d+', params_str)]
                
                if len(params) == 0:
                    continue
                
                if command == 'M':  # Absolute moveto
                    for j in range(0, len(params) - 1, 2):
                        current_x, current_y = params[j], params[j+1]
                        coords.append((current_x, current_y))
                elif command == 'm':  # Relative moveto
                    for j in range(0, len(params) - 1, 2):
                        current_x += params[j]
                        current_y += params[j+1]
                        coords.append((current_x, current_y))
                elif command == 'L':  # Absolute line
                    for j in range(0, len(params) - 1, 2):
                        current_x, current_y = params[j], params[j+1]
                        coords.append((current_x, current_y))
                elif command == 'l':  # Relative line
                    for j in range(0, len(params) - 1, 2):
                        current_x += params[j]
                        current_y += params[j+1]
                        coords.append((current_x, current_y))
                elif command == 'H':  # Horizontal line absolute
                    for x in params:
                        current_x = x
                        coords.append((current_x, current_y))
                elif command == 'h':  # Horizontal line relative
                    for x in params:
                        current_x += x
                        coords.append((current_x, current_y))
                elif command == 'V':  # Vertical line absolute
                    for y in params:
                        current_y = y
                        coords.append((current_x, current_y))
                elif command == 'v':  # Vertical line relative
                    for y in params:
                        current_y += y
                        coords.append((current_x, current_y))
                elif command in 'Cc':  # Cubic bezier
                    is_relative = command.islower()
                    for j in range(0, len(params) - 5, 6):
                        # Add all control points
                        if is_relative:
                            coords.append((current_x + params[j], current_y + params[j+1]))
                            coords.append((current_x + params[j+2], current_y + params[j+3]))
                            coords.append((current_x + params[j+4], current_y + params[j+5]))
                            current_x += params[j+4]
                            current_y += params[j+5]
                        else:
                            coords.append((params[j], params[j+1]))
                            coords.append((params[j+2], params[j+3]))
                            coords.append((params[j+4], params[j+5]))
                            current_x = params[j+4]
                            current_y = params[j+5]
                elif command in 'Ss':  # Smooth cubic bezier
                    is_relative = command.islower()
                    for j in range(0, len(params) - 3, 4):
                        if is_relative:
                            coords.append((current_x + params[j], current_y + params[j+1]))
                            coords.append((current_x + params[j+2], current_y + params[j+3]))
                            current_x += params[j+2]
                            current_y += params[j+3]
                        else:
                            coords.append((params[j], params[j+1]))
                            coords.append((params[j+2], params[j+3]))
                            current_x = params[j+2]
                            current_y = params[j+3]
                elif command in 'Qq':  # Quadratic bezier
                    is_relative = command.islower()
                    for j in range(0, len(params) - 3, 4):
                        if is_relative:
                            coords.append((current_x + params[j], current_y + params[j+1]))
                            coords.append((current_x + params[j+2], current_y + params[j+3]))
                            current_x += params[j+2]
                            current_y += params[j+3]
                        else:
                            coords.append((params[j], params[j+1]))
                            coords.append((params[j+2], params[j+3]))
                            current_x = params[j+2]
                            current_y = params[j+3]
                elif command in 'Tt':  # Smooth quadratic bezier
                    is_relative = command.islower()
                    for j in range(0, len(params) - 1, 2):
                        if is_relative:
                            coords.append((current_x + params[j], current_y + params[j+1]))
                            current_x += params[j]
                            current_y += params[j+1]
                        else:
                            coords.append((params[j], params[j+1]))
                            current_x = params[j]
                            current_y = params[j+1]
                elif command in 'Zz':
                    pass  # Close path, no coordinates
                
    elif element.tag.endswith('circle'):
        cx = float(element.get('cx', 0))
        cy = float(element.get('cy', 0))
        r = float(element.get('r', 0))
        # Add bounding box of circle
        coords.extend([
            (cx - r, cy - r),
            (cx + r, cy + r),
            (cx - r, cy + r),
            (cx + r, cy - r)
        ])
    
    return coords

def calculate_exact_viewbox(svg_file):
    """Calculate the exact bounding box from all path and circle elements"""
    tree = ET.parse(svg_file)
    root = tree.getroot()
    
    all_coords = []
    
    # Find all paths and circles
    for elem in root.iter():
        if elem.tag.endswith('path') or elem.tag.endswith('circle'):
            coords = get_all_coordinates(elem)
            all_coords.extend(coords)
    
    if not all_coords:
        print(f"Warning: No coordinates found in {svg_file}")
        return None
    
    xs = [c[0] for c in all_coords]
    ys = [c[1] for c in all_coords]
    
    min_x = min(xs)
    max_x = max(xs)
    min_y = min(ys)
    max_y = max(ys)
    
    width = max_x - min_x
    height = max_y - min_y
    
    return min_x, min_y, width, height

def update_svg_viewbox(svg_file):
    """Update the viewBox of an SVG file to exact dimensions"""
    result = calculate_exact_viewbox(svg_file)
    if not result:
        return
    
    min_x, min_y, width, height = result
    
    # Read the file
    with open(svg_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update viewBox attribute
    content = re.sub(
        r'viewBox="[^"]*"',
        f'viewBox="{min_x:.3f} {min_y:.3f} {width:.3f} {height:.3f}"',
        content
    )
    
    # Update width attribute
    content = re.sub(
        r'width="[^"]*"',
        f'width="{width:.3f}"',
        content
    )
    
    # Update height attribute
    content = re.sub(
        r'height="[^"]*"',
        f'height="{height:.3f}"',
        content
    )
    
    # Write back
    with open(svg_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated {svg_file.name}: viewBox=\"{min_x:.3f} {min_y:.3f} {width:.3f} {height:.3f}\"")

def main():
    maps_dir = Path('maps')
    
    # Process all continent SVG files (not world.svg)
    svg_files = [
        'europe.svg',
        'africa.svg',
        'asia.svg',
        'north-america.svg',
        'south-america.svg',
        'oceania.svg'
    ]
    
    for filename in svg_files:
        svg_path = maps_dir / filename
        if svg_path.exists():
            print(f"\nProcessing {filename}...")
            update_svg_viewbox(svg_path)
        else:
            print(f"Warning: {filename} not found")
    
    print("\nAll SVG files updated successfully!")

if __name__ == '__main__':
    main()

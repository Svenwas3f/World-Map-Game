import xml.etree.ElementTree as ET
import re
from pathlib import Path

# Define continents and their country codes (including territories and dependencies)
continents = {
    'europe': ['AL', 'AD', 'AT', 'BY', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'XK', 'LV', 'LI', 'LT', 'LU', 'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'RU', 'SM', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'UA', 'GB', 'VA', 
               'AX', 'FO', 'GI', 'GG', 'IM', 'JE', 'SJ'],  # Add territories: Åland, Faroe, Gibraltar, Guernsey, Isle of Man, Jersey, Svalbard
    'africa': ['DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ', 'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'SZ', 'TZ', 'TG', 'TN', 'UG', 'ZM', 'ZW',
               'EH', 'RE', 'YT', 'SH'],  # Add territories: Western Sahara, Réunion, Mayotte, St Helena
    'asia': ['AF', 'AM', 'AZ', 'BH', 'BD', 'BT', 'BN', 'KH', 'CN', 'GE', 'IN', 'ID', 'IR', 'IQ', 'IL', 'JP', 'JO', 'KZ', 'KW', 'KG', 'LA', 'LB', 'MY', 'MV', 'MN', 'MM', 'NP', 'KP', 'OM', 'PK', 'PS', 'PH', 'QA', 'SA', 'SG', 'KR', 'LK', 'SY', 'TJ', 'TH', 'TL', 'TR', 'TM', 'AE', 'UZ', 'VN', 'YE',
             'HK', 'MO', 'TW', 'IO'],  # Add territories: Hong Kong, Macau, Taiwan, British Indian Ocean
    'north-america': ['AG', 'BS', 'BB', 'BZ', 'CA', 'CR', 'CU', 'DM', 'DO', 'SV', 'GD', 'GT', 'HT', 'HN', 'JM', 'MX', 'NI', 'PA', 'KN', 'LC', 'VC', 'TT', 'US',
                      'AI', 'AW', 'BM', 'BQ', 'KY', 'CW', 'GL', 'GP', 'MQ', 'MS', 'PM', 'PR', 'BL', 'MF', 'SX', 'TC', 'VG', 'VI'],  # Add all Caribbean and North American territories
    'south-america': ['AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'GY', 'PY', 'PE', 'SR', 'UY', 'VE',
                      'FK', 'GF', 'GS'],  # Add territories: Falklands, French Guiana, South Georgia
    'oceania': ['AU', 'FJ', 'KI', 'MH', 'FM', 'NR', 'NZ', 'PW', 'PG', 'WS', 'SB', 'TO', 'TV', 'VU',
                'AS', 'CK', 'PF', 'GU', 'NC', 'NF', 'MP', 'NU', 'PN', 'TK', 'WF', 'HM', 'CC', 'CX']  # Add all Pacific territories
}

def parse_path_d(d_attr):
    """Extract all coordinate pairs from a path d attribute"""
    # Match numbers (including negative and decimal)
    numbers = re.findall(r'-?\d+\.?\d*', d_attr)
    coords = []
    
    # Convert to floats and pair them as x,y coordinates
    for i in range(0, len(numbers)-1, 2):
        try:
            x = float(numbers[i])
            y = float(numbers[i+1])
            coords.append((x, y))
        except (ValueError, IndexError):
            pass
    
    return coords

def calculate_viewbox(paths):
    """Calculate the bounding box for a list of paths"""
    all_coords = []
    
    for path in paths:
        d_attr = path.get('d', '')
        if d_attr:
            coords = parse_path_d(d_attr)
            all_coords.extend(coords)
    
    if not all_coords:
        return "0 0 100 100"
    
    xs = [c[0] for c in all_coords]
    ys = [c[1] for c in all_coords]
    
    min_x = min(xs)
    max_x = max(xs)
    min_y = min(ys)
    max_y = max(ys)
    
    # Add 5% padding
    width = max_x - min_x
    height = max_y - min_y
    padding_x = width * 0.05
    padding_y = height * 0.05
    
    min_x -= padding_x
    min_y -= padding_y
    width += 2 * padding_x
    height += 2 * padding_y
    
    return f"{min_x:.2f} {min_y:.2f} {width:.2f} {height:.2f}"

def extract_continent(input_file, output_file, country_codes):
    """Extract countries for a specific continent"""
    # Parse the SVG
    tree = ET.parse(input_file)
    root = tree.getroot()
    
    # Create new SVG root with namespace
    ns = {'svg': 'http://www.w3.org/2000/svg'}
    ET.register_namespace('', 'http://www.w3.org/2000/svg')
    
    # Find all path/circle elements with matching country codes
    matching_elements = []
    for elem in root.findall('.//{http://www.w3.org/2000/svg}path'):
        elem_id = elem.get('id', '')
        if elem_id in country_codes:
            matching_elements.append(elem)
    
    for elem in root.findall('.//{http://www.w3.org/2000/svg}circle'):
        elem_id = elem.get('id', '')
        if elem_id in country_codes:
            matching_elements.append(elem)
    
    if not matching_elements:
        print(f"Warning: No elements found for {output_file}")
        return
    
    # Calculate viewBox
    viewbox = calculate_viewbox([e for e in matching_elements if e.tag.endswith('path')])
    
    # Create new SVG structure
    new_root = ET.Element('svg')
    new_root.set('xmlns', 'http://www.w3.org/2000/svg')
    new_root.set('viewBox', viewbox)
    width, height = viewbox.split()[2:4]
    new_root.set('width', width)
    new_root.set('height', height)
    
    # Add all matching elements
    for elem in matching_elements:
        new_root.append(elem)
    
    # Create the tree and write
    new_tree = ET.ElementTree(new_root)
    ET.indent(new_tree, space='  ')
    new_tree.write(output_file, encoding='utf-8', xml_declaration=True)
    
    print(f"Created {output_file} with {len(matching_elements)} countries")

def main():
    input_file = Path('maps/world.svg')
    
    if not input_file.exists():
        print(f"Error: {input_file} not found")
        return
    
    # Create output directory if it doesn't exist
    output_dir = Path('maps')
    output_dir.mkdir(exist_ok=True)
    
    # Extract each continent
    for continent_name, country_codes in continents.items():
        output_file = output_dir / f'{continent_name}.svg'
        print(f"\nProcessing {continent_name}...")
        extract_continent(input_file, output_file, country_codes)
    
    print("\nAll continent files created successfully!")

if __name__ == '__main__':
    main()

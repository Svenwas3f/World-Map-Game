import re
import xml.etree.ElementTree as ET

# Continent country mappings (ISO codes)
continents = {
    'europe': ['AL', 'AD', 'AT', 'BY', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 
               'GR', 'HU', 'IS', 'IE', 'IT', 'XK', 'LV', 'LI', 'LT', 'LU', 'MT', 'MD', 'MC', 'ME', 'NL',
               'MK', 'NO', 'PL', 'PT', 'RO', 'RU', 'SM', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'UA', 'GB',
               'VA', 'AX', 'FO', 'GI', 'GG', 'IM', 'JE'],
    'africa': ['DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ',
               'EG', 'GQ', 'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW',
               'ML', 'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA',
               'SS', 'SD', 'SZ', 'TZ', 'TG', 'TN', 'UG', 'ZM', 'ZW', 'EH', 'RE', 'YT', 'SH'],
    'asia': ['AF', 'AM', 'AZ', 'BH', 'BD', 'BT', 'BN', 'KH', 'CN', 'GE', 'IN', 'ID', 'IR', 'IQ', 'IL',
             'JP', 'JO', 'KZ', 'KW', 'KG', 'LA', 'LB', 'MY', 'MV', 'MN', 'MM', 'NP', 'KP', 'OM', 'PK',
             'PS', 'PH', 'QA', 'SA', 'SG', 'KR', 'LK', 'SY', 'TJ', 'TH', 'TL', 'TR', 'TM', 'AE', 'UZ',
             'VN', 'YE', 'HK', 'MO', 'TW'],
    'north-america': ['AG', 'BS', 'BB', 'BZ', 'CA', 'CR', 'CU', 'DM', 'DO', 'SV', 'GD', 'GT', 'HT', 'HN',
                      'JM', 'MX', 'NI', 'PA', 'KN', 'LC', 'VC', 'TT', 'US', 'AI', 'AW', 'BM', 'BQ', 'KY',
                      'CW', 'GL', 'GP', 'MQ', 'MS', 'PM', 'PR', 'BL', 'MF', 'SX', 'TC', 'VG', 'VI'],
    'south-america': ['AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'GY', 'PY', 'PE', 'SR', 'UY', 'VE', 'FK', 'GF', 'GS'],
    'oceania': ['AU', 'FJ', 'KI', 'MH', 'FM', 'NR', 'NZ', 'PW', 'PG', 'WS', 'SB', 'TO', 'TV', 'VU',
                'AS', 'CK', 'PF', 'GU', 'NC', 'NF', 'MP', 'NU', 'PN', 'TK', 'WF']
}

# Read world.svg
tree = ET.parse('c:/Users/svenw/OneDrive/Desktop/world-map-game/maps/world.svg')
root = tree.getroot()

# Get SVG namespace
ns = {'svg': 'http://www.w3.org/2000/svg'}

# For each continent, create a new SVG with only those countries
for continent_name, country_codes in continents.items():
    # Create new SVG
    new_root = ET.Element('{http://www.w3.org/2000/svg}svg')
    for key, value in root.attrib.items():
        new_root.set(key, value)
    
    # Find and copy matching country paths
    for elem in root:
        country_id = elem.get('id', '').upper()
        if country_id in country_codes:
            new_root.append(elem)
    
    # Calculate viewBox for continent
    min_x, min_y, max_x, max_y = float('inf'), float('inf'), float('-inf'), float('-inf')
    
    for elem in new_root:
        if elem.get('d'):  # It's a path
            coords = re.findall(r'[-]?\d+\.?\d*', elem.get('d'))
            for i in range(0, len(coords), 2):
                if i+1 < len(coords):
                    x, y = float(coords[i]), float(coords[i+1])
                    min_x, min_y = min(min_x, x), min(min_y, y)
                    max_x, max_y = max(max_x, x), max(max_y, y)
    
    # Add padding
    padding = 20
    width = max_x - min_x + 2 * padding
    height = max_y - min_y + 2 * padding
    
    new_root.set('viewBox', f"{min_x - padding} {min_y - padding} {width} {height}")
    new_root.set('width', str(width))
    new_root.set('height', str(height))
    
    # Write to file
    new_tree = ET.ElementTree(new_root)
    ET.register_namespace('', 'http://www.w3.org/2000/svg')
    ET.register_namespace('mapsvg', 'http://mapsvg.com')
    ET.register_namespace('dc', 'http://purl.org/dc/elements/1.1/')
    ET.register_namespace('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
    
    output_file = f'c:/Users/svenw/OneDrive/Desktop/world-map-game/maps/{continent_name}.svg'
    new_tree.write(output_file, encoding='UTF-8', xml_declaration=True)
    print(f"Created {continent_name}.svg with {len(new_root)} countries")

print("All continent maps created!")

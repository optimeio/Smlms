import re

with open('src/pages/Dashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove { name: 'Profile' } from student sidebar items
content = re.sub(r'\{\s*name:\s*\'Profile\',\s*icon:.*?<svg.*?</svg>\s*\},?\n?', '', content, flags=re.DOTALL)

# 2. Remove case 'Profile': return renderProfileView();
content = re.sub(r'case\s+\'Profile\':\s*return\s+renderProfileView\(\);\s*', '', content)

# 3. Remove clickable logic from header
content = content.replace('cursor-pointer pl-4', 'pl-4')
content = re.sub(r'onClick=\{\(\)\s*=>\s*setActiveSidebarTab\(\'Profile\'\)\}', '', content)
content = content.replace('title="View Profile"', '')

# 4. Remove renderStudentProfileView and renderProfileView functions
lines = content.split('\n')
start1 = -1
end2 = -1

for i, line in enumerate(lines):
    if 'const renderStudentProfileView = () => {' in line:
        start1 = i
    if 'const renderContent = () => {' in line:
        end2 = i - 1 # just before renderContent starts
        break

if start1 != -1 and end2 != -1:
    new_lines = lines[:start1] + lines[end2+1:]
    content = '\n'.join(new_lines)
    print("Found indices: ", start1, end2)
else:
    print("Could not find indices:", start1, end2)

with open('src/pages/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Profile removed successfully!')

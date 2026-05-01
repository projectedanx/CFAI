import re

with open('index.html', 'r') as f:
    content = f.read()

content = content.replace('<div id="root"></div>', '<div id="root"></div>\n    <script type="module" src="/index.tsx"></script>')

with open('index.html', 'w') as f:
    f.write(content)

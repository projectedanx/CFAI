import re

with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace('bg-brand-background', 'bg-brand-bg')

with open('App.tsx', 'w') as f:
    f.write(content)

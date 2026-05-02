import os
import re

files_to_update = [
    r'src\pages\Home.jsx',
    r'src\components\common\Navbar.jsx',
    r'src\components\common\Footer.jsx',
    r'src\pages\Login.jsx',
    r'src\pages\Register.jsx',
    r'src\pages\Dashboard.jsx',
    r'src\pages\Pathways.jsx',
    r'src\components\interview\InterviewPage.jsx',
    r'src\components\resume\ResumePage.jsx',
    r'src\components\resume\ResumeBuilder.jsx'
]

def reskin_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()

    # Base Backgrounds (Fixing all previous iterations)
    text = text.replace('bg-[#050505]', 'bg-[#1A0B18]')
    text = text.replace('bg-[#0B1120]', 'bg-[#1A0B18]')
    text = text.replace('bg-[#F6FFDC]', 'bg-[#1A0B18]')
    
    # Specific Background variants
    text = text.replace('#0a0218', '#13071A')
    text = text.replace('#020617', '#13071A')
    text = text.replace('#0d0520', '#1A0B18')
    text = text.replace('#0e0315', '#13071A')
    text = text.replace('#100520', '#1A0B18')

    # Home.jsx Light Pastel Revert
    text = text.replace('text-slate-800', 'text-white')
    text = text.replace('text-slate-600', 'text-gray-400')
    text = text.replace('text-slate-500', 'text-gray-400')
    text = text.replace('bg-white/95 border-pink-100', 'bg-black/40 backdrop-blur-2xl border-fuchsia-500/20')
    text = text.replace('bg-white/90 border-pink-100', 'bg-black/60 backdrop-blur-2xl border-fuchsia-500/20')
    text = text.replace('bg-white/70', 'bg-white/5')
    text = text.replace('bg-white/60', 'bg-black/40')
    text = text.replace('border-white/50', 'border-white/10')
    text = text.replace('shadow-lg shadow-black/5', 'shadow-[0_0_30px_rgba(217,70,239,0.15)]')
    text = text.replace('shadow-2xl shadow-pink-100/50', 'shadow-[0_20px_50px_rgba(0,0,0,0.5)]')
    
    # Text Gradients from Home.jsx
    text = text.replace('from-[#E86A92] via-[#F28CB6] to-[#CFECF3]', 'from-fuchsia-400 via-rose-400 to-pink-500')
    text = text.replace('from-[#E86A92] to-[#FFD1DC]', 'from-rose-500 to-fuchsia-500')
    text = text.replace('from-[#F28CB6] to-[#FFD1DC]', 'from-rose-600 to-fuchsia-600')
    text = text.replace('text-[#E86A92]', 'text-fuchsia-400')
    text = text.replace('text-[#F28CB6]', 'text-rose-400')
    text = text.replace('text-[#3AA5B8]', 'text-pink-400')

    # Revert Teal/Emerald/Cyan -> Fuchsia/Rose/Pink across all files
    # We must be careful mapping since these were previously shifted
    text = re.sub(r'teal-300', 'fuchsia-300', text)
    text = re.sub(r'teal-400', 'fuchsia-400', text)
    text = re.sub(r'teal-500', 'fuchsia-500', text)
    text = re.sub(r'teal-600', 'fuchsia-600', text)
    text = re.sub(r'teal-900', 'fuchsia-900', text)
    
    text = re.sub(r'emerald-300', 'rose-300', text)
    text = re.sub(r'emerald-400', 'rose-400', text)
    text = re.sub(r'emerald-500', 'rose-500', text)
    text = re.sub(r'emerald-600', 'rose-600', text)
    text = re.sub(r'emerald-900', 'rose-900', text)
    
    text = re.sub(r'cyan-300', 'pink-300', text)
    text = re.sub(r'cyan-400', 'pink-400', text)
    text = re.sub(r'cyan-500', 'pink-500', text)
    text = re.sub(r'cyan-600', 'pink-600', text)
    text = re.sub(r'cyan-900', 'pink-900', text)

    # Convert blobs strictly to magentas/pinks 
    text = text.replace('#06b6d4', '#D946EF') # Fuchsia-500
    text = text.replace('#10b981', '#E11D48') # Rose-600
    text = text.replace('#14b8a6', '#C026D3') # Fuchsia-600
    text = text.replace('#059669', '#BE185D') # Pink-700
    text = text.replace('#2dd4bf', '#F472B6') # Pink-400
    
    # Dot Grid color
    text = text.replace('rgba(45,212,191,1)', 'rgba(217,70,239,0.8)')
    text = text.replace('rgba(0,0,0,0.1)', 'rgba(217,70,239,0.8)')

    # Glows and hover bindings
    text = text.replace('border-pink-200/50', 'border-fuchsia-500/20')
    text = text.replace('hover:border-pink-300', 'hover:border-fuchsia-500/60')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)

for file in files_to_update:
    if os.path.exists(file):
        reskin_file(file)
        print(f"Updated {file}")
    else:
        print(f"Skipped {file}")

print("Success")

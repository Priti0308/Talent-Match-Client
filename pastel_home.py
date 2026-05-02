import re

path = r'd:\MCA Notes\MCA II SEM IV\Project\client\src\pages\Home.jsx'

with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Backgrounds to light
text = text.replace('bg-[#0B1120]', 'bg-[#F6FFDC]')
text = text.replace('text-white', 'text-slate-800')

# Gradient background lines
text = text.replace('linear-gradient(135deg, #020617 0%, #0B1120 25%, #020617 50%, #0B1120 75%, #020617 100%)', 'linear-gradient(135deg, #F6FFDC 0%, #ffffff 25%, #F6FFDC 50%, #ffffff 75%, #F6FFDC 100%)')

# Radial gradients
text = text.replace('#06b6d4', '#CFECF3')
text = text.replace('#10b981', '#FFC4E1')
text = text.replace('#14b8a6', '#E1F2D9')
text = text.replace('#059669', '#FFC4E1')
text = text.replace('#2dd4bf', '#CFECF3')

# Dot grid
text = text.replace('rgba(45,212,191,1)', 'rgba(0,0,0,0.1)')

# Cards & Glassmorphism
text = text.replace('bg-white/5', 'bg-white/70')
text = text.replace('border-white/10', 'border-white/50')
text = text.replace('bg-black/40', 'bg-white/60')
text = text.replace('bg-black/60', 'bg-white/70')
text = text.replace('bg-black/20', 'bg-white/40')
text = text.replace('bg-[#0a0a0a]', 'bg-white')
text = text.replace('shadow-[0_20px_50px_rgba(0,0,0,0.5)]', 'shadow-[0_20px_50px_rgba(0,0,0,0.05)]')
text = text.replace('bg-gradient-to-b from-black/0 to-black/40', 'bg-gradient-to-b from-[#F6FFDC]/0 to-white/60')
text = text.replace('bg-gradient-to-b from-[#0a0a0a] to-[#000000]', 'bg-gradient-to-b from-white/60 to-[#F6FFDC]')

# Text Colors
text = text.replace('text-cyan-400', 'text-[#3AA5B8]') # Darker blue for readable text
text = text.replace('text-teal-400', 'text-[#569846]')
text = text.replace('text-emerald-500', 'text-[#F28CB6]') # Reusing pink for emerald
text = text.replace('text-gray-400', 'text-slate-500')
text = text.replace('text-gray-300', 'text-slate-600')

# Text Gradients
# from-teal-400 via-cyan-400 to-emerald-400 -> Pastels
text = text.replace('from-teal-400 via-cyan-400 to-emerald-400', 'from-[#F28CB6] via-[#3AA5B8] to-[#569846]')
text = text.replace('from-teal-500 to-emerald-500', 'from-[#F28CB6] to-[#3AA5B8]')
text = text.replace('from-cyan-500 to-blue-600', 'from-[#CFECF3] to-[#F6FFDC]')

# For the buttons (white text -> slate text)
text = text.replace('text-white font-black', 'text-slate-800 font-black border border-slate-200 shadow-sm')
text = text.replace('text-white group-hover:text-gray-300', 'text-slate-800')

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
print("Done")

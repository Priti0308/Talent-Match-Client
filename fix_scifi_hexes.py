import re

path = r'src\pages\Home.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Revert remaining pastel artifacts in Home.jsx
text = text.replace('#F6FFDC', '#050505')
text = text.replace('#ffffff', '#08080c')
text = text.replace('#FFD1DC', 'rgba(168,85,247,1)') # purple-500
text = text.replace('#FFC4E1', 'rgba(236,72,153,1)') # pink-500
text = text.replace('#FFF0F5', 'rgba(99,102,241,1)') # indigo-500

text = text.replace('rgba(236,72,153,1) 0%, transparent 65%)', 'rgba(236,72,153,0.5) 0%, transparent 65%)')
text = text.replace('rgba(168,85,247,1) 0%, transparent 65%)', 'rgba(168,85,247,0.5) 0%, transparent 65%)')
text = text.replace('rgba(99,102,241,1) 0%, transparent 65%)', 'rgba(99,102,241,0.5) 0%, transparent 65%)')

text = text.replace('from-[rgba(168,85,247,1)] to-[#050505]', 'from-purple-500 to-pink-600')

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

# Fix native Colorful Icons on Login and Register
import sys
# To safely restore colorful icons without throwing python regex errors
icon_block = '''        <FaReact className="icon large text-cyan-400 top-[12%] left-[8%]" />
        <FaHtml5 className="icon medium text-orange-500 top-[40%] left-[5%]" />
        <FaCss3Alt className="icon medium text-blue-500 top-[78%] left-[25%]" />
        <FaJsSquare className="icon large text-yellow-400 top-[22%] left-[72%]" />
        <FaBootstrap className="icon small text-purple-600 top-[60%] left-[15%]" />
        <FaAngular className="icon small text-red-600 top-[15%] left-[50%]" />
        <FaVuejs className="icon small text-green-400 top-[85%] left-[60%]" />
        <FaSass className="icon small text-pink-400 top-[30%] left-[88%]" />
        <SiTailwindcss className="icon medium text-cyan-400 top-[50%] left-[45%]" />
        <SiNextdotjs className="icon small text-white top-[10%] left-[30%]" />
        <SiVite className="icon small text-purple-400 top-[75%] left-[80%]" />

        <FaNodeJs className="icon large text-green-500 top-[70%] left-[82%]" />
        <SiExpress className="icon small text-gray-400 top-[65%] left-[55%]" />
        <FaPython className="icon medium text-yellow-500 top-[35%] left-[65%]" />
        <FaJava className="icon medium text-red-500 top-[18%] left-[85%]" />
        <FaPhp className="icon small text-indigo-400 top-[55%] left-[75%]" />
        <FaDocker className="icon medium text-blue-400 top-[88%] left-[10%]" />
        <FaGitAlt className="icon small text-orange-600 top-[5%] left-[65%]" />
        <FaGithub className="icon small text-gray-300 top-[95%] left-[40%]" />

        <SiMongodb className="icon medium text-green-600 top-[45%] left-[20%]" />
        <SiMysql className="icon small text-blue-500 top-[28%] left-[58%]" />
        <SiPostgresql className="icon small text-blue-300 top-[82%] left-[48%]" />
        <SiFirebase className="icon small text-yellow-500 top-[38%] left-[92%]" />'''

for login_path in [r'src\pages\Login.jsx', r'src\pages\Register.jsx']:
    with open(login_path, 'r', encoding='utf-8') as f:
        ltext = f.read()
    
    # regex matches anything from <FaReact up to </SiFirebase.../>
    ltext = re.sub(r'<FaReact.*?SiFirebase.*?/>', icon_block.strip() , ltext, flags=re.DOTALL)
    
    with open(login_path, 'w', encoding='utf-8') as f:
        f.write(ltext)

print('Success')

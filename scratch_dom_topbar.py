import sys
with open('frontend/assets/index-CyzSREEe.js', 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

idx = 297248 + 1000
sys.stdout.buffer.write(c[idx:idx+1500].encode('utf-8'))

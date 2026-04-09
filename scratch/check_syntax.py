import py_compile
import sys
import os

files = ['backend/app.py', 'backend/predictor.py']
results = []

for f in files:
    try:
        py_compile.compile(f, doraise=True)
        results.append(f"{f}: OK")
    except py_compile.PyCompileError as e:
        results.append(f"{f}: ERROR\n{str(e)}")
    except Exception as e:
        results.append(f"{f}: CRITICAL ERROR\n{str(e)}")

with open('scratch/syntax_check.log', 'w') as out:
    out.write('\n'.join(results))

print("Check complete. See scratch/syntax_check.log")

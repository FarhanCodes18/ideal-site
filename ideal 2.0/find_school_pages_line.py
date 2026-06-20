with open(r"c:\Users\FARHAN\Desktop\Ideal projects\ideal 2.0 8 may\ideal 2.0\style.css", "r", encoding="utf-8") as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if "SCHOOL WEBSITE" in line or "SCHOOL WEBSITE PAGES" in line or "school-pages" in line:
        print(f"Line {idx+1}: {line.strip()}")

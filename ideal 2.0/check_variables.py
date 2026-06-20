with open(r"c:\Users\FARHAN\Desktop\Ideal projects\ideal 2.0 8 may\ideal 2.0\style.css", "r", encoding="utf-8") as f:
    lines = f.readlines()

for idx, line in enumerate(lines[3950:]):
    if ":root" in line:
        print(f"Line {3951+idx}: {line.strip()}")
        # print next 20 lines
        for j in range(1, 30):
            print(f"  {lines[3950+idx+j].strip()}")

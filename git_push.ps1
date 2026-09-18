$git = "C:\Program Files\Git\cmd\git.exe"
& $git init
& $git remote add origin https://github.com/MortalEngine7/QVERA

# in case origin is already there and wrong: (the user requested "If origin already exists and points somewhere else, update origin to...")
& $git remote set-url origin https://github.com/MortalEngine7/QVERA

& $git config user.email "bot@qvera.localhost"
& $git config user.name "Qvera Bot"

& $git branch -M main
& $git add .
& $git commit -m "Initial QVERA implementation"

# Check if there's conflict and push
# The user said: "If the remote repository already contains commits and a conflict occurs, STOP and tell me instead of overwriting anything."
# Also "Do NOT use force push."
# `git push -u origin main` will naturally fail if there's a conflict without force.
& $git push -u origin main
$LASTEXITCODE

function changed {
  git diff --name-only HEAD@{1} HEAD | grep "^$1" > /dev/null 2>&1
}

if changed 'package-lock.json'; then
  npm install
fi

echo "post-merge done"

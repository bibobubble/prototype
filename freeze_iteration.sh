#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

note="${1:-}"
mkdir -p frozen

next=1
while [[ -e "frozen/iteration${next}" ]]; do
  next=$((next + 1))
done

target="frozen/iteration${next}"
mkdir -p "$target"
cp index.html styles.css app.js "$target/"
if [[ -d assets ]]; then
  cp -R assets "$target/"
fi

cat > "$target/README.md" <<EOF
# Frozen Website Snapshot

## Snapshot

\`\`\`text
iteration${next}
\`\`\`

## What This Version Represents

Frozen copy of the live iteration website at the time the snapshot was created.

## Change Summary

\`\`\`text
${note:-No change summary provided.}
\`\`\`

## How To Open

Open:

\`\`\`text
iteration/$target/index.html
\`\`\`

## Notes

This is a static copy. Later changes to the live \`iteration/\` folder will not alter this frozen version.
EOF

cat > "$target/CHANGELOG.md" <<EOF
# Iteration Change Log

## Version

\`\`\`text
iteration${next}
\`\`\`

## What Changed In This Iteration

\`\`\`text
${note:-No change summary provided.}
\`\`\`

## Captured Files

- \`index.html\`
- \`styles.css\`
- \`app.js\`
- \`assets/\` if present

## Use In Project Narrative

Use this note to explain what was added, changed, or clarified in this iteration when writing the design process, evaluation, or reflection sections.
EOF

(
  cd "$target"
  find . -type f ! -name "checksums.sha256" -print0 | sort -z | xargs -0 shasum -a 256 > checksums.sha256
)

echo "Frozen website snapshot: iteration/$target/index.html"

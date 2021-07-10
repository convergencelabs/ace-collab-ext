const fs = require('fs');

fs.appendFileSync('dist/types/index.d.ts', '\nexport as namespace AceCollabExt;\n');


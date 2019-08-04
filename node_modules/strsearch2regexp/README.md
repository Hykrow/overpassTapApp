# strsearch2regexp
Converts a search string to a unicode regexp with character variants (e.g. "foo bar" -> "f[oöó][oöó].*b[aäá]r")

This code is far from complete. Pull requests are very welcome!

# Installation
```sh
npm add --save strsearch2regexp
```

# Usage
```js
const strsearch2regexp = require('strsearch2regexp')

console.log(strsearch2regexp('foo bar'))
// f[oòóôõöø]o.*b[aàáâãäå]r
```

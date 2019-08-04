Order an array of objects by the key 'weight' (or another key)

# Usage
## NodeJS
```js
var weightSort = require('weight-sort')
```

## In-Browser
```html
<script src='node_module/weight-sort/weightSort.js'>
```

## PHP
```php
include "path/to/weightSort.php";
```

# SYNOPSIS
```js
arr = weightSort(input, [options])
```

Sort the input array by the key 'weight' or as specified by the options.
Returns the sorted array, the original array will not be changed.

If there are several entries with the same weight, the original order will
remain.

Options:
Can be either a string, which will define a different key or an object (array in PHP mode) with the following properties:
* key: an alternative key by which to sort
* reverse: boolean. if true, order from highest value to lowest.
* compareFunction: Specifies a function that defines the sort order. The function is compatible with `array.sort()`. It will be passed two key values and should return -1, 0 or 1. See below for an example.

# Example
```js
var origArray = [
  { name: 'Alice',  weight: 62.5, height: 160 },
  { name: 'Bob',    weight: 77.0, height: 180 },
  { name: 'Charly', weight: 82.5, height: 180 },
  { name: 'Debby',  weight: 62.5, height: 165 },
  { name: 'Earl',   weight: 80.0, height: 185 }
]

/* Default: order elements by 'weight' */
var sortedArray = weightSort(origArray)
console.log(sortedArray)
// [
//    { name: 'Alice',  weight: 62.5, height: 160 },
//    { name: 'Debby',  weight: 62.5, height: 165 },
//    { name: 'Bob',    weight: 77.0, height: 180 },
//    { name: 'Earl',   weight: 80.0, height: 185 },
//    { name: 'Charly', weight: 82.5, height: 180 }
// ]

/* Optional: order elements by 'height' */
var sortedArray = weightSort(origArray, 'height')
console.log(sortedArray)
// [
//    { name: 'Alice',  weight: 62.5, height: 160 },
//    { name: 'Debby',  weight: 62.5, height: 165 },
//    { name: 'Bob',    weight: 77.0, height: 180 },
//    { name: 'Charly', weight: 82.5, height: 180 },
//    { name: 'Earl',   weight: 80.0, height: 185 }
// ]

/* Optional: alternative compareFunction (closest height to '179') */
var sortedArray = weightSort(origArray, {
      key: 'height',
      compareFunction: function (a, b) {
        return Math.abs(a - 179) < Math.abs(b - 179) ? -1 : 1
      }
})
console.log(sortedArray)
// [
//    { name: 'Bob',    weight: 77.0, height: 180 },
//    { name: 'Charly', weight: 82.5, height: 180 },
//    { name: 'Earl',   weight: 80.0, height: 185 }
//    { name: 'Debby',  weight: 62.5, height: 165 },
//    { name: 'Alice',  weight: 62.5, height: 160 },
// ]

```

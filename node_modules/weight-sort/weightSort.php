<?php
// weightSort(arr, [weight_key])
// Parameters:
// arr ... an array of elements
//           an element may be: array( weight, var )
//           or array('weight'=>weight, ...)
//           or an object with property 'weight'

// e.g.:
//       array( 'g'=>array( -3, A ), array( -1, B ), array( 'weight'=>5, 'foo'=>'bar' ), 'f'=>array( -1, D ) )
// weight_key ... name of the key which holds each element's weight (default:
//                'weight')

// Returns:
// An array sorted by the weight of the source, e.g.
//         array( 'g'=>A, B, 'f'=>D, array('weight'=>5, 'foo'=>'bar') )
// if the first form is used, only the 'var' will be returned; with the
// second form the elements are untouched, only their position changed.

// Notes:
// Entries in the source array with the same weight are returned in the
// same order
// * weight might be a function closure
function weightSort($arr, $options = array('key' => 'weight'))
{
    if (is_string($options)) {
        $options = array(
            'key' => $options,
        );
    }
    if (!array_key_exists('key', $options)) {
        $options['key'] = 'weight';
    }
    if (!array_key_exists('compareFunction', $options)) {
        $options['compareFunction'] = function ($a, $b) {
            if ($a == $b) {
                return 0;
            }

            return $a < $b ? -1 : 1;
        };
    }

    $ret1 = array();

    if (!$arr) {
        return array();
    }

    // first put all elements into an assoc. array
    foreach ($arr as $k => $cur) {
        if (is_object($cur)) {
            $wgt = isset($cur->$options['key']) ? $cur->$options['key'] : 0;
            $data = $cur;
        } elseif ((sizeof($cur) == 2) && array_key_exists(0, $cur) && array_key_exists(1, $cur)) {
            $wgt = $cur[0];
            $data = $cur[1];
        } else {
            $wgt = (isset($cur[$options['key']]) ? $cur[$options['key']] : 0);
            $data = $cur;
        }

        if (is_callable($wgt)) {
            $wgt = call_user_func($wgt);
        }

        $ret1[$wgt][$k] = $data;
    }

    // get the keys, convert to value, order them
    uksort($ret1, $options['compareFunction']);
    $ret2 = array();

    if (array_key_exists('reverse', $options) && $options['reverse']) {
        $ret1 = array_reverse($ret1);
    }

    // iterate through array and compile final return value
    foreach ($ret1 as $cur) {
        foreach ($cur as $j => $d) {
            $ret2[$j] = $cur[$j];
        }
    }

    return $ret2;
}

// legacy
function weight_sort($arr, $weightKey = 'weight')
{
    trigger_error(E_USER_WARNING, 'Deprecated: weight_sort, use weightSort instead');

    return weightSort($arr, $weightKey);
}

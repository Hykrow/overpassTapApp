<?php
require_once 'weightSort.php';
$input = array(
  array( 'name' => 'Alice',  'weight' => 62.5, 'height' => 160 ),
  array( 'name' => 'Bob',    'weight' => 77.0, 'height' => 180 ),
  array( 'name' => 'Charly', 'weight' => 82.5, 'height' => 180 ),
  array( 'name' => 'Debby',  'weight' => 62.5, 'height' => 165 ),
  array( 'name' => 'Earl',   'weight' => 80.0, 'height' => 185 )
);

class weightSort_test extends PHPUnit_Framework_TestCase {

  // sort, default ("weight" are numericals)
  public function testWeightSortDefault () {
    global $input;
    $arr = weightSort($input);

    $expected = var_export(array(
      0 => array( 'name' => 'Alice',  'weight' => 62.5, 'height' => 160 ),
      3 => array( 'name' => 'Debby',  'weight' => 62.5, 'height' => 165 ),
      1 => array( 'name' => 'Bob',    'weight' => 77.0, 'height' => 180 ),
      4 => array( 'name' => 'Earl',   'weight' => 80.0, 'height' => 185 ),
      2 => array( 'name' => 'Charly', 'weight' => 82.5, 'height' => 180 )
    ), 1);
    $actual = var_export($arr, 1);

    $this->assertEquals($expected, $actual);
  }

  // sort, key "height" (which are integers)
  public function testWeightSortHeight() {
    global $input;
    $arr = weightSort($input, 'height');

    $expected = var_export(array(
      0 => array( 'name' => 'Alice',  'weight' => 62.5, 'height' => 160 ),
      3 => array( 'name' => 'Debby',  'weight' => 62.5, 'height' => 165 ),
      1 => array( 'name' => 'Bob',    'weight' => 77.0, 'height' => 180 ),
      2 => array( 'name' => 'Charly', 'weight' => 82.5, 'height' => 180 ),
      4 => array( 'name' => 'Earl',   'weight' => 80.0, 'height' => 185 )
    ), 1);
    $actual = var_export($arr, 1);

    $this->assertEquals($expected, $actual);
  }

  // sort, key "name" (which are strings)
  public function testWeightSortName() {
    global $input;
    $arr = weightSort($input, 'name');

    $expected = var_export(array(
      0 => array( 'name' => 'Alice',  'weight' => 62.5, 'height' => 160 ),
      1 => array( 'name' => 'Bob',    'weight' => 77.0, 'height' => 180 ),
      2 => array( 'name' => 'Charly', 'weight' => 82.5, 'height' => 180 ),
      3 => array( 'name' => 'Debby',  'weight' => 62.5, 'height' => 165 ),
      4 => array( 'name' => 'Earl',   'weight' => 80.0, 'height' => 185 )
    ), 1);
    $actual = var_export($arr, 1);

    $this->assertEquals($expected, $actual);
  }

  // sort, key "height" (which are integers) via options object
  public function testWeightSortOptionsHeight() {
    global $input;
    $arr = weightSort($input, array(
      'key' => 'height'
    ));

    $expected = var_export(array(
      0 => array( 'name' => 'Alice',  'weight' => 62.5, 'height' => 160 ),
      3 => array( 'name' => 'Debby',  'weight' => 62.5, 'height' => 165 ),
      1 => array( 'name' => 'Bob',    'weight' => 77.0, 'height' => 180 ),
      2 => array( 'name' => 'Charly', 'weight' => 82.5, 'height' => 180 ),
      4 => array( 'name' => 'Earl',   'weight' => 80.0, 'height' => 185 )
    ), 1);
    $actual = var_export($arr, 1);

    $this->assertEquals($expected, $actual);
  }

  // sort, with empty options object
  public function testWeightSortOptionsEmpty() {
    global $input;
    $arr = weightSort($input, array(
    ));

    $expected = var_export(array(
      0 => array( 'name' => 'Alice',  'weight' => 62.5, 'height' => 160 ),
      3 => array( 'name' => 'Debby',  'weight' => 62.5, 'height' => 165 ),
      1 => array( 'name' => 'Bob',    'weight' => 77.0, 'height' => 180 ),
      4 => array( 'name' => 'Earl',   'weight' => 80.0, 'height' => 185 ),
      2 => array( 'name' => 'Charly', 'weight' => 82.5, 'height' => 180 ),
    ), 1);
    $actual = var_export($arr, 1);

    $this->assertEquals($expected, $actual);
  }

  // sort, with alternative compareFunction
  public function testWeightSortOptionsCompareFunction() {
    global $input;
    $arr = weightSort($input, array(
        'key' => 'height',
        'compareFunction' => function ($a, $b) {
            return abs($a - 179) < abs($b - 179) ? -1 : 1;
        }
    ));

    $expected = var_export(array(
      1 => array( 'name' => 'Bob',    'weight' => 77.0, 'height' => 180 ),
      2 => array( 'name' => 'Charly', 'weight' => 82.5, 'height' => 180 ),
      4 => array( 'name' => 'Earl',   'weight' => 80.0, 'height' => 185 ),
      3 => array( 'name' => 'Debby',  'weight' => 62.5, 'height' => 165 ),
      0 => array( 'name' => 'Alice',  'weight' => 62.5, 'height' => 160 ),
    ), 1);
    $actual = var_export($arr, 1);

    $this->assertEquals($expected, $actual);
  }

  public function testWeightSortReverseFalse() {
    global $input;
    $arr = weightSort($input, array('reverse' => false));

    $expected = var_export(array(
      0 => array( 'name' => 'Alice',  'weight' => 62.5, 'height' => 160 ),
      3 => array( 'name' => 'Debby',  'weight' => 62.5, 'height' => 165 ),
      1 => array( 'name' => 'Bob',    'weight' => 77.0, 'height' => 180 ),
      4 => array( 'name' => 'Earl',   'weight' => 80.0, 'height' => 185 ),
      2 => array( 'name' => 'Charly', 'weight' => 82.5, 'height' => 180 )
    ), 1);
    $actual = var_export($arr, 1);

    $this->assertEquals($expected, $actual);
  }

  public function testWeightSortReverseTrue() {
    global $input;
    $arr = weightSort($input, array('reverse' => true));

    $expected = var_export(array(
      2 => array( 'name' => 'Charly', 'weight' => 82.5, 'height' => 180 ),
      4 => array( 'name' => 'Earl',   'weight' => 80.0, 'height' => 185 ),
      1 => array( 'name' => 'Bob',    'weight' => 77.0, 'height' => 180 ),
      0 => array( 'name' => 'Alice',  'weight' => 62.5, 'height' => 160 ),
      3 => array( 'name' => 'Debby',  'weight' => 62.5, 'height' => 165 )
    ), 1);
    $actual = var_export($arr, 1);

    $this->assertEquals($expected, $actual);
  }
}

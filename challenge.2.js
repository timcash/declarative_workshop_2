// ==============================================
//
//                    IMPORTS
//
// ==============================================

const test  = require('ava')
const R     = require('ramda')

// ==============================================
//
//                    TOOLKIT
//
// ==============================================

const pipe      = R.pipe
const map       = R.map
const filter    = R.filter
const reduce    = R.reduce
const pick      = R.pick
const values    = R.values
const zip       = R.zip
const zipObj    = R.zipObj
const mergeAll  = R.mergeAll
const set       = (k, v, record) => {
  record[k] = v
  return record
}

// ==============================================
//
//                 DECLARATIVE
//
// ==============================================

// create a function called add that takes one argument and
// returns another function that takes one argument and returns
// the two numbers added together
// WARNING: do not use the curry supplied by Ramda, make this
// function yourself
test.skip('curry', t => {


  let add2 = add(2)
  t.deepEqual(add2(2), 4)
})

// create a function called mapper that multiplies each element by 2
// and returns a new list, should not modify the input list
// use the Ramda map function supplied above
test.skip('map', t => {

  t.deepEqual(
    mapper( [1, 2, 3] ),
    [2, 4, 6]
  )
  t.deepEqual(data, [1, 2, 3])
})

// create a function called filterer that only return elements < 2
// and returns a new list, should not modify the input list
// use the Ramda filter function supplied above
test.skip('filter', t => {

  t.deepEqual(
    filterer( [1, 2, 3] ),
    [1]
  )
  t.deepEqual(data, [1, 2, 3])
})

// create a function called reducerer that sums a list of elements
// and returns a single number, should not modify the input list
// use the Ramda reduce function supplied above
test.skip('reduce', t => {

  t.deepEqual(
    reducerer( [1, 2, 3] ),
    6
  )
  t.deepEqual(data, [1, 2, 3])
})

// create a function called justvalues and use the values function
test.skip('values', t => {

  t.deepEqual(
    justvalues( {first:1, second: 2, third: 3} ),
    [1, 2, 3]
  )
})

// create a function called picker use the pick function
test.skip('pick', t => {

  t.deepEqual(
    picker( {first:1, second: 2, third: 3} ),
    {first: 1, third: 3}
  )
})

// create a function called plucker use the pluck function
test.skip('pluck', t => {

  t.deepEqual(
    plucker( [{f1: 1, f2: 3}, {f1: 1, f2: 2}, {f1: 1, f2: 4}] ),
    [3, 2, 4]
  )
})

// create a function called zipper1 and use the zip function
test.skip('zip', t => {

  t.deepEqual(
    zipper1( ['first', 'second', 'third'], [1, 2, 3]),
    [['first', 1], ['second', 2], ['third', 3]]
  )
})

// create a function called zipper2 and use the zipObj function
test.skip('zipObj', t => {

  t.deepEqual(
    zipper2( ['first', 'second', 'third'], [1, 2, 3] ),
    {first:1, second: 2, third: 3}
  )
})

// use the pipe function to double a list of numbers then
// filter out the numbers > 5, call the function data_pipeline
test.skip('pipe', t => {

  t.deepEqual(
    data_pipeline([1, 2, 3]),
    [2, 4]
  )
})

// ==============================================
//
//                    IMPORTS
//
// ==============================================

const test  = require('ava')

// ==============================================
//
//                  FAKE DATA
//
// ==============================================

let input = [{
    'id': 'notes',
    'displayName': 'Test Feature',
    'description': 'A really great test feature',
    'isAvailableForOptIn': false,
    'isEnabledForUser': true,
    'canToggle': true
}, {
    'id': 'mentor',
    'displayName': 'Test Feature',
    'description': 'A really great test feature',
    'isAvailableForOptIn': true,
    'isEnabledForUser': false,
    'canToggle': true
}]

let expected = {
  notes: {
    feature: 'notes', enabled: true, optin: false
  },
  mentor: {
    feature: 'mentor', enabled: false, optin: true
  }
}

/* ======================================================

                      IMPERATIVE

    Use only for loops like
    for(let i = 0; i < input.length; i++) to do iteration.
    Otherwise use Classes or whatever other method
    you like to pass the test.

    WAIT: dont use anything from Ramda just yet or
    any declarative style. Try to use "c" style code

====================================================== */

// write a function called swapper that takes and return a record
// with the keys swapped out
test.skip('Imperative swapper', t => {

  t.deepEqual(swapper({foo: 'bar'}) , {baz: 'bar'})
})

// write a function called keyer that takes a record and returns
// a new record with a key set to the value of the whole record
test.skip('Imperative keyer', t => {

  t.deepEqual(keyer({id: '42', foo: 'bar'}) , {'42':{id: '42', baz: 'bar'}})
})

// Use the "input" and "expected" data from above to pass this test
test.skip('Imperative 1', t => {

  const result = imperativeTranformer1(input)
  t.deepEqual(result, expected)
})

// Now add the ability to define which keys to convert
// and which key to use as the "index"
test.skip('Imperative 2', t => {

  const result = imperativeTranformer2(input,
    ['id', 'isEnabledForUser', 'isAvailableForOptIn'],
    ['feature', 'enabled', 'optin'],
    'feature'
  )
  t.deepEqual(result, expected)
})

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
//                  FAKE DATA
//
// ==============================================

// the goal is to turn a data structure that looks like input
// into a structure that looks like expected using a declarative style

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

                    DECLARATIVE

    Use your knowledge from the previous challenge
    to create a few functions from the toolkit above.
    Try to do one one step at a time then use pipe
    to compose the functions together. Maybe even try
    creating a few piped functions and compose a
    composition

====================================================== */


test.skip('Declarative 1', t => {
  const f = declarativeTransformer(
    ['id', 'isEnabledForUser', 'isAvailableForOptIn'],
    ['feature', 'enabled', 'optin'],
    'feature'
  )
  let result = f(input)
  t.deepEqual(result, expected)
})

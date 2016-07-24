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
const curry     = R.curry
const set       = (k, v, record) => {
  record[k] = v
  return record
}

// ==============================================
//
//               OUR DATABASE
//
// ==============================================

class Database {
  constructor() {
    this.store = {}
  }

  set(k , v) {
    this.store[k] = v
  }

  get(k) {
    return this.store[k]
  }

  query(a_fake_query) {
    return {
      timbob: {id: 'timbob', age: 35, score:85.5},
      joesmoe: {id: 'joesmoe', age: 46, score: 99.3}
    }
  }
}

// ==============================================
//
//               OUR MODEL
//
// ==============================================


 /*
  A customer with event hooks, notice I have not embeded
  any logic about how to save or what database to use. Instead
  I will pass in a function for a Customer to use when 'clicked'
  This delays any binding and makes the Customer a 'dumb' component
*/

class Customer {
  constructor(onSave, getFriends, id, age) {
    this.save = onSave
    this.id = id
    this.age = age
  }

  clicked () {
    this.save({id: this.id, age: this.age})
  }
}

// ==============================================
//
//               OUR PROGRAM
//
// ==============================================

/*
  Task
  Make a customer save only if it passes a filter test
*/

/*
  Instead of thinking about how to hook up everything in the
  program write a generic function that takes everything it needs
  as arguments. For example
*/

// (customer) -> (customer) -> customer -> bool
const saveCustomerFiltered = curry((dbWriter, filter, customer) => {
  if (filter(customer)) return dbWriter(customer)
  return false
})

/*
  With the function above I have again delayed knowing anything about how
  a database write works or what filter I will apply. This function is trival
  to test, easy to reason to about, and could be cut and paste into any module
  meaning it has no dependencies. Let us write a generic test for it now.
*/

test('should true or false depending on the filter', t => {
  // I can see above that a dbWriter takes one argument and needs to return a bool
  const myDbWriter = (c) => true
  // Filter also takes a customer and returns a bool
  const myFilter = (c) => c.age > 21
  // and last I will need a customer
  const myCustomer1 = {id: 'tim', age: 35}
  const myCustomer2 = {id: 'jen', age: 20}
  // now lets try to use the function
  const result1 = saveCustomerFiltered(myDbWriter, myFilter, myCustomer1)
  const result2 = saveCustomerFiltered(myDbWriter, myFilter, myCustomer2)

  t.deepEqual(result1, true)
  t.deepEqual(result2, false)
})

// Redis Adapters (make it easy to use)
const redisWriteCustomer = (db, customer) => {
  return db.set(customer.id, customer)
}



// A fake main function
const main = () => {

  // Program init
  // Setup connections to databases
  const redis = new Database({connectionInfo: '100.1.99.2'})
  const onSaveRedis = saveCustomerFiltered(redisWriteCustomer(redis))

  // somewhere else in the program ...
  // e.g. when a user fills in a 'filter' form
  // this could be in a seperate module
  const onSaveRedisOver21 = onSaveRedis(c => c > 21)

  // somewhere else in the program ...
  // when I only want to create customers that only save if
  // they are over 21
  let c1 = new Customer(onSaveRedisOver21, 'Timmy', 35)

  // somewhere else in the program ...
  c1.save()
}


const LogIt = (thing) => {
  console.log(thing)
  return thing
}

// ==============================================
//
//               OUR TESTS
//
// ==============================================

test.skip('should save a customer to redis', t => {

})

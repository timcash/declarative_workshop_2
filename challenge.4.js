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
//                  SCENARIO
//
// ==============================================

/*
  The task is to build an api to save customers to a database.
  Below I will attempt to show some reasoning around partial application
  and how it can integrate with a TDD workflow.

  A customer will have an ID and an AGE like
  {id: 'timbob', age: 35}
  This should be all we need to now to buid the database layer

  Highlights of Parial Application and Curry
    - Create simple tests without any knowledge of the larger system
      - This encourages TDD
      - Reduce the need to mock (multi layer objects)
      - Reduce the need to stub and spy
    - Create functions that use late binding
      - Send in any method that follows the interface
    - Create functions that have few dependencies
      - Easy to refacor and move into other modules
    - Create functions that can takes arguments as they thread through a program
      - Prevents needing to have all arguments at high and low levels,
        supply what you need when you have it
    - Create code that can change!
*/

// ==============================================
//
//               OUR DATABASE
//
// ==============================================

// A really simple Database engine, I call it SimpleDB
// This thing will do a million writes per second!
class simpleDB {
  constructor() {
    this.store = {}
  }

  set(k , v) {
    this.store[k] = v
    return true
  }

  get(k) {
    return this.store[k]
  }
}

// Make a function that saves a customer to a simpleDB, notice I pass in the
// database instead of calling something like myDB.save(customer)
const simpleCustomerSaver = curry((db, customer) => {
  return db.set(customer.id, customer)
})

// Let us write a test to save a customer to a database
test('should save a customer', t => {

  // test setup
  const myDb = new simpleDB({fake_connection_info: '127.0.0.1'})
  const myCustomer = {id: 'timbob', age: 35}

  // Here I supply only the database to use. This is to demonstrate
  // how it may be used in production code and that this function
  // could be passed into other components ready to save customers
  // without needing to initialize or connect to the database again
  const mySimpleSaver = simpleCustomerSaver(myDb)

  // Try it out
  mySimpleSaver(myCustomer)

  // I should now be able to get the same customer back out of the database
  // Ill use the database directly to verify this
  const result = myDb.get(myCustomer.id)
  const expected = myCustomer
  t.deepEqual(result, expected)
})

// Awesome, now we know our simpleCustomerSaver works!

// ==============================================
//
//               OUR CUSTOMER CLASS
//
// ==============================================

 /*
  Have a look at our customer class with event hooks.
  Notice I have not embeded any logic about how to save or what database to use.
  Instead I will pass in a function for a Customer to use when 'clicked'.
  This delays any binding and makes the Customer a 'dumb' component.
  Ignore getFriends for now. We will come back to this later
*/

class Customer {
  constructor(onSave, getFriends, id, age) {
    this.save     = onSave
    this.friends  = getFriends
    this.id       = id
    this.age      = age
  }

  saveClicked () {
    this.save({id: this.id, age: this.age})
  }

  viewClicked () {
    return this.friends(this.id)
  }

  getAsRecord() {
    return {id: this.id, age: this.age}
  }
}

// Now to test the Customer class and its saveClicked function
// with our simpleCustomerSaver from above
test('should save a customer using the saveClicked', t => {

  // test setup
  const myDb = new simpleDB({fake_connection_info: '127.0.0.1'})

  // just like above lets fill in the first argument to simpleCustomerSaver
  const mySimpleSaver = simpleCustomerSaver(myDb)
  // and pass it into Customer
  const myCustomer = new Customer(mySimpleSaver, () => {}, 'timbob', 35)
  // now try the function we want to test
  myCustomer.saveClicked()

  // I should now be able to get the same customer back out of the database
  // Ill use the database directly to verify this
  let result    = myDb.get(myCustomer.id)
  let expected  = myCustomer.getAsRecord()
  t.deepEqual(result, expected)
})


// ==============================================
//
//               OUR PROGRAM
//
// ==============================================

/*
  Task
  Make a customer save only if it passes a filter test

  Instead of thinking about how to hook up everything in the
  program write a generic function that takes everything it needs
  as arguments. For example
*/

// (customer -> bool) -> (customer -> bool) -> customer -> bool
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

test('should be true or false depending on the filter', t => {
  // I can see above that a dbWriter takes one argument and needs to return a bool
  const myDbWriter = c => true
  // Filter also takes a customer and returns a bool
  const myFilter = c => c.age > 21
  // and last I will need a customer
  const myCustomer1 = {id: 'tim', age: 35}
  const myCustomer2 = {id: 'jen', age: 20}
  // now lets try to use the function
  const result1 = saveCustomerFiltered(myDbWriter, myFilter, myCustomer1)
  const result2 = saveCustomerFiltered(myDbWriter, myFilter, myCustomer2)

  t.deepEqual(result1, true)
  t.deepEqual(result2, false)
})

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

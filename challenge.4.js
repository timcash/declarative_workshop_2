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
const isEmpty   = R.isEmpty
const set       = (k, v, record) => {
  record[k] = v
  return record
}
const getAmount = () => {/*a fake function ...*/}
const fetch     = () => {/*a fake function ...*/}

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
    - Create functions that can take arguments as they thread through a program
      - Prevents needing to have all arguments at high and low levels,
        supply what you need when you have it
    - Create code that can change!
    - Create composable functions by maniplulating the arguments
      - If I can build a bunch of functions that are the same shape
        it is easy to pipe them together (see more below)
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
  if (isEmpty(customer)) return false
  return db.set(customer.id, customer)
})

// Let us write a test to save a customer to a database
test.skip('should save a customer', t => {

  // test setup
  const myDb = new simpleDB({fake_connection_info: '127.0.0.1'})
  const myCustomer = {id: 'timbob', age: 35}

  /*
    Here I supply only the database to use (I curry it in).
    This is to demonstrate how it may be used in production code
    and that this function could be passed into other components
    ready to save customers without needing to initialize or
    connect to the database again
  */
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
  constructor(onSave, id, age) {
    this.save     = onSave
    this.id       = id
    this.age      = age
  //this.friends  = getFriends
  //this.saveFriend = saveAFriend
  }

  saveClicked () {
    this.save({id: this.id, age: this.age})
  }

  // viewClicked () {
  //   return this.friends(this.id)
  // }

  // saveFriendClicked (friend) {
  //   return this.saveFriend(friend)
  // }

  // A helper function
  getAsRecord() {
    return {id: this.id, age: this.age}
  }
}

// Now to test the Customer class and its saveClicked function
// with our simpleCustomerSaver from above
test.skip('should save a customer using the saveClicked', t => {

  // test setup
  const myDb = new simpleDB({fake_connection_info: '127.0.0.1'})

  // just like above lets fill in the first argument to simpleCustomerSaver
  const mySimpleSaver = simpleCustomerSaver(myDb)

  // and pass it into Customer
  const myCustomer = new Customer(mySimpleSaver, 'timbob', 35)

  // now try the function we want to test
  myCustomer.saveClicked()

  // I should now be able to get the same customer back out of the database
  // Ill use the database directly to verify this
  const result    = myDb.get(myCustomer.id)
  const expected  = myCustomer.getAsRecord()
  t.deepEqual(result, expected)
})

// Notice that when the Customer object uses onSave it does not need to
// know anything about the database. In fact it would be just as easy to
// send in any function to onSave that takes a customer shaped
// record as an object. See an example below


// ==============================================
//
//           A CHANGE TO THE CODE
//
// ==============================================

/*
  Imagine you would now need to change how a customer is saved
  For example, save only if it passes a filter test
  Instead of thinking about how to hook up everything in the
  program write a generic function that takes everything it needs
  as arguments and could be used independently. For example
*/

// :: (customer -> bool) -> (customer -> bool) -> customer -> bool
const saveCustomerFiltered = curry((dbWriter, filter, customer) => {
  if (filter(customer)) return dbWriter(customer)
  return false
})

/*
  With the function above I have again delayed knowing anything about how
  a database write works or what filter I will apply. This function is trival
  to test, easy to reason to about, and could be cut and paste into any module
  meaning it has no dependencies (If you want me to explain the type anotation
  above the function lets talk about it in the workshop)
  Let us write a generic test for it now.
*/

test.skip('should be true or false depending on the filter', t => {
  // I can see above that a dbWriter takes one argument and needs to return a bool
  // The worlds simplest mock with no need for a mock framework
  const myDbWriter  = c => true

  // Filter also takes a customer and returns a bool
  const myFilter    = c => c.age > 21

  // and last I will need a customer
  const myCustomer1 = {id: 'tim', age: 35}
  const myCustomer2 = {id: 'jen', age: 20}

  // now lets try to use the function
  const result1 = saveCustomerFiltered(myDbWriter, myFilter, myCustomer1)
  const result2 = saveCustomerFiltered(myDbWriter, myFilter, myCustomer2)

  t.deepEqual(result1, true)
  t.deepEqual(result2, false)
})

// great! now I have a filter saver

// ==============================================
//
//           A FAKE MAIN FUNCTION
//
// ==============================================
// Here is how we could use this idea in a program
// dont try to run this code it is just to demonstrate
const main = () => {

  // Program init
  // Setup connections to databases
  const redis = new Redis({host: '100.1.99.2:5637'})
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
  c1.saveClicked()
}

// What if we wanted to validate the customer before we saved it
// as above we could create a new function but this time it takes four paramaters
// e.g.
const saveValidatedCustomerFiltered = curry((dbWriter, validate, filter, customer) => {
  if (validate(customer) && filter(customer)) return dbWriter(customer)
  return false
})

// ==============================================
//
//           CHOOSE YOUR OWN ADVENTURE
//
// ==============================================

// Read below for some more advanced ideas and discussion or attempt
// to add the saveFriend and getFriends to the Customer class above
// HINT: you will need to uncomment the code in the Customer class
// and create a new way to save a friend to the database. Try to use TDD
// and build independent functions

// ==============================================
//
//          MODIFY THE CUSOMTER CLASS (go back up)
//
//          MORE ADVANCED IDEAS (look below)
//
// ==============================================

// Maybe you see something better than the saveValidatedCustomerFiltered above?
// Perhaps validate could be part of filter?
// Or maybe you are starting to see that all of these functions
// (because they can be curried) can take a shape like
// (customer) -> bool
// They take a customer and return a bool. This seems like it could be useful
// Let us think about our friend the pipe function. Would it be cool if
// we could do something like the following?
let myDb1       = new simpleDB()
const mySaver   = simpleCustomerSaver(myDb1)
const isValid   = c => c.id && c.age
const oldEnough = c => c.age > 21

const pipedOnSaver = pipe(isValid, oldEnough, mySaver)
// and use it like this
// pipedOnSaver(myCustomer)

// Remember that pipe returns a function with one argument waiting to be
// supplied and that argument will be passed into the first function in the
// list and its return will be passed into the next argument.
// But the function above is not correct. isValid, oldEnough, and mySaver
// all return a bool and take a customer. So isValid needs to somehow pass
// the customer on if it passes the test.

// This is normally where I would start going on about Monoids and Monads
// and Math! But it turns out you dont need to know about those things
// to use them. Let us make a function that will help us out with our
// pipedOnSaver above
const passIF = curry((f, input) => {
  if (f(input)) return input
  return {}
})

// In the function above we take a function "f" and some input, apply that input
// to f, then if it passes we return the original input, if it does not pass we
// return an empty object
// now we can make our pipe function
const pipedOnSaver2 = pipe(passIF(isValid), passIF(oldEnough), mySaver)

// Or maybe if I use a convention like adding a _Pass to the end of a function
// I could make it look a bit nicer
const isValid_Pass    = passIF(isValid)
const oldEnough_Pass  = passIF(oldEnough)
const pipedOnSaver3   = pipe(isValid_Pass, oldEnough_Pass, mySaver)

// Time to test it out
test.skip('our pipeline should work', t => {
  // A simple record to pass through the pipeline
  const myCustomer = {id:'Jane', age:22}
  // The result of the pipeline
  const pipeResult = pipedOnSaver3(myCustomer)
  // did the record make it into the database ?
  const dataResult = myDb1.get(myCustomer.id)

  t.deepEqual(pipeResult, true)
  t.deepEqual(dataResult, myCustomer)
})

// pipedOnSaver3 is pretty cool. Easy to read and easy to change
// Let us make a small change now. Add some logging with my simple
// LogIt function

const LogIt = (thing) => {
  if (isEmpty(thing)) return thing
  console.log(thing)
  return thing
}

const pipedOnSaver4 = pipe(
  isValid_Pass,
  oldEnough_Pass,
  LogIt,
  mySaver
)

// Maybe you can see how you would add error handling to the pipeline

// There is a more advanced way to deal with empty objects and non passing
// filters / validation / error handling. For example pipe could stop sending the
// argument along if any of the functions return false or throw errors

// If you made it this far and feel like you understand everything a good next
// step is to look into streams and RxJs for async pipes !!!

// I hope you get a sense for how nice curry can make your code look and how it
// can free one from needing to understand anyting other than the function one
// is working on. Here are a few "Rules of Thumb" to follow when using curry

// =======================
//          #1
// =======================
// Put data arguments at the end of the argumnet list
// instead of this
const fn1_1 = (data_to_filter, testFunction) => {
  //...
}
// do this
const fn1_2 = (testFunction, data_to_filter) => {
  //...
}
// This pattern will make working with curry and pipe more simple
// to reason about

// =======================
//          #2
// =======================
// Do not pass through arguments that just get passed on again like
const fn2_1 = (getAmount, fetch, url, myData2) => {
  const val1 = getAmount(fetch, url)
  return myData2 + val1
}
// instead curry in myFunc2 ahead of time. This will keep your argment list short
// and make things easy to test. Like this
const amountGetter = getAmount(fetch)

const fn2_2 = (amountGetter, url, myData2) => {
  const val1 = amountGetter(url)
  return myData2 + val1
}

// =======================
//          #3
// =======================
// Pass in all function that deal with side effects e.g. Time, Random,
// network calls and database calls, that way they can be manipulated
// in tests and debugging
// instead of something like this
const fn3_1 = (customer) => {
  customer.created_at = Date.now()
  return customer
}

// do something like this
const fn3_2 = (now, customer) => {
  customer.created_at = now()
  return customer
}

// =======================
//          #4
// =======================
// Pass in the function you want to use and not some larger object
// with many properties
const fn4_1 = (myDataDriver, customer) => {
  return myDataDriver.instance.save(customer)
}

// instead do something like this
const fn4_2 = (save, customer) => {
  return save(customer)
}
// when you build tests and want to change code you will find this
// pattern prevents needing to know about dataDriver.instance.save

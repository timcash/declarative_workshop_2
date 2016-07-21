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

// A customer with event hooks
class Customer {
  constructor(onSave, id, age) {
    this.save = onSave
    this.id = id
    this.age = age
  }

  clicked () {
    this.save({id: this.id, age: this.age})
  }
}

// Redis Adapters (make it easy to use)
const redisWriteCustomer = (db, customer) => {
  return db.set(customer.id, customer)
}

// A Generic save funcion, any database and filter can be used
const saveCustomerFiltered = (dbWriter, filter, customer) => {
  if (filter(customer)) dbWriter(customer)
}

// A fake main function
const main = () => {

  // Program init
  // Setup connections to databases
  const redis = new Redis({connectionInfo: '100.1.99.2'})
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

test.skip('should save a customer to redis', t => {

})

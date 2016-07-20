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

const saveFiltered = (dbWriter, filter, customer) => {
  if (filter(customer)) dbWriter(customer)
}

const LogIt = (thing) => {
  console.log(thing)
  return thing
}

const main = () => {
  const redis = new Redis({connectionInfo: '100.1.99.2'})
  const redisSaver = saveCustomer(db.set)
}

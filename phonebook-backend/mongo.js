const mongoose = require('mongoose')

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.3gp1m.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

// Not enough arguments, require password
if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

// Display phonebook database
if (process.argv.length === 3) {
  Person
    .find({})
    .then(result => {
      result.forEach(note => {
        console.log(note)
      })
      mongoose.connection.close()
    })
}

// Require both name and number
if (process.argv.length === 4) {
  console.log('Please provide name and number as arguments: node mongo.js <password> <name> <number>')
  process.exit(1)
}

// Add new person to phonebook
if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  person
    .save()
    .then(() => {
      console.log(`Added ${process.argv[3]} ${process.argv[4]} to the phonebook`)
      mongoose.connection.close()
    })
}


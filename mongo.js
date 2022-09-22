const mongoose = require('mongoose')

const exit = () => {
  mongoose.connection.close()
  process.exit(1)
}

if (process.argv.length<3) {
  console.log('Error: Give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://Cluster0user:${password}@cluster0.snhtugt.mongodb.net/Phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    exit()
  })
}

else if (process.argv.length === 4) { 
  console.log('Error: Must include both name and number')
  exit()
}

else {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })
  
  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    exit()
  })
}




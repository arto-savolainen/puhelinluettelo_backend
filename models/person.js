const mongoose = require('mongoose')

//const url =
//  `mongodb+srv://Cluster0user:${password}@cluster0.snhtugt.mongodb.net/Phonebook?retryWrites=true&w=majority`
const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    validate: {
      validator: (x) => {
        return Person.exists({ name: x })
          .then(result => {
            if (!result) { return true }
            else { return false }
          })
      },
      message: 'Error: name must be unique'
    }
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: (x) => {
        return /^\d{2,3}-\d+$/.test(x)
      },
      message: props => `Error: ${props.value} is not a valid phone number`
    }
  }
})

const Person = mongoose.model('Person', personSchema)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('postData', (req) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return null
  }

  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

app.get('/info', (req, res, next) => {
  Person.find({}).then(persons => {
    res.send(`<div>Phonebook has info for ${persons.length} people</div><div>${Date()}</div>`)
  })
    .catch(error => next(error))
})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      }
      else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(response => {
      if (response) {
        res.json(response)
      }
      else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons/', (req, res, next) => {
  const body = req.body

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })

  newPerson.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  let body = req.body

  Person.findByIdAndUpdate(req.params.id,
    { number: String(body.number) },
    { new: true, runValidators: true, context: 'query' })
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.status(200).end()
      }
      else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// tämä tulee kaikkien muiden middlewarejen ja routejen rekisteröinnin jälkeen!
app.use(errorHandler)

//käytetään fly.io tai lokaalia .env ympäristömuuttujaa PORT
let PORT = process.env.PORT
if (!PORT) { PORT = 3001 }
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
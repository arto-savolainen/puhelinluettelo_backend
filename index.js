const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))

const getRandomId = () => {
  return Math.floor(Math.random() * 1000000000);
}

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendick",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/info', (req, res) => {
  res.send(`<div>Phonebook has info for ${persons.length} people</div><div>${Date()}</div>`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(x => x.id === id)

  if (!person) {
    return res.status(404).end()
  }
  else {
    return res.json(person)
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const personIndex = persons.findIndex(x => x.id === id)

  if (personIndex >= 0) {
    persons.splice(personIndex, 1)
    return res.send(`Succesfully deleted person with id ${id}`)
  }
  else {
    return res.status(404).end()
  }
})

app.post('/api/persons/', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(401).json({ error: 'data must contain name and number' })
  }
  else if (persons.find(x => x.name === body.name)) { 
    return res.status(400).json({ error: 'name must be unique' })
  }

  let newId = getRandomId()
  //this should be removed when the database is larger & id generation should be unique
  while (persons.find(x => x.id === newId)) {
    newId = getRandomId()
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: newId
  }

  persons.push(newPerson)
  return res.json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
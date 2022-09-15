const { response } = require('express')
const express = require('express')
const app = express()

const deletePerson = (id) => {
  const personIndex = persons.findIndex(x => x.id === id)

  if (personIndex >= 0) {
    persons.splice(personIndex, 1)
    return true
  }
  
  return false
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
    res.status(404).end()
  }
  else {
    res.json(person)
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)

  if (!deletePerson(id)) {
    res.status(404).end()
  }
  else {
    res.send(`Succesfully deleted person with id ${id}`)
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
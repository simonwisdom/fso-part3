import React, { useState, useEffect } from 'react'
import DisplayNumbers from './components/DisplayNumbers'
import noteService from './services/notes'
import './index.css'

const Filter = ({ onChange }) => {
  return (
    <div>filter shown with <input onChange={onChange} /></div>
  )
}

const NewPersonForm = ({ onSubmit, nameValue, nameOnChange, numberValue, numberOnChange }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input
          value={nameValue}
          onChange={nameOnChange}
        />
      </div>
      <div>number: <input
        value={numberValue}
        onChange={numberOnChange}
      />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Notification = ({ message }) => {
  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === null) {
    return null
  }

  else
    return (
      <div style={notificationStyle}>
        {message}
      </div>
    )

}

const Error = ({ message }) => {
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === null) {
    return null
  }

  else
    return (
      <div style={errorStyle}>
        {message}
      </div>
    )

}

const Footer = () => {
  const footerStyle = {
    color: 'grey',
    fontSize: 16
  }

  return (
    <div style={footerStyle}>
      <br />
      <em>Phonebook app, Department of Simon, University of Wisdom 2022</em>
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [personsToShow, setPersonsToShow] = useState(persons)
  const [notifMessage, setNotifMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
        setPersonsToShow(initialPersons)
      })
  }, [])

  const addName = (e) => {
    e.preventDefault()

    const nameExists = persons.find(note => note.name === newName)
    const numberExists = persons.find(note => note.number === newNumber)

    if (nameExists && numberExists) {
      setErrorMessage(`${newName} is already added to the phonebook`)
      setTimeout(() => { setErrorMessage(null) }, 3000)
    } else if (nameExists) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with the new one?`)) {
        const preChangePerson = persons.find(note => note.name === newName)
        const changedPerson = { ...preChangePerson, number: newNumber }
        noteService
          .update(preChangePerson.id, changedPerson)
          .then(returnedPerson => {
            setPersonsToShow(persons.map(person => person.id !== preChangePerson.id ? person : returnedPerson))
            setPersons(persons.map(person => person.id !== preChangePerson.id ? person : returnedPerson))
            setNotifMessage('Updated the number for ' + preChangePerson.name)
            setTimeout(() => { setNotifMessage(null) }, 3000)
          })
          .catch(error => {
            setErrorMessage(`${newName} was already deleted from the server`)
            setTimeout(() => { setErrorMessage(null) }, 3000)
            setPersonsToShow(persons.filter(person => person.id !== preChangePerson.id))
          })
        setNewName('')
        setNewNumber('')
      }
    } else if (numberExists) {
      window.alert(`${newNumber} is already attached to ${numberExists.name}`);
    } else {

      // Append name to phonebook
      const noteObject = {
        name: newName,
        number: newNumber,
        id: persons.length + 1,
      }

      noteService
        .create(noteObject)
        .then(createdPerson => {
          setPersons(persons.concat(createdPerson))
          setPersonsToShow(persons.concat(createdPerson))
          setNewName('')
          setNewNumber('')
          setNotifMessage(createdPerson.name + ' was added to the phonebook')
          setTimeout(() => { setNotifMessage(null) }, 3000)
        })
        .catch(error => {
          setErrorMessage(error.response.data.error)
          setTimeout(() => { setErrorMessage(null) }, 3000)
          console.log(error.response.data.error);
        })

    }
  }


  const handleInputChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberInputChange = (event) => {
    setNewNumber(event.target.value)
  }

  const filterNames = (e) => {
    const searchStr = e.target.value.toLowerCase();
    setPersonsToShow(persons.filter(person => person.name.toLowerCase().includes(searchStr)));
  }

  const removeName = (id) => {
    const noteToRemove = persons.find(note => note.id === id)
    if (window.confirm(`Delete ${noteToRemove.name}?`)) {
      noteService
        .remove(id)
        .then(createdPerson => {
          setPersons(persons.filter(note => note.id !== id))
          setPersonsToShow(persons.filter(note => note.id !== id))
          setNotifMessage(noteToRemove.name + ' was removed from the phonebook')
          setTimeout(() => { setNotifMessage(null) }, 3000)
        })
    }
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notifMessage} />
      <Error message={errorMessage} />
      <Filter onChange={filterNames} />
      <h3>add a new</h3>
      <NewPersonForm
        onSubmit={addName}
        nameValue={newName}
        nameOnChange={handleInputChange}
        numberValue={newNumber}
        numberOnChange={handleNumberInputChange}
      />
      <h3>Numbers</h3>
      <ul>
        {personsToShow.map(person =>
          <DisplayNumbers
            person={person}
            key={person.id}
            onClick={() => removeName(person.id)}
          />
        )}
      </ul>
      <Footer />
    </div>
  )
}

export default App

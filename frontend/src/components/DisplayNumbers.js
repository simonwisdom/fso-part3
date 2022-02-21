import React from 'react'

const DisplayNumbers = ({ person, onClick }) => {
    return (
      <li className='person'>
      {person.name} {person.number}
     <button onClick={onClick}>remove</button>
     </li>
      // <ul>
      // {persons.map(person =>
      //   <li key={person.id}>{person.name} {person.number}
      //   <button onClick={onClick}>remove</button>
      //   </li>
      // )}

      // </ul>
    )
  }

  export default DisplayNumbers

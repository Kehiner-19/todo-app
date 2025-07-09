import { useState } from 'react';
import axios from 'axios';

function Registro() {
  const [title, setTitle] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title) {
      alert('Por favor, ingresa un título');
      return;
    }

    const newTodo = { title, completed: isCompleted };
    
    axios.post('https://jsonplaceholder.typicode.com/todos', newTodo)
      .then(response => {
        console.log('Nuevo Todo creado:', response.data);
      })
      .catch(error => {
        console.error('Error al crear el todo:', error);
      });
  };

  return (
    <div>
      <h1>Crear Nuevo Todo</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título del todo"
        />
        <label>
          Completado
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => setIsCompleted(!isCompleted)}
          />
        </label>
        <button type="submit">Crear</button>
      </form>
    </div>
  );
}

export default Registro;

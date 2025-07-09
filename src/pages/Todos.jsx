import { useState, useEffect } from 'react';
import axios from 'axios';

function Todos() {
  const [todos, setTodos] = useState([]);
  const [nuevoTodo, setNuevoTodo] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [todoEditado, setTodoEditado] = useState({ id: null, titulo: '' });
  const [filtro, setFiltro] = useState('todos');

const API_URL = 'http://localhost:3000/todos';

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTodos(data);
    setError(null);
  } catch (err) {
    console.error(err);
    setError('Error al cargar las tareas.');
  } finally {
    setCargando(false);
  }
};


  const agregarTodo = async (e) => {
    e.preventDefault();
    if (!nuevoTodo.trim()) {
      alert('Escribe algo antes de agregar');
      return;
    }

    const nuevo = { titulo: nuevoTodo, completado: false };

    try {
      const res = await axios.post(API_URL, nuevo);
      setTodos([...todos, res.data]);
      setNuevoTodo('');
    } catch (err) {
      console.error('Error al agregar tarea:', err);
    }
  };

  const eliminarTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error al eliminar tarea:', err);
    }
  };

  const toggleCompleto = async (todo) => {
    try {
      const res = await axios.put(`${API_URL}/${todo.id}`, {
        ...todo,
        completado: !todo.completado
      });
      setTodos(todos.map(t => (t.id === res.data.id ? res.data : t)));
    } catch (err) {
      console.error('Error al cambiar estado:', err);
    }
  };

  const activarEdicion = (todo) => {
    setModoEdicion(true);
    setTodoEditado(todo);
  };

  const guardarEdicion = async () => {
    if (!todoEditado.titulo.trim()) {
      alert('El texto no puede estar vacío');
      return;
    }

    try {
      const res = await axios.put(`${API_URL}/${todoEditado.id}`, todoEditado);
      setTodos(todos.map(t => (t.id === res.data.id ? res.data : t)));
      setModoEdicion(false);
      setTodoEditado({ id: null, titulo: '' });
    } catch (err) {
      console.error('Error al guardar edición:', err);
    }
  };

  const todosFiltrados = todos.filter(todo => {
    if (filtro === 'completados') return todo.completado;
    if (filtro === 'pendientes') return !todo.completado;
    return true;
  });

  return (
    <div className="todos-container">
      <h2>Gestión de Tareas</h2>

      <form onSubmit={agregarTodo}>
        <input
          type="text"
          value={nuevoTodo}
          onChange={(e) => setNuevoTodo(e.target.value)}
          placeholder="Escribe una nueva tarea"
        />
        <button type="submit">Agregar</button>
      </form>

      {modoEdicion && (
        <div className="edicion-box">
          <input
            type="text"
            value={todoEditado.titulo}
            onChange={(e) =>
              setTodoEditado({ ...todoEditado, titulo: e.target.value })
            }
          />
          <button onClick={guardarEdicion}>Guardar</button>
          <button onClick={() => setModoEdicion(false)}>Cancelar</button>
        </div>
      )}

      <div className="filtros">
        <button onClick={() => setFiltro('todos')}>Todos</button>
        <button onClick={() => setFiltro('completados')}>Completados</button>
        <button onClick={() => setFiltro('pendientes')}>Pendientes</button>
      </div>

      {cargando ? (
        <p>Cargando tareas...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : todosFiltrados.length === 0 ? (
        <p>No hay tareas para mostrar</p>
      ) : (
        <ul>
          {todosFiltrados.map((todo) => (
            <li key={todo.id}>
              <input
                type="checkbox"
                checked={todo.completado}
                onChange={() => toggleCompleto(todo)}
              />
              <span
                style={{
                  textDecoration: todo.completado ? 'line-through' : 'none'
                }}
              >
                {todo.titulo}
              </span>
              <button onClick={() => activarEdicion(todo)}>Editar</button>
              <button onClick={() => eliminarTodo(todo.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Todos;


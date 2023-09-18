import React, { useState, useRef, useEffect } from 'react';
import './Todo.css';
import { IoMdDoneAll } from 'react-icons/io';
import { FiEdit } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Todo() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [editId, setEditID] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load todos from localStorage when the component mounts
    const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    setTodos(storedTodos);
  }, []);

  useEffect(() => {
    // Save todos to localStorage whenever todos change
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);


   useEffect(() => {
    // Determine if it's currently night or day
    const now = new Date();
    const hour = now.getHours();
    setDarkMode(hour >= 19 || hour < 7); // Night mode from 7 PM to 7 AM
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const addTodo = () => {
    if (todo.trim() !== '') {
      const todoLowerCase = todo.toLowerCase();
      const isDuplicate = todos.some(
        (item) => item.list.toLowerCase() === todoLowerCase
      );

      if (!isDuplicate) {
        if (editId) {
          const editTodo = todos.find((t) => t.id === editId);
          const updateTodo = todos.map((to) =>
            to.id === editTodo.id ? { id: to.id, list: todo } : { id: to.id, list: to.list }
          );
          setTodos(updateTodo);
          setEditID(0);
          setTodo('');
        } else {
          setTodos([...todos, { list: todo, id: Date.now(), status: false }]);
          setTodo('');
        }

        toast.success('Todo added successfully!');
      } else {
        toast.error('This todo already exists.');
      }
    } else {
      toast.error('Please enter a non-empty todo.');
    }
  };

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

 const onDelete = (id) => {
  try{
    const updatedTodos = todos.filter((to)=> to.id !== id);
    setTodos(updatedTodos);
    setEditID(0);
    setTodo('');
    toast.success('Todo deleted successfully!')

  }catch(error){
    toast.error('An error occured while deleting the todo')
  }
 }
  const onComplete = (id) => {
    try{
  const complete = todos.map((list) => {
      if (list.id === id) {
        return { ...list, status: !list.status };
      }
      return list;
    });
    setTodos(complete);
toast.success('Succefully finished  todo')
  }catch(error){
    toast.error("Couldn't finish todo")
  }
  };
    
  

  const onEdit = (id) => {
  try {
    const editTodo = todos.find((to) => to.id === id);
    setTodo(editTodo.list);
    setEditID(editTodo.id);
    toast.info('Editing todo...');
  } catch (error) {
    
    toast.error('An error occurred while editing the todo.');
  }
};


  const resetTodo = () => {
    try{
    setEditID(0);
    setTodo('');
    setTodos([]);
    toast.success('Reset todo successfull')
    }catch(error){
      toast.error("Couldn't reset the todo")
    }
   
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  

  return (
    <div className={`container ${darkMode ? 'dark' : ''}`}>
      <div className="dark-mode-toggle">
        <label className="switch">
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
          <span className="slider round"></span>
        </label>
        <span className="model-label">
          {darkMode ? 'Dark Mode' : 'Light Mode'}
        </span>
      </div>
      <h2 className={`button ${darkMode ? 'dark' : ''}`}>TODO APP</h2>
      <form
        className={`form-group ${darkMode ? 'dark' : ''}`}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={todo}
          ref={inputRef}
          placeholder="Enter Your Todo"
          className={`form-control ${darkMode ? 'dark' : ''}`}
          onChange={(event) => setTodo(event.target.value)}
        />
        <button onClick={addTodo} className={`button ${darkMode ? 'dark' : ''}`}>
          {editId ? 'EDIT' : 'ADD'}
        </button>
        <button onClick={resetTodo} className={`button ${darkMode ? 'dark' : ''}`}>
          RESET
        </button>
      </form>
      <div className={`list ${darkMode ? 'dark' : ''}`}>
        <ul>
          {todos.map((to) => (
            <li className="list-items" key={to.id}>
              <div className="list-items-list" id={to.status ? 'list-item' : ''}>
                {to.list}
              </div>
              <span>
                <IoMdDoneAll
                  className="list-items-icons"
                  id="complete"
                  title="complete"
                  onClick={() => onComplete(to.id)}
                />
                <FiEdit
                  className="list-items-icons"
                  id="edit"
                  title="Edit"
                  onClick={() => onEdit(to.id)}
                />
                <MdDelete
                  className="list-item-icons"
                  id="delete"
                  title="Delete"
                  onClick={() => onDelete(to.id)}
                />
              </span>
            </li>
          ))}
        </ul>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

export default Todo;

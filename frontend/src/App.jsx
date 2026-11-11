
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import Carrito from './components/Carrito';
import React, { useState, useEffect } from 'react';

function App() {
  const [carrito, setCarrito] = useState(() => {
    try {
      const guardado = localStorage.getItem('carrito');
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (book) => {
    setCarrito(actual => {
      const existe = actual.find(item => item.id === book.id);

      if (!existe) {
        return [...actual, { ...book, cantidad: 1 }];
      }

      return actual.map(item =>
        item.id === book.id && item.cantidad < book.stock
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(actual => actual.filter(item => item.id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  return (
    <Router>
      <div>
        <h1>Compra tu libro!</h1>
        <Link to="/carrito">
          🛒 Carrito ({carrito.reduce((total, item) => total + item.cantidad, 0)})
        </Link>
        <Routes>
          <Route path="/" element={<BookList carrito={carrito} agregarAlCarrito={agregarAlCarrito} />} />
          <Route path="/add" element={<BookForm />} />
          <Route path="/edit/:id" element={<BookForm />} />
          <Route path="/carrito" element={<Carrito carrito={carrito} eliminarDelCarrito={eliminarDelCarrito} vaciarCarrito={vaciarCarrito} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
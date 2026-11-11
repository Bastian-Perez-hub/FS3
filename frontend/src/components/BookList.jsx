import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookService from '../services/BookService';

const BookList = ({ carrito, agregarAlCarrito }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    BookService.getAllBooks()
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        console.log('Error fetching books:', error);
      });
  };

  const deleteBook = (id) => {
    BookService.deleteBook(id)
      .then(() => {
        fetchBooks();
      })
      .catch(error => {
        console.log('Error deleting book:', error);
      });
  };

  return (
    <div>
      <h2>Lista de Libros</h2>
      <Link to="/add">Agrega Nuevo Libro</Link>
      <table>
        <thead>
          <tr>
            <th>Titulo</th>
            <th>Autor</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Comprar</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => {
            const enCarrito = carrito.find(item => item.id === book.id)?.cantidad ?? 0;
            const sinStock = book.stock <= 0 || enCarrito >= book.stock;

            return (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>${book.price?.toLocaleString('es-CL')}</td>
                <td>{book.stock}</td>
                <td>
                  <button
                    className="comprar"
                    disabled={sinStock}
                    onClick={() => agregarAlCarrito(book)}
                  >
                    Comprar
                  </button>
                </td>
                <td>
                  <Link to={`/edit/${book.id}`}>Edit</Link>
                  <button onClick={() => deleteBook(book.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookService from '../services/BookService';

const BookList = () => {
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
      <h2>Book List</h2>
      <Link to="/add">Add New Book</Link>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>
                <Link to={`/edit/${book.id}`}>Edit</Link>
                <button onClick={() => deleteBook(book.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;
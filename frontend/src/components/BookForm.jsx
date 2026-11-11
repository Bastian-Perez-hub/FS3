import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookService from '../services/BookService';

const BookForm = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      BookService.getBookById(id).then(response => {
        setTitle(response.data.title);
        setAuthor(response.data.author);
      });
    }
  }, [id]);

  const saveOrUpdateBook = (e) => {
    e.preventDefault();
    const book = { title, author };

    if (id) {
      BookService.updateBook(id, book).then(() => {
        navigate('/');
      });
    } else {
      BookService.createBook(book).then(() => {
        navigate('/');
      });
    }
  };

  return (
    <div>
      <h2>{id ? 'Edit Book' : 'Add Book'}</h2>
      <form onSubmit={saveOrUpdateBook}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Author:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <button type="submit">{id ? 'Update' : 'Save'}</button>
      </form>
    </div>
  );
};

export default BookForm;
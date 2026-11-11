import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookService from '../services/BookService';

const BookForm = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    if (id) {
      BookService.getBookById(id).then(response => {
        setTitle(response.data.title);
        setAuthor(response.data.author);
        setPrice(response.data.price);
        setStock(response.data.stock);
      });
    }
  }, [id]);

  const saveOrUpdateBook = (e) => {
    e.preventDefault();
    const book = { title, author, price: Number(price), stock: Number(stock) };

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
      <h2>{id ? 'Editar libro' : 'Agrega un nuevo libro'}</h2>
      <form onSubmit={saveOrUpdateBook}>
        <div>
          <label>Titulo:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Autor:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div>
        <label>Precio:</label>
        <input type="number" min="0" value={price}
          onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
        <label>Stock:</label>
        <input type="number" min="0" value={stock}
          onChange={(e) => setStock(e.target.value)} required />
        </div>
        <button type="submit">{id ? 'Actualizar' : 'Guardar'}</button>
      </form>
    </div>
  );
};

export default BookForm;
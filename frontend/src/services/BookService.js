import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/books';

class BookService {
  getAllBooks() {
    return axios.get(BASE_URL);
  }

  getBookById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }

  createBook(book) {
    return axios.post(BASE_URL, book);
  }

  updateBook(id, book) {
    return axios.put(`${BASE_URL}/${id}`, book);
  }

  deleteBook(id) {
    return axios.delete(`${BASE_URL}/${id}`);
  }
}

export default new BookService();
package ecomerce.demo.controller;

import ecomerce.demo.model.Book;
import ecomerce.demo.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@Tag(name = "Book Management System")
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping
    @Operation(summary = "View a list of available books")
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a book by Id")
    public Book getBookById(@PathVariable Long id) {
        return bookService.getBookById(id);
    }

    @PostMapping
    @Operation(summary = "Add a new book")
    public Book createBook(@RequestBody Book book) {
        return bookService.saveBook(book);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing book")
    public Book updateBook(@PathVariable Long id, @RequestBody Book book) {
        Book existingBook = bookService.getBookById(id);
        if (existingBook != null) {
            existingBook.setTitle(book.getTitle());
            existingBook.setAuthor(book.getAuthor());
            existingBook.setPrice(book.getPrice());
            existingBook.setStock(book.getStock());
            return bookService.saveBook(existingBook);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a book")
    public void deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
    }
}
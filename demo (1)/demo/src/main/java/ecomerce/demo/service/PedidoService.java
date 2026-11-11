package ecomerce.demo.service;

import ecomerce.demo.dto.PedidoRequest;
import ecomerce.demo.model.Book;
import ecomerce.demo.model.DetallePedido;
import ecomerce.demo.model.Pedido;
import ecomerce.demo.repository.BookRepository;
import ecomerce.demo.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private BookRepository bookRepository;

    @Transactional
    public Pedido crearPedido(PedidoRequest request) {

        // 1. Validar que venga algo
        if (request == null || request.items() == null || request.items().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El carrito está vacío");
        }

        Pedido pedido = new Pedido();
        pedido.setFecha(LocalDateTime.now());
        pedido.setEstado("CONFIRMADO");

        int total = 0;

        for (PedidoRequest.Item item : request.items()) {

            // 2. Validar la cantidad
            if (item.cantidad() == null || item.cantidad() <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cantidad inválida");
            }

            // 3. Buscar el libro (con bloqueo) y validar que exista
            Book book = bookRepository.findByIdForUpdate(item.bookId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "El libro " + item.bookId() + " no existe"));

            // 4. Validar stock
            if (book.getStock() == null || book.getStock() < item.cantidad()) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT, "Stock insuficiente para: " + book.getTitle());
            }

            // 5. Descontar stock
            book.setStock(book.getStock() - item.cantidad());
            bookRepository.save(book);

            // 6. Crear el detalle con el precio REAL del backend
            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedido);
            detalle.setBook(book);
            detalle.setCantidad(item.cantidad());
            detalle.setPrecioUnitario(book.getPrice());
            pedido.getDetalles().add(detalle);

            total += book.getPrice() * item.cantidad();
        }

        // 7. El total lo calcula el backend
        pedido.setTotal(total);
        return pedidoRepository.save(pedido);
    }
}
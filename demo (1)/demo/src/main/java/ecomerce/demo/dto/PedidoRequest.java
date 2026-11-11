package ecomerce.demo.dto;

import java.util.List;

public record PedidoRequest(List<Item> items) {

    public record Item(Long bookId, Integer cantidad) {}
}
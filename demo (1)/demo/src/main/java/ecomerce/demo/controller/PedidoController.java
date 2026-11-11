package ecomerce.demo.controller;

import ecomerce.demo.dto.PedidoRequest;
import ecomerce.demo.dto.PedidoResponse;
import ecomerce.demo.model.Pedido;
import ecomerce.demo.service.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pedidos")
@Tag(name = "Pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear un pedido a partir del carrito")
    public PedidoResponse crearPedido(@RequestBody PedidoRequest request) {
        Pedido pedido = pedidoService.crearPedido(request);
        return new PedidoResponse(pedido.getId(), pedido.getTotal(), pedido.getEstado());
    }
}
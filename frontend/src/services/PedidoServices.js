import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/pedidos';

class PedidoService {
  crearPedido(pedido) {
    return axios.post(BASE_URL, pedido);
  }
}

export default new PedidoService();
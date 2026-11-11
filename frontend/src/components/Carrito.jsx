import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PedidoService from '../services/PedidoServices';

const Carrito = ({ carrito, eliminarDelCarrito, vaciarCarrito }) => {
  const [procesando, setProcesando] = useState(false);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);
  const [error, setError] = useState('');

  const total = carrito.reduce((suma, item) => suma + item.price * item.cantidad, 0);

  const confirmarCompra = () => {
    setProcesando(true);
    setError('');
    setPedidoConfirmado(null);

    // Solo se envían IDs y cantidades; el total lo calcula el backend
    const pedido = {
      items: carrito.map(item => ({ bookId: item.id, cantidad: item.cantidad }))
    };

    PedidoService.crearPedido(pedido)
      .then(response => {
        setPedidoConfirmado(response.data);
        vaciarCarrito();
      })
      .catch(err => {
        const mensaje = err.response?.data?.message;
        if (err.response?.status === 409) {
          setError(mensaje || 'No hay stock suficiente para algún libro.');
        } else if (err.response?.status === 400) {
          setError(mensaje || 'El pedido no es válido.');
        } else {
          setError('No se pudo conectar con el servidor. Intenta de nuevo.');
        }
      })
      .finally(() => setProcesando(false));
  };

  return (
    <div>
      <h2>Mi carrito</h2>
      <Link to="/">Seguir comprando</Link>

      {pedidoConfirmado && (
        <p>
          ✅ ¡Compra confirmada! Pedido N° {pedidoConfirmado.id} — Total: $
          {pedidoConfirmado.total.toLocaleString('es-CL')}
        </p>
      )}

      {error && <p>❌ {error}</p>}

      {carrito.length === 0 ? (
        !pedidoConfirmado && <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Libro</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {carrito.map(item => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>${item.price.toLocaleString('es-CL')}</td>
                  <td>{item.cantidad}</td>
                  <td>${(item.price * item.cantidad).toLocaleString('es-CL')}</td>
                  <td>
                    <button onClick={() => eliminarDelCarrito(item.id)} disabled={procesando}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Total: ${total.toLocaleString('es-CL')}</h2>

          <button className="confirmar" onClick={confirmarCompra} disabled={procesando}>
            {procesando ? 'Procesando…' : 'Confirmar compra'}
          </button>
        </>
      )}
    </div>
  );
};

export default Carrito;
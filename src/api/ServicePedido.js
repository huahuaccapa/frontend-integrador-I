import axios from "axios";

// URL base del controlador de pedidos
const PEDIDO_BASE_REST_API_URL = "http://localhost:8080/api/v1/pedidos";

class ServicePedido {

    // 1. Obtener todos los pedidos
    getAllPedidos() {
        return axios.get(PEDIDO_BASE_REST_API_URL);
    }

    // 2. Crear nuevo pedido
    createPedido(pedido) {
        return axios.post(PEDIDO_BASE_REST_API_URL, pedido);
    }

    // 3. Obtener un pedido por ID
    getPedidoById(id) {
        return axios.get(`${PEDIDO_BASE_REST_API_URL}/${id}`);
    }

    // 4. Actualizar un pedido existente
    updatePedido(id, pedido) {
        return axios.put(`${PEDIDO_BASE_REST_API_URL}/${id}`, pedido);
    }

    // 5. Eliminar un pedido
    deletePedido(id) {
        return axios.delete(`${PEDIDO_BASE_REST_API_URL}/${id}`);
    }

    // 6. Obtener pedidos por ID de proveedor
    getPedidosPorProveedor(proveedorId) {
        return axios.get(`${PEDIDO_BASE_REST_API_URL}/proveedor/${proveedorId}`);
    }

    // 7. Obtener pedidos por estado
    getPedidosPorEstado(estado) {
        return axios.get(`${PEDIDO_BASE_REST_API_URL}/estado/${estado}`);
    }

    // 8. Actualizar estado de un pedido
    updateEstadoPedido(pedidoId, nuevoEstado) {
        return axios.put(`${PEDIDO_BASE_REST_API_URL}/${pedidoId}/estado`, {
            estado: nuevoEstado
        });
    }

    // 9. Obtener el valor total de los pedidos
    getValorTotalPedidos() {
        return axios.get(`${PEDIDO_BASE_REST_API_URL}/valor-total`);
    }


}

export default new ServicePedido();
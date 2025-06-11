    import axios from "axios";

    const DETALLE_PEDIDO_BASE_REST_API_URL = "http://localhost:8080/api/v1/detalles-pedidos";

    class ServiceDetallePedido {
        // Obtener todos los detalles
        getAllDetalles() {
            return axios.get(DETALLE_PEDIDO_BASE_REST_API_URL);
        }

        // Obtener detalle por ID
        getDetalleById(id) {
            return axios.get(`${DETALLE_PEDIDO_BASE_REST_API_URL}/${id}`);
        }

        // Crear nuevo detalle
        createDetalle(detalle) {
            return axios.post(DETALLE_PEDIDO_BASE_REST_API_URL, detalle);
        }

        // Actualizar detalle
        updateDetalle(id, detalle) {
            return axios.put(`${DETALLE_PEDIDO_BASE_REST_API_URL}/${id}`, detalle);
        }

        // Eliminar detalle
        deleteDetalle(id) {
            return axios.delete(`${DETALLE_PEDIDO_BASE_REST_API_URL}/${id}`);
        }

        getDetallesByPedidoId(pedidoId) {
        return axios.get(`${DETALLE_PEDIDO_BASE_REST_API_URL}/pedido/${pedidoId}`);
    }
    }

    export default new ServiceDetallePedido();
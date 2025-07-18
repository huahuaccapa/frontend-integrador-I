import axios from "axios";

const VENTA_BASE_REST_API_URL = "http://localhost:8080/api/ventas";

class VentaService {
  // 1. Obtener todas las ventas
  getAllVentas() {
    return axios.get(VENTA_BASE_REST_API_URL);
  }

  // 2. Agregar una nueva venta
  crearVenta(venta) {
    return axios.post(VENTA_BASE_REST_API_URL, venta);
  }

  getTotalVentas() {
    return axios.get(`${VENTA_BASE_REST_API_URL}/total-ventas`);
  }

}

export default new VentaService();
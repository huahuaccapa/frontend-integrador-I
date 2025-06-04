import axios from "axios";

const VENTA_BASE_REST_API_URL = "http://localhost:8080/api/ventas";

class VentaService {
  // 1. Obtener todas las ventas
  getAllVentas() {
    return axios.get(VENTA_BASE_REST_API_URL);
  }

  // 2. Agregar una nueva venta
  crearVenta(ventaData) {
    return axios.post(VENTA_BASE_REST_API_URL, ventaData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}

export default new VentaService();
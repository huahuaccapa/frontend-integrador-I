import axios from "axios";

const VENTA_BASE_REST_API_URL = "https://multiservicios-85dff762daa1.herokuapp.com/api/ventas";

class VentaService {
  // 1. Obtener todas las ventas
  getAllVentas() {
    return axios.get(VENTA_BASE_REST_API_URL);
  }

  // 2. Agregar una nueva venta
  crearVenta(venta) {
    return axios.post(VENTA_BASE_REST_API_URL, venta);
  }
}

export default new VentaService();
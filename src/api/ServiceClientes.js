import axios from "axios";

const CLIENTE_BASE_REST_API_URL = "https://multiservicios-85dff762daa1.herokuapp.com/api/clientes";

class ClienteService {
  // 1. Obtener todos los clientes
  getAllClientes() {
    return axios.get(CLIENTE_BASE_REST_API_URL);
  }

  // 2. Crear un nuevo cliente
  crearCliente(cliente) {
    return axios.post(CLIENTE_BASE_REST_API_URL, cliente);
  }

  // 3. Actualizar un cliente existente
  actualizarCliente(id, clienteActualizado) {
    return axios.put(`${CLIENTE_BASE_REST_API_URL}/${id}`, clienteActualizado);
  }

  // 4. Eliminar un cliente
  eliminarCliente(id) {
    return axios.delete(`${CLIENTE_BASE_REST_API_URL}/${id}`);
  }

  // 5. Contar total de clientes
  contarClientes() {
    return axios.get(`${CLIENTE_BASE_REST_API_URL}/total`);
  }
}

export default new ClienteService();

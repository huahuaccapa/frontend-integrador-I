import axios from "axios";
const PROVEEDOR_BASE_REST_API_URL = "https://multiservicios-85dff762daa1.herokuapp.com/api/v1/proveedores";

class ProveedoresService {
    
    // 1. Obtener todos los proveedores
    getAllProveedores() {
        return axios.get(PROVEEDOR_BASE_REST_API_URL);
    }

    // 2. Crear nuevo proveedor
    createProveedor(proveedor) {
        return axios.post(PROVEEDOR_BASE_REST_API_URL, proveedor);
    }

    // 3. Obtener proveedor por ID
    getProveedorById(id) {
        return axios.get(`${PROVEEDOR_BASE_REST_API_URL}/${id}`);
    }

    // 4. Actualizar proveedor
    updateProveedor(id, proveedor) {
        return axios.put(`${PROVEEDOR_BASE_REST_API_URL}/${id}`, proveedor);
    }

    // 5. Eliminar proveedor
    deleteProveedor(id) {
        return axios.delete(`${PROVEEDOR_BASE_REST_API_URL}/${id}`);
    }

}

export default new ProveedoresService();
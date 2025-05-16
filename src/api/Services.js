import axios from "axios";

const PRODUCTO_BASE_REST_API_URL = "http://localhost:8080/api/v1/productos";

class Services {
  // 1. Obtener todos los productos
  getAllProductos() {
    return axios.get(PRODUCTO_BASE_REST_API_URL);
  }

  // 2. Agregar un nuevo producto
  crearProducto(producto) {
    return axios.post(PRODUCTO_BASE_REST_API_URL, producto);
  }

  // 3. Editar un producto existente
  actualizarProducto(id, productoActualizado) {
    return axios.put(`${PRODUCTO_BASE_REST_API_URL}/${id}`, productoActualizado);
  }

  // 4. Eliminar un producto
  eliminarProducto(id) {
    return axios.delete(`${PRODUCTO_BASE_REST_API_URL}/${id}`);
  }
}

export default new Services();
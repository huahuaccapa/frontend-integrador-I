import axios from "axios";
const API_BASE_URL = "http://localhost:8080/api/reportes";

class ServiceReporte {
    
    // Obtener reporte de clientes
    getReporteClientes() {
        return axios.get(`${API_BASE_URL}/clientes`);
    }

    // Obtener reporte de ventas (opcional)
    getReporteInventario(fechaInicio, fechaFin) {
    return axios.get(`${API_BASE_URL}/inventario`, {
        params: {
            fechaInicio: fechaInicio ? format(fechaInicio, "dd/MM/yyyy") : undefined,
            fechaFin: fechaFin ? format(fechaFin, "dd/MM/yyyy") : undefined
        }
    });
}

    // Obtener reporte de inventario (opcional)
    getReporteInventario(fechaInicio, fechaFin) {
        return axios.get(`${API_BASE_URL}/inventario`, {
            params: {
                fechaInicio: fechaInicio?.toISOString(),
                fechaFin: fechaFin?.toISOString()
            }
        });
    }

    // Obtener los 5 productos más vendidos
    getTopProductosVendidos() {
        return axios.get(`${API_BASE_URL}/top-productos`);
    }

}

export default new ServiceReporte();
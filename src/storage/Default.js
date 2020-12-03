import {Historial} from '../classes/Historial.js';
import {Entidad} from '../classes/Entidad.js';
import {Transaccion} from '../classes/Transaccion.js';

class Default{
  constructor(historial = new Historial(), entidades = [], productos = [], config = []){
    this.historial = historial;
    this.entidades = entidades;
    this.productos = productos;
    this.config = config;
  }
  
  getHistorial(){
    return this.historial;
  }
  
  getEntidades(){
    return this.entidades;
  }
  
  getProductos(){
    return this.productos;
  }
  
  getConfig(){
    return this.config;
  }
  
  setHistorial(historial){
    this.historial = historial;
  }
  
  setEntidades(entidades){
    this.entidades = entidades;
  }
  
  setProductos(productos){
    this.productos = productos;
  }
  
  setConfig(config){
    this.config = config;
  }
  
  /*FUNCIONES ENTIDADES*/
  transaccionesEntidad(codigo, tipo){
    let entidad = this.buscarEntidad(codigo, tipo);
    let transacciones = [];
    
    let tiposTransacciones = (tipo == Entidad.CLIENTE) ? [Transaccion.VENTA,Transaccion.DEVOLUCION_VENTA] : [Transaccion.DEVOLUCION_COMPRA,Transaccion.COMPRA, Transaccion.INVENTARIO_INICIAL];
    
    if(entidad != null){
      let datos = this.historial.exportarDatos();
      transacciones = datos.filter(transaccion => transaccion.getEntidad() == codigo && tiposTransacciones.includes(transaccion.getTipoTransaccion()));
    }
    return transacciones;
  }
  
  existeEntidad(codigo, tipo){
    let entidadesTipo = this.entidades.filter(entidad => entidad.getTipo() == tipo);
    let busqueda = this.entidadesTipo.filter(entidad => entidad.getCodigo() == codigo);
    return (busqueda.length > 0);
  }
  
  buscarEntidad(codigo, tipo){
    let entidadesTipo = this.entidades.filter(entidad => entidad.getTipo() == tipo);
    let busqueda = entidadesTipo.filter(entidad => entidad.getCodigo() == codigo);
    return (busqueda.length > 0) ? busqueda[0] : null;
  }
  
  eliminarEntidad(codigo, tipo){
    let entidadBusqueda = this.buscarEntidad(codigo, tipo);
    if(entidadBusqueda != null){
      let entidad = (entidadBusqueda.getTipo() == Entidad.CLIENTE) ? 'CLIENTE' : 'PROVEEDOR';
      let entidadesRestantes = this.entidades.filter(entidad => entidad.getCodigo() != codigo);
      this.setEntidades(entidadesRestantes);
      
      //eliminar transacciones del historial
      
      this.eliminarTransacciones(codigo, entidad);
    }
  }
  /*FIN FUNCIONES ENTIDADES*/
  
  /*FUNCIONES PRODUCTOS*/
  existeProducto(codigo){
    let busqueda = this.productos.filter(producto => producto.getCodigo() == codigo);
    return (busqueda.length > 0);
  }
  
  buscarProducto(codigo){
    let busqueda = this.productos.filter(producto => producto.getCodigo() == codigo);
    return (busqueda.length > 0) ? busqueda[0] : null;
  }
  
  eliminarProducto(codigo){
    if(this.buscarProducto(codigo) != null){
      let productosRestantes = this.productos.filter(producto => producto.getCodigo() != codigo);
      this.setProductos(productosRestantes);
      
      //eliminar transacciones del historial
      
      this.eliminarTransacciones(codigo, 'PRODUCTO');
    }
  }
  /*FIN FUNCIONES PRODUCTOS*/
  
  /*FUNCIONES TRANSACCIONES*/
  buscarTransacciones(codigoProducto, tipoTransaccion){
    if(this.buscarProducto(codigoProducto) != null){
      switch (tipoTransaccion) {
        case Transaccion.INVENTARIO_INICIAL:
          let transaccionesTotales = this.historial.consultarIniciales();
          let transaccionesProducto = transaccionesTotales.filter(transaccion => transaccion.getCodigoProducto() == codigoProducto);
          return transaccionesProducto;
      }
      
      return [];
    }
  }
  
  eliminarTransacciones(codigo, unidad){
    let iniciales = this.historial.iniciales;
    let compras = this.historial.compras;
    let ventas = this.historial.ventas;
    let devolucionesVentas = this.historial.devolucionesVentas;
    let devolucionesCompras = this.historial.devolucionesCompras;
    
    switch (unidad) {
      case 'PRODUCTO':
        iniciales = this.historial.iniciales.filter(transaccion => transaccion.getCodigoProducto() != codigo);
        compras = this.historial.compras.filter(transaccion => transaccion.getCodigoProducto() != codigo);
        ventas = this.historial.ventas.filter(transaccion => transaccion.getCodigoProducto() != codigo);
        devolucionesCompras = this.historial.devolucionesCompras.filter(transaccion => transaccion.getCodigoProducto() != codigo);
        devolucionesVentas = this.historial.devolucionesVentas.filter(transaccion => transaccion.getCodigoProducto() != codigo);
        break;
      
      case 'CLIENTE':
        ventas = this.historial.ventas.filter(transaccion => transaccion.getEntidad() != codigo);
        devolucionesVentas = this.historial.devolucionesVentas.filter(transaccion => transaccion.getEntidad() != codigo);
        break;
        
      case 'PROVEEDOR':
        iniciales = this.historial.iniciales.filter(transaccion => transaccion.getEntidad() != codigo);
        compras = this.historial.compras.filter(transaccion => transaccion.getEntidad() != codigo);
        devolucionesCompras = this.historial.devolucionesCompras.filter(transaccion => transaccion.getEntidad() != codigo);
        break;
    }
    
    this.historial.setIniciales(iniciales);
    this.historial.setCompras(compras);
    this.historial.setVentas(ventas);
    this.historial.setDevolucionesVentas(devolucionesVentas);
    this.historial.setDevolucionesCompras(devolucionesCompras);
  }
}

export {Default};
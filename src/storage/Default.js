import {Historial} from '../classes/Historial.js';

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
  /*FIN FUNCIONES ENTIDADES*/
}

export {Default};
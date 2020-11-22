import {Datos} from './abstract/Datos.js';
import {Transaccion} from './Transaccion.js';

class Historial extends Datos{
  constructor(iniciales = [], ventas = [], compras = [], devolucionesCompras = [], devolucionesVentas = []){
    super();
    this.iniciales = iniciales;
    this.ventas = ventas;
    this.compras = compras;
    this.devolucionesCompras = devolucionesCompras;
    this.devolucionesVentas = devolucionesVentas;
  }
  
  importarDatos(datos){
    this.iniciales = datos.filter(transaccion => transaccion.getTipo() == Transaccion.INVENTARIO_INICIAL);
    this.ventas = datos.filter(transaccion => transaccion.getTipo() == Transaccion.VENTA);
    this.compras = datos.filter(transaccion => transaccion.getTipo() == Transaccion.COMPRA);
    this.devolucionesCompras = datos.filter(transaccion => transaccion.getTipo() == Transaccion.DEVOLUCION_COMPRA);
    this.devolucionesVentas = datos.filter(transaccion => transaccion.getTipo() == Transaccion.DEVOLUCION_VENTA);
  }
  
  agregarInicial(inicial){
    inicial.setTipoTransaccion(Transaccion.INVENTARIO_INICIAL);
    this.iniciales.push(inicial);
  }
  
  agregarVenta(venta){
    venta.setTipoTransaccion(Transaccion.VENTA);
    this.ventas.push(venta);
  }
  
  agregarCompra(compra){
    compra.setTipoTransaccion(Transaccion.COMPRA);
    this.compras.push(compra);
  }
  
  agregarDevolucionCompra(devolucion){
    devolucion.setTipoTransaccion(Transaccion.DEVOLUCION_COMPRA);
    this.devolucionesCompras.push(devolucion);
  }
  
  agregarDevolucionVenta(devolucion){
    devolucion.setTipoTransaccion(Transaccion.DEVOLUCION_VENTA);
    this.devolucionesVentas.push(devolucion);
  }
  
  consultarIniciales(){
    return this.ordenarPorFecha(this.iniciales);
  }
  
  consultarVentas(){
    return this.ordenarPorFecha(this.ventas);
  }
  
  consultarCompras(){
    return this.ordenarPorFecha(this.compras);
  }
  
  consultarDevolucionesVentas(){
    return this.ordenarPorFecha(this.devolucionesVentas);
  }
  
  consultarDevolucionesCompras(){
    return this.ordenarPorFecha(this.devolucionesCompras);
  }
  
  exportarDatos(){
    let conjunto = this.unificarDatos([this.iniciales, this.ventas, this.compras, this.devolucionesCompras, this.devolucionesVentas]);
    return this.ordenarPorFecha(conjunto);
  }
}

export {Historial};
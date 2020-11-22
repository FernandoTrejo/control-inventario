import {Money} from './Money.js';

class Transaccion{
  constructor(fechaString, fechaDate, detalle, cantidad, montoUnitario, codigoProducto, entidad = null){
    this.tipoTransaccion = -1;
    this.fechaString = fechaString;
    this.fechaDate = fechaDate;
    this.detalle = detalle;
    this.cantidad = cantidad;
    this.montoUnitario = montoUnitario;
    this.codigoProducto = codigoProducto;
    this.entidad = entidad; // proveedor / cliente
  }
  
  //GETTERS
  getTipoTransaccion(){
    return this.tipoTransaccion;
  }
  
  getFecha(){
    return this.fechaDate;
  }
  
  fechaToString(){
    return this.fechaString;
  }
  
  getDetalle(){
    return this.detalle;
  }
  
  getCantidad(){
    return this.cantidad;
  }
  
  getMontoUnitario(){
    return this.montoUnitario;
  }
  
  getCodigoProducto(){
    return this.codigoProducto;
  }
  
  getEntidad(){
    return this.entidad;
  }
  
  getMontoTotal(){
    return Money.multiply([this.cantidad, this.montoUnitario.quantity]);
  }
  
  //SETTERS
  setTipoTransaccion(tipoTransaccion){
    this.tipoTransaccion = tipoTransaccion;
  }
  
  setFecha(fechaDate){
    this.fechaDate = fechaDate;
  }
  
  setFechaString(fechaString){
    this.fechaString = fechaString;
  }
  
  setDetalle(detalle){
    this.detalle = detalle;
  }
  
  setCantidad(cantidad){
    this.cantidad = cantidad;
  }
  
  setMontoUnitario(montoUnitario){
    this.montoUnitario = montoUnitario;
  }
  
  setCodigoProducto(codigoProducto){
    this.codigoProducto = codigoProducto;
  }
  
  setEntidad(entidad){
    this.entidad = entidad;
  }
  
  static get COMPRA(){
    return 0;
  }
  
  static get VENTA(){
    return 1;
  }
  
  static get DEVOLUCION_COMPRA(){
    return 2;
  }
  
  static get DEVOLUCION_VENTA(){
    return 3;
  }
  
  static get INVENTARIO_INICIAL(){
    return 4;
  }
}

export {Transaccion};
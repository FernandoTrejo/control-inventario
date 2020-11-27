import {Money} from './Money.js';

class Transaccion{
  constructor(fechaString, fechaDate, detalle, cantidad, montoUnitario, codigoProducto, entidad = null, tipoTransaccion = -1){
    this.tipoTransaccion = tipoTransaccion;
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
  
  getTipoTransaccionString(){
    switch (this.tipoTransaccion) {
      case Transaccion.INVENTARIO_INICIAL:
        return "INVENTARIO INICIAL"
      
      case Transaccion.COMPRA:
        return "COMPRA";
        
      case Transaccion.VENTA:
        return "VENTA";
        
      case Transaccion.DEVOLUCION_COMPRA:
        return "DEVOLUCION SOBRE COMPRA";
        
      case Transaccion.DEVOLUCION_VENTA:
        return "DEVOLUCION SOBRE VENTA";
    }
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
  
  static fromArray(data){
    return new Transaccion(
      data[0],
      new Date(data[0]),
      data[1],
      data[2],
      new Money(data[3]),
      data[4],
      data[5]
    );
  }
  
  copyFromObject(transaccion){
    this.fechaString = transaccion.fechaToString();
    this.fechaDate = transaccion.getFecha(); 
    this.detalle = transaccion.getDetalle();
    this.cantidad = transaccion.getCantidad();
    this.montoUnitario = transaccion.getMontoUnitario();
    this.codigoProducto = transaccion.getCodigoProducto();
    this.entidad = transaccion.getEntidad();
  }
  
  toArray(){
    let entidad = this.obtenerEntidad(this.tipoTransaccion);
    let montoTotal = this.getMontoTotal();
    
    return [
      ['Fecha', this.fechaString],
      ['Detalle', this.detalle],
      ['Cantidad', this.cantidad],
      ['Monto Unitario', this.montoUnitario.toString()],
      ['Total', montoTotal.toString()],
      ['Producto', this.codigoProducto],
      [entidad, this.entidad]
    ];
  }
  
  fieldsToArray(){
    return [
      this.fechaString,
      this.detalle,
      this.cantidad,
      this.montoUnitario.quantity,
      this.codigoProducto,
      this.entidad
    ];
  }
  
  obtenerEntidad(tipo){
    switch (tipo) {
      case Transaccion.INVENTARIO_INICIAL:
        return 'Proveedor';
      
      case Transaccion.COMPRA:
        return 'Proveedor';
        
      case Transaccion.VENTA:
        return 'Cliente';
        
      case Transaccion.DEVOLUCION_COMPRA:
        return 'Proveedor';
        
      case Transaccion.DEVOLUCION_VENTA:
        return 'Cliente';
    }
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
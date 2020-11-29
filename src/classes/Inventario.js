import {PEPS, PROMEDIO} from './Valuacion.js';
import {Money} from './Money.js';

class Inventario{
  constructor(codigoProducto, historial, metodoValuacion){
    this.codigoProducto = codigoProducto;
    this.transacciones = this.extraerTransacciones(historial);
    this.metodoValuacion = metodoValuacion;
    
    this.datos = [];
    
    this.inicial = 0;
    this.compras = 0;
    this.costoCompras = null;
    this.ventas = 0;
    this.costoVentas = null;
    this.devolucionesVentas = 0;
    this.costoDevolucionVentas = null;
    this.devolucionesCompras = 0;
    this.costoDevolucionCompras = null;
    this.precioPromedio = null;
    
    this.procesarDatos();
  }
  
  //GETTERS
  getCodigoProducto(){
    return this.codigoProducto;
  }
  
  getTransacciones(){
    return this.transacciones;
  }
  
  getMetodoValuacion(){
    return this.metodoValuacion;
  }
  
  getDatos(){
    return this.datos;
  }
  
  getInicial(){
    return this.inicial;
  }
  
  getCompras(){
    return this.compras;
  }
  
  getVentas(){
    return this.ventas;
  }
  
  getDevolucionesVentas(){
    return this.devolucionesVentas;
  }
  
  getDevolucionesCompras(){
    return this.devolucionesCompras;
  }
  
  getEntradas(){
    return Number(this.inicial) + Number(this.compras) - Number(this.devolucionesCompras);
  }
  
  getSalidas(){
    return Number(this.ventas) - Number(this.devolucionesVentas);
  }
  
  getExistencias(){
    return Number(this.getEntradas()) - Number(this.getSalidas());
  }
  
  getCostoInicial(){
    return this.costoInicial;
  }
  
  getCostoCompras(){
    return this.costoCompras;
  }
  
  getCostoVentas(){
    return this.costoVentas;
  }
  
  getCostoDevolucionesCompras(){
    return this.costoDevolucionCompras;
  }
  
  getCostoDevolucionesVentas(){
    return this.costoDevolucionVentas;
  }
  
  getCostoEntradas(){
    return Money.calculateMoneySus(Money.calculateMoneySum([this.costoInicial, this.costoCompras]), this.costoDevolucionCompras);
  }
  
  getCostoSalidas(){
    return Money.calculateMoneySus(this.costoVentas,this.costoDevolucionVentas);
  }
  
  getCostoExistencias(){
    return Money.calculateMoneySus(this.getCostoEntradas(), this.getCostoSalidas());
  }
  
  getPrecioPromedio(){
    return this.precioPromedio;
  }
  
  //SETTERS
  setCodigoProducto(codigoProducto){
    this.codigoProducto = codigoProducto;
  }
  
  setTransacciones(transacciones){
    this.transacciones = transacciones;
  }
  
  setMetodoValuacion(metodoValuacion){
    this.metodoValuacion = metodoValuacion;
  }
  
  setDatos(datos){
    this.datos = datos;
  }
  
  setInicial(costo){
    this.inicial = costo;
  }
  
  setPrecioPromedio(precio){
    this.precioPromedio = precio;
  }
  
  extraerTransacciones(historial){
    let transacciones = [];
    transacciones = historial.filter(transaccion => transaccion.getCodigoProducto() == this.codigoProducto);
    return transacciones;
  }
  
  procesarDatos(){
    switch (this.metodoValuacion) {
      case Inventario.PROMEDIO:
        let datosPromedio = new PROMEDIO(this.transacciones);
        this.establecerInfo(datosPromedio.info());
        break;
      
      case Inventario.PEPS:
        let datosPeps = new PEPS(this.transacciones);
        break;
    }
  }
  
  establecerInfo(info){
    console.log(info)
    this.setDatos(info.datos);
    this.setInicial(info.inicial);
    this.costoInicial = (info.costoInicial);
    this.compras = info.compras;
    this.costoCompras = info.costoCompras;
    this.ventas = info.ventas;
    this.costoVentas = info.costoVentas;
    this.devolucionesVentas = info.devolucionesVentas;
    this.costoDevolucionVentas = info.costoDevolucionVentas;
    this.devolucionesCompras = info.devolucionesCompras;
    this.costoDevolucionCompras = info.costoDevolucionCompras;
    this.setPrecioPromedio(info.precioPromedio);
  }
  
  //METODOS VALUACION
  static get PROMEDIO(){
    return 0;
  }
  
  static get PEPS(){
    return 1;
  }
}

export {Inventario};
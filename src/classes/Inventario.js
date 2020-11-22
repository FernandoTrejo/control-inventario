import {PEPS, PROMEDIO} from './Valuacion.js';

class Inventario{
  constructor(codigoProducto, historial, metodoValuacion){
    this.codigoProducto = codigoProducto;
    this.transacciones = this.extraerTransacciones(historial);
    this.metodoValuacion = metodoValuacion;
    
    this.datos = [];
    this.inicial = 0;
    this.entradas = 0;
    this.salidas = 0;
    this.existencias = 0;
    this.costoInicial = null;
    this.costoEntradas = null;
    this.costoSalidas = null;
    this.costoExistencias = null;
    
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
  
  getEntradas(){
    return this.entradas;
  }
  
  getSalidas(){
    return this.salidas;
  }
  
  getExistencias(){
    return this.existencias;
  }
  
  getCostoInicial(){
    return this.costoInicial;
  }
  
  getCostoEntradas(){
    return this.costoEntradas;
  }
  
  getCostoSalidas(){
    return this.costoSalidas;
  }
  
  getCostoExistencias(){
    return this.costoExistencias;
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
  
  setEntradas(costo){
    this.entradas = costo;
  }
  
  setSalidas(costo){
    this.salidas = costo;
  }
  
  setExistencias(costo){
    this.existencias = costo;
  }
  
  setCostoInicial(costo){
    this.costoInicial = costo;
  }
  
  setCostoEntradas(costo){
    this.costoEntradas = costo;
  }
  
  setCostoSalidas(costo){
    this.costoSalidas = costo;
  }
  
  setCostoExistencias(costo){
    this.costoExistencias = costo;
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
    this.setDatos(info.datos);
    this.setInicial(info.inicial);
    this.setCostoInicial(info.costoInicial);
    this.setEntradas(info.entradas);
    this.setSalidas(info.salidas);
    this.setExistencias(info.existencias);
    this.setCostoEntradas(info.costoEntradas);
    this.setCostoSalidas(info.costoSalidas);
    this.setCostoExistencias(info.costoExistencias);
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
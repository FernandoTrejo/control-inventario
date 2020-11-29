import {Default} from './Default.js';
import {Historial} from '../classes/Historial.js';
import {Entidad} from '../classes/Entidad.js';
import {Producto} from '../classes/Producto.js';
import {Transaccion} from '../classes/Transaccion.js';
import {Money} from '../classes/Money.js';

class Storage{
  constructor(name, object){
    this.name = name;
    this.object = object;
  }
  
  save(){
    // Convirte el JSON string con JSON.stringify()
    // entonces guarda con localStorage con el nombre de la sesión
    localStorage.setItem(this.name, JSON.stringify(this.object));
  }
  
  static getSessionData(){
    if(!Storage.sessionExists('session')){
      console.log('aqui no existe la ses')
      return new Storage('session',{'is_auth': false,'empresa': null});
    }
    console.log('exise')
    return new Storage('session', JSON.parse(localStorage.getItem('session')));
  }
      
  static getInstance(name){
    if(!Storage.sessionExists(name)){
      return new Storage(name, new Default());
    }
    return Storage.buildStorageObject(name,Storage.parseJSON(name));
  }
  
  static sessionExists(name){
    return localStorage[name];
  }
  
  static parseJSON(name){
    return JSON.parse(localStorage.getItem(name));
  }
  
  static buildStorageObject(name,obj){
    console.log(obj)
    let iniciales = obj.historial.iniciales.map(elemento => new Transaccion(elemento.fechaString, new Date(elemento.fechaDate), elemento.detalle, elemento.cantidad, new Money(elemento.montoUnitario.completeQuantity), elemento.codigoProducto, elemento.entidad, elemento.tipoTransaccion));
    let compras = obj.historial.compras.map(elemento => new Transaccion(elemento.fechaString, new Date(elemento.fechaDate), elemento.detalle, elemento.cantidad, new Money(elemento.montoUnitario.completeQuantity), elemento.codigoProducto, elemento.entidad, elemento.tipoTransaccion));
    let ventas = obj.historial.ventas.map(elemento => new Transaccion(elemento.fechaString, new Date(elemento.fechaDate), elemento.detalle, elemento.cantidad, new Money(elemento.montoUnitario.completeQuantity), elemento.codigoProducto, elemento.entidad, elemento.tipoTransaccion));
    let devolucionesCompras = obj.historial.devolucionesCompras.map(elemento => new Transaccion(elemento.fechaString, new Date(elemento.fechaDate), elemento.detalle, elemento.cantidad, new Money(elemento.montoUnitario.completeQuantity), elemento.codigoProducto, elemento.entidad, elemento.tipoTransaccion));
    let devolucionesVentas = obj.historial.devolucionesVentas.map(elemento => new Transaccion(elemento.fechaString, new Date(elemento.fechaDate), elemento.detalle, elemento.cantidad, new Money(elemento.montoUnitario.completeQuantity), elemento.codigoProducto, elemento.entidad, elemento.tipoTransaccion));
    
    let historial = new Historial(iniciales, ventas, compras, devolucionesCompras, devolucionesVentas);
    
    let entidades = obj.entidades.map(entidad => new Entidad(entidad.codigo, entidad.nombre, entidad.direccion, entidad.telefono, entidad.email, entidad.descripcion, entidad.tipo));
    
    let productos = obj.productos.map(producto => new Producto(producto.codigo, producto.nombre, producto.unidad, producto.descripcion));//pendiente de definir
    let config = obj.config;
    
    let finalObject = new Default(historial, entidades, productos, config);
    
    return new Storage(name, finalObject); 
  }
  
  getObject(){
    return this.object;
  }
  
  setObject(object){
    this.object = object;
    this.save();
  }
}

export {Storage};
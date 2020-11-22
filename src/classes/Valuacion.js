import {Transaccion} from './Transaccion.js';
import {Money} from './Money.js';

class PEPS{
  constructor(transacciones){
    this.transacciones = transacciones;
    this.datos = [];
    this.procesarDatos();
  }
  
  info(){
    return this.datos;
  }
  
  procesarDatos(){
    if(this.transacciones.length > 0){
      
    }
    
  }
}

class PROMEDIO{
  //sumar todos los costos, y dividirlos entre la cantidad de productos.
  constructor(transacciones){
    this.transacciones = transacciones;
    this.datos = [];
    this.procesarDatos();
  }
  
  info(){
    return this.obtenerDatos();
  }
  
  procesarDatos(){
    if(this.transacciones.length > 0){
      let cantidadUnidades = 0;
      let dineroTotal = new Money(0);
      let precioPromedio = new Money(0);
      
      //para filtrar los tipos de transacciones 
      let tiposEvaluar = [Transaccion.COMPRA,Transaccion.DEVOLUCION_COMPRA,Transaccion.INVENTARIO_INICIAL];
      
      for(let transaccion of this.transacciones){
        let montoUnitario = transaccion.getMontoUnitario();
        let montoTotal = transaccion.getMontoTotal();
        
        if(!tiposEvaluar.includes(transaccion.getTipoTransaccion())){
          montoUnitario = new Money(precioPromedio.completeQuantity);
          montoTotal = Money.multiply([transaccion.getCantidad(), montoUnitario.completeQuantity]);
        }
        
        cantidadUnidades += this.operarCantidad(transaccion.getCantidad(), transaccion.getTipoTransaccion());
        dineroTotal = Money.calculateSum([dineroTotal.quantity, this.operarCantidad(montoTotal.quantity, transaccion.getTipoTransaccion())]); 
        precioPromedio = Money.divide(dineroTotal.quantity, cantidadUnidades);
        
        let registro = [
          transaccion.getTipoTransaccion(),
          transaccion.getFecha(), 
          transaccion.getDetalle(),
          transaccion.getCantidad(),
          montoUnitario,
          montoTotal,
          cantidadUnidades,
          precioPromedio,
          dineroTotal
        ];

        this.datos.push(registro);
      }
    }
  }
  
  obtenerDatos(){
    let result = {
      'datos': this.datos,
      'inicial': 0,
      'costoInicial': new Money(0),
      'entradas': 0,
      'salidas': 0,
      'existencias': 0,
      'costoEntradas': new Money(0),
      'costoSalidas': new Money(0),
      'costoExistencias': new Money(0)
    };
    
    if(this.datos.length > 0){
      let inventarioInicial = this.datos.filter(registro => registro[0] == Transaccion.INVENTARIO_INICIAL);
      let compras = this.datos.filter(registro => registro[0] == Transaccion.COMPRA);
      let ventas = this.datos.filter(registro => registro[0] == Transaccion.VENTA);
      let devolucionesCompras = this.datos.filter(registro => registro[0] == Transaccion.DEVOLUCION_COMPRA);
      let devolucionesVentas = this.datos.filter(registro => registro[0] == Transaccion.DEVOLUCION_VENTA);
      
      //TOTALES
      let cantidadInicial = inventarioInicial.reduce((total, currentValue) => total + currentValue[3], 0);
      let costoInicial = inventarioInicial.reduce((total, currentValue) => Money.calculateMoneySum([total, currentValue[5]]), new Money(0));
      
      let cantidadCompras = compras.reduce((total, currentValue) => total + currentValue[3], 0);
      let costoCompras = compras.reduce((total, currentValue) => Money.calculateMoneySum([total, currentValue[5]]), new Money(0));
      
      let cantidadVentas = ventas.reduce((total, currentValue) => total + currentValue[3], 0);
      let costoVentas = ventas.reduce((total, currentValue) => Money.calculateMoneySum([total, currentValue[5]]), new Money(0));
      
      let cantidadDevolucionVentas = devolucionesVentas.reduce((total, currentValue) => total + currentValue[3], 0);
      let costoDevolucionVentas = devolucionesVentas.reduce((total, currentValue) => Money.calculateMoneySum([total, currentValue[5]]), new Money(0));
      
      let cantidadDevolucionCompras = devolucionesCompras.reduce((total, currentValue) => total + currentValue[3], 0);
      let costoDevolucionCompras = devolucionesCompras.reduce((total, currentValue) => Money.calculateMoneySum([total, currentValue[5]]), new Money(0));
      
      result.inicial = cantidadInicial;
      result.costoInicial = costoInicial;
      
      result.entradas = cantidadInicial + cantidadCompras - cantidadDevolucionCompras;
      result.salidas = cantidadVentas - cantidadDevolucionVentas;
      result.existencias = result.entradas - result.salidas;
      
      result.costoEntradas = Money.calculateMoneySus(Money.calculateMoneySum([costoInicial, costoCompras]), costoDevolucionCompras);
      result.costoSalidas = Money.calculateMoneySus(costoVentas,costoDevolucionVentas);
      result.costoExistencias = Money.calculateMoneySus(result.costoEntradas, result.costoSalidas);
    }
    
    return result;
  }
  
  operarCantidad(cantidad, tipo){
    switch (tipo) {
      case Transaccion.INVENTARIO_INICIAL:
        return cantidad;
        
      case Transaccion.COMPRA:
        return cantidad;
      
      case Transaccion.VENTA:
        return cantidad * (-1);
        
      case Transaccion.DEVOLUCION_COMPRA:
        return cantidad * (-1);
      
      case Transaccion.DEVOLUCION_VENTA:
        return cantidad;
    }
  }
}

export {PEPS, PROMEDIO};
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
    this.precioPromedio = new Money(0);
    this.datos = [];
    this.datos02 = [];
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
        
        let cantidadUnidadesRegistro = this.operarCantidad(transaccion.getCantidad(), transaccion.getTipoTransaccion());
        cantidadUnidades += Number(cantidadUnidadesRegistro);
        
        let dineroTotalRegistro = this.operarCantidad(montoTotal.quantity, transaccion.getTipoTransaccion());
        let tempTotalRegistro = new Money(dineroTotalRegistro);
        
        dineroTotal = Money.calculateSum([dineroTotal.quantity, tempTotalRegistro.quantity]); 
        precioPromedio = Money.divide(dineroTotal.quantity, cantidadUnidades);
        
        let cantidad01 = "";
        let cantidad02 = "";
        let montoUnitario01 = "";
        let montoUnitario02 = "";
        let montoTotal01 = "";
        let montoTotal02 = "";
        
        if(tiposEvaluar.includes(transaccion.getTipoTransaccion())){
          if(transaccion.getTipoTransaccion() == Transaccion.DEVOLUCION_COMPRA){
            cantidad01 = cantidadUnidadesRegistro * (-1);
            let m3 = new Money(Number(montoUnitario.quantity) * (-1));
            montoUnitario01 = m3;
            let m4 = new Money(Number(tempTotalRegistro.quantity) * (-1));
            montoTotal01 = m4;
          }else{
            cantidad01 = cantidadUnidadesRegistro;
            montoUnitario01 = montoUnitario;
            montoTotal01 = tempTotalRegistro;
          }
        }else{
          if(transaccion.getTipoTransaccion() == Transaccion.DEVOLUCION_VENTA){
            cantidad02 = cantidadUnidadesRegistro;
            montoUnitario02 = montoUnitario;
            montoTotal02 = tempTotalRegistro();
          }else{
            cantidad02 = cantidadUnidadesRegistro * (-1);
            let m = new Money(Math.abs(montoUnitario.quantity));
            montoUnitario02 = m;
            let m2 = new Money(Math.abs(tempTotalRegistro.quantity))
            montoTotal02 = m2;
          }
        }
        this.precioPromedio = precioPromedio;
        
        let registro = [
          transaccion.getTipoTransaccion(),
          transaccion.fechaToString(), 
          transaccion.getDetalle(),
          cantidad01,
          montoUnitario01,
          montoTotal01,
          cantidad02,
          montoUnitario02,
          montoTotal02,
          cantidadUnidades,
          precioPromedio,
          dineroTotal
        ]
        
        let registro02 = [
          transaccion.getTipoTransaccionString(),
          transaccion.fechaToString(), 
          transaccion.getDetalle(),
          cantidad01,
          montoUnitario01.toString(),
          montoTotal01.toString(),
          cantidad02,
          montoUnitario02.toString(),
          montoTotal02.toString(),
          cantidadUnidades,
          precioPromedio.toString(),
          dineroTotal.toString()
        ];

        this.datos.push(registro);
        this.datos02.push(registro02);
      }
    }
  }
  
  obtenerDatos(){
    let result = {
      'datos': this.datos02,
      'inicial': 0,
      'costoInicial': new Money(0),
      'entradas': 0,
      'salidas': 0,
      'existencias': 0,
      'costoEntradas': new Money(0),
      'costoSalidas': new Money(0),
      'costoExistencias': new Money(0),
      'precioPromedio': new Money(0)
    };
    
    if(this.datos.length > 0){
      let inventarioInicial = this.datos.filter(registro => registro[0] == Transaccion.INVENTARIO_INICIAL);
      let compras = this.datos.filter(registro => registro[0] == Transaccion.COMPRA);
      let ventas = this.datos.filter(registro => registro[0] == Transaccion.VENTA);
      let devolucionesCompras = this.datos.filter(registro => registro[0] == Transaccion.DEVOLUCION_COMPRA);
      let devolucionesVentas = this.datos.filter(registro => registro[0] == Transaccion.DEVOLUCION_VENTA);
      
      //TOTALES
      let cantidadInicial = inventarioInicial.reduce((total, currentValue) => Number(total) + Number(currentValue[3]), 0);
      let costoInicial = inventarioInicial.reduce((total, currentValue) => Money.calculateMoneySum([total, currentValue[5]]), new Money(0));
      
      let cantidadCompras = compras.reduce((total, currentValue) => Number(total) + Number(currentValue[3]), 0);
      let costoCompras = compras.reduce((total, currentValue) => Money.calculateMoneySum([total, currentValue[5]]), new Money(0));
      
      let cantidadVentas = ventas.reduce((total, currentValue) => Number(total) + Number(currentValue[6]), 0);
      let costoVentas = ventas.reduce((total, currentValue) => Money.calculateMoneySum([total, currentValue[8]]), new Money(0));
      
      let cantidadDevolucionVentas = devolucionesVentas.reduce((total, currentValue) => Number(total) + Number(currentValue[6]), 0);
      let costoDevolucionVentas = devolucionesVentas.reduce((total, currentValue) => Money.calculateMoneySum([total, currentValue[8]]), new Money(0));
      
      let cantidadDevolucionCompras = devolucionesCompras.reduce((total, currentValue) => Number(total) + Number(currentValue[3]), 0);
      let costoDevolucionCompras = devolucionesCompras.reduce((total, currentValue) => Money.calculateMoneySum([total, currentValue[5]]), new Money(0));
      
      result.inicial = cantidadInicial;
      result.costoInicial = costoInicial;
      
      result.entradas = Number(cantidadInicial) + Number(cantidadCompras) - Number(cantidadDevolucionCompras);
      result.salidas = Number(cantidadVentas) - Number(cantidadDevolucionVentas);
      result.existencias = Number(result.entradas) - Number(result.salidas);
      
      result.costoEntradas = Money.calculateMoneySus(Money.calculateMoneySum([costoInicial, costoCompras]), costoDevolucionCompras);
      result.costoSalidas = Money.calculateMoneySus(costoVentas,costoDevolucionVentas);
      result.costoExistencias = Money.calculateMoneySus(result.costoEntradas, result.costoSalidas);
      
      result.precioPromedio = this.precioPromedio;
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
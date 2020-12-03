import {Producto} from '../classes/Producto.js';
import {Entidad} from '../classes/Entidad.js';
import {Transaccion} from '../classes/Transaccion.js';
import {PROMEDIO} from '../classes/Valuacion.js';
import {Inventario} from '../classes/Inventario.js';
import {Storage} from '../storage/Storage.js';
import {Table, TableProperties, Header, HeaderProperties, Body, BodyProperties, Footer, FooterProperties} from '../JSHELEMENTS/HTMLElements/Table.js';

let session = Storage.getSessionData();
let store = null; 

/*FUNCIONES PRINCIPALES*/
function reloadStore(){
  store = Storage.getInstance('INV-' + session.getObject().empresa);
  console.log(store)
}

function obtenerProductos(){
  return store.getObject().getProductos();
}

function obtenerHistorial(){
  let historial = store.getObject().getHistorial().exportarDatos();
  return historial;
}

function optionsProductos(productos){
  let html = `<option value="" selected>Seleccionar Producto</option>`;
  for(let producto of productos){
    html += `<option value="${producto.getCodigo()}">${producto.getNombre()}</option>`;
  }
  return html;
}

function mostrarInventario(codigo){
  if(codigo != ""){
    let inventario = new Inventario(codigo, obtenerHistorial(), Inventario.PROMEDIO);
    
    let headers = ['PRINCIPAL','ENTRADAS','SALIDAS','SALDOS'];
    
    let datos = inventario.getDatos();
    datos.unshift(['TIPO','FECHA','DETALLE','CANTIDAD','UNITARIO','TOTAL','CANTIDAD','UNITARIO','TOTAL','CANTIDAD','PROMEDIO','TOTAL']);
    console.log(inventario.getCostoSalidas());
    let footerDatos = ['','', '',
          inventario.getEntradas(),
          '',
          inventario.getCostoEntradas().toString(),
          inventario.getSalidas(),
          '',
          inventario.getCostoSalidas().toString(),
          inventario.getExistencias(),
          inventario.getPrecioPromedio().toString(),
          inventario.getCostoExistencias().toString()
        ];
          
    let tablaHtml = crearTablaInventario(headers, datos, footerDatos);
    htmlRender('divInventario', tablaHtml);
    mostrarDatosFinales(inventario.getCostoExistencias().toString(),inventario.getExistencias(),inventario.getPrecioPromedio().toString(),inventario.getCostoSalidas().toString());
    htmlUnsetClass('d-none', 'cardInventario');
    htmlUnsetClass('d-none', 'divResultados');
    htmlSetClass('d-flex', 'divResultados');
  }else{
    htmlSetClass('d-none', 'cardInventario');
    htmlUnsetClass('d-flex', 'divResultados');
    htmlSetClass('d-none', 'divResultados');
  }
}

function mostrarDatosFinales(costoInventarioFinal, existencias, precioPromedio, costoVentas){
  htmlRender('cardInventarioFinal', simpleTable('INVENTARIO FINAL', costoInventarioFinal));
  htmlRender('cardExistencias', simpleTable('EXISTENCIAS', existencias));
  htmlRender('cardPrecioPromedio', simpleTable('COSTO PROMEDIO', precioPromedio));
  htmlRender('cardCostoVentas', simpleTable('COSTO DE VENTAS', costoVentas));
}

function simpleTable(header,value){
  return `<div class="table-responsive"><table class="table"><tr><th>${header}</th></tr><tr><td>${value}</td></tr></table></div>`;
}

function crearTablaInventario(headers, data, footerData){
  let headerProperties = new HeaderProperties();
  headerProperties.addPropCols('colspan', 3);
  let tableHeader = new Header(headers, headerProperties);
  
  let tableBody = new Body(data, new BodyProperties());
  
  let tableFooter = new Footer(footerData, new FooterProperties());
  
  let propsTable = new TableProperties();
  propsTable.addPropMain("class","table");
  propsTable.addPropMain("style","text-align:center;");
  let table = new Table("Inventario", tableHeader, tableBody, tableFooter, propsTable);
  
  let html = `<div class="table-responsive">`;
  html += table.getHtml();
  html += `</div>`;
  
  return html;
}

jQuery(document).ready(function($) {
    'use strict';
    reloadStore();
    htmlEventListener('selectProductos', 'change', function(){
      mostrarInventario(this.value);
    });
    
    htmlRender('selectProductos', optionsProductos(obtenerProductos()));
});
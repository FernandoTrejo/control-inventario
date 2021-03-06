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
}

function obtenerEntidades(){
  let entidades = store.getObject().getEntidades();
  let proveedores = entidades.filter(entidad => entidad.getTipo() == Entidad.PROVEEDOR);
  return proveedores;
}

function obtenerProductos(){
  return store.getObject().getProductos();
}

function obtenerTransacciones(){
  let transacciones = store.getObject().getHistorial().consultarDevolucionesCompras();
  return transacciones;
}

function obtenerPreciosCompra(codigoProducto){
  let transacciones = store.getObject().getHistorial().consultarCompras();
  transacciones = transacciones.concat(store.getObject().getHistorial().consultarIniciales());
  let transaccionesProducto = transacciones.filter(transaccion => transaccion.getCodigoProducto() == codigoProducto);
  return transaccionesProducto;
}

function guardarTransaccion(transaccion){ 
  console.log(transaccion)
  if(htmlValue('inputEditar') == "EDICION"){
    let indice = Number(htmlValue('inputIdTransaccion'));
    store.getObject().getHistorial().editarTransaccion(indice, transaccion, Transaccion.DEVOLUCION_COMPRA);
  }else{
    store.getObject().getHistorial().agregarDevolucionCompra(transaccion);
  }
  store.save();
}

function eliminarTransaccion(indice){ 
  //eliminar transaccion
  store.getObject().getHistorial().eliminarTransaccion(indice, Transaccion.DEVOLUCION_COMPRA);
  store.save();
  console.log(store)
}

function obtenerInventario(codigo){
  let historial = store.getObject().getHistorial().exportarDatos();
  return new Inventario(codigo, historial, Inventario.PROMEDIO);
}

/*FIN FUNCIONES PRINCIPALES*/

/*FUNCIONES CONSTANTES DE LA PAGINA*/

function obtenerInputsIdsTransaccion(){ 
  return ['dateFechaTransaccion','txtDetalle','numCantidad','numPrecio','selectProductos','selectProveedores'];
}
/*FIN FUNCIONES CONSTANTES DE LA PAGINA*/

/*LISTA DE Transacciones*/
function mostrarListaTransacciones(){
  reloadStore();
  let transacciones = obtenerTransacciones();
  
  let html = ``;
  let i = 0;
  for(let transaccion of transacciones){
    html += crearCardTransaccion(transaccion, i);
    i++;
  }
  htmlRender('divTransacciones', html);
  
  //eliminar y editar
  document.querySelectorAll('.delete-asi').forEach(item => {
    item.addEventListener('click', event => {
      alertify.confirm("","¿Está seguro de que desea eliminar esta transacción?",
      function(){
        let res = item.id.split("-");
        eliminarTransaccion(res[2]);
        mostrarListaTransacciones();
        alertify.success('Transacción Eliminada');
      },
      function(){
        alertify.error('Operación Cancelada');
      });
    })
  });
  
  document.querySelectorAll('.modify-asi').forEach(item => {
    item.addEventListener('click', event => {
      let res = item.id.split("-");
      let transaccion = store.getObject().getHistorial().buscarTransaccion(res[2], Transaccion.DEVOLUCION_COMPRA);
      if(transaccion != null){
        mostrarDatosTransaccion(transaccion, res[2]);
      }
    })
  });
}

function crearCardTransaccion(transaccion, i){
  let producto = store.getObject().buscarProducto(transaccion.getCodigoProducto());
  let entidad = store.getObject().buscarEntidad(transaccion.getEntidad(), Entidad.PROVEEDOR);
  
  let html = `<div class="card">
          <div class="card-header d-flex" style="background: #47519c">
            <div>
             <a class="btn btn-link text-white" data-toggle="collapse" data-parent="#accordion-start" href="#collapse-${i}">
               <span class="fas fa-angle-down mr-3"></span> ${transaccion.fechaToString()} - ${producto.getNombre()}
             </a>
            </div>
            <div class="d-block ml-auto">
              <button style="margin: 4px 1px" type="button" class="btn btn-info btn-sm modify-asi" id="btn-modify-${i}" data-toggle="modal" data-target="#exampleModalCenter">
                <i class="fas fa-edit" aria-hidden="true"></i>
              </button>
              <button type="button" class="btn btn-danger btn-sm delete-asi" id="btn-delete-${i}">
                <i class="fas fa-trash-alt" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div id="collapse-${i}" class="collapse in">
            <div class="card-body">
              ${obtenerDetallesTransaccion(transaccion,producto,entidad)}
            </div>
          </div>
        </div>`;
  return html;
}

function optionsProveedores(entidades){
  let html = `<option value="" selected>Seleccionar Proveedor</option>`;
  for(let entidad of entidades){
    html += `<option value="${entidad.getCodigo()}">${entidad.getNombre()}</option>`;
  }
  return html;
}

function optionsProductos(productos){
  let html = `<option value="" selected>Seleccionar Producto</option>`;
  for(let producto of productos){
    html += `<option value="${producto.getCodigo()}">${producto.getNombre()}</option>`;
  }
  return html;
}

function obtenerDetallesTransaccion(transaccion,producto,entidad){
  let tableHeader = new Header([], new HeaderProperties());
  
  let data = transaccion.toArray();
  data[5][1] = producto.getNombre();
  data[6][1] = entidad.getNombre();
  data.splice(3, 2);
  
  let tableBody = new Body(data, new BodyProperties());
  
  let tableFooter = new Footer([], new FooterProperties());
  
  let propsTable = new TableProperties();
  propsTable.addPropMain("class","table")
  let table = new Table("DetallesTransaccion", tableHeader, tableBody, tableFooter, propsTable);
  
  let html = `<div class="table-responsive">`;
  html += table.getHtml();
  html += `</div>`;
  
  return html;
}

/*FIN LISTA DE Clientes*/

/*CREAR NUEVO*/

function crearNuevo(){
  let tranInputsValues = collectInputs(obtenerInputsIdsTransaccion());
  
  if(nonEmptyFields(tranInputsValues)){
    let transaccion = Transaccion.fromArray(tranInputsValues); 
    console.log(transaccion);
    guardarTransaccion(transaccion);
    mostrarListaTransacciones();
  }
}

/*FIN CREAR NUEVO*/

/*EDITAR*/

function mostrarDatosTransaccion(transaccion, id){
  let datosTransaccion = [obtenerInputsIdsTransaccion(),transaccion.fieldsToArray()];
      
  fillFields(datosTransaccion);
  htmlValue('inputEditar', 'EDICION');
  htmlValue('inputIdTransaccion', id);
  htmlDisable('btnAgregarNuevo', false);
}

/*FIN EDITAR*/

/*FUNCIONES DE BOTONES*/
function limpiarControles(){ //REVISAR BIEN ESTO
  clearControls(obtenerInputsIdsTransaccion());
  htmlValue('inputEditar', 'CREACION');
  htmlDisable('btnAgregarNuevo', true);
}

/*funciones de controles*/
function habilitarBotonGuardar(){
  let inputs = collectInputs(obtenerInputsIdsTransaccion());
  let response = inputs.filter(input => input == "");
  
  let disabled = (response.length > 0);
  htmlDisable('btnAgregarNuevo', disabled);
}

jQuery(document).ready(function($) {
    'use strict';
    
    /* Calender jQuery **/
    /*if ($("#datepicker").length) {
        $('#datepicker').datetimepicker({
            format: 'L'
        });
    }*/
    
    htmlEventListener('btnAgregarNuevo','click',crearNuevo);
    htmlEventListener('btnAbrirModal','click',limpiarControles);
    
    /*para habilitar el boton guardar*/
    htmlEventListener('txtDetalle', 'keyup', habilitarBotonGuardar);
    htmlEventListener('dateFechaTransaccion', 'input', habilitarBotonGuardar); // arreglar
    htmlEventListener('numCantidad', 'keyup', habilitarBotonGuardar);
    htmlEventListener('numPrecio', 'change', habilitarBotonGuardar);
    htmlEventListener('selectProveedores', 'change', habilitarBotonGuardar);
    htmlEventListener('selectProductos', 'change', function(){
      habilitarBotonGuardar();
      if(nonEmptyFields([htmlValue('selectProductos')])){
        let comprasProducto = obtenerPreciosCompra(htmlValue('selectProductos'));
        let htmlSelectPrecio = `<option value="" selected>Seleccionar Precio</option>`;
        
        for(let compra of comprasProducto){
          htmlSelectPrecio += `<option value="${compra.getMontoUnitario().completeQuantity}">${compra.getMontoUnitario().toString()}</option>`;
        }
        
        htmlRender('numPrecio', htmlSelectPrecio);
        
        let inventario = obtenerInventario(htmlValue('selectProductos'));
        console.log(inventario)
        let precioPromedio = inventario.getPrecioPromedio();
        htmlValue('numPrecio', precioPromedio.quantity);
        
        let existencias = inventario.getExistencias();
        let numCantidad = htmlElement('numCantidad');
        numCantidad.placeholder = 'Existencias: ' + existencias;
        console.log(numCantidad)
        
        htmlEventListener('numCantidad','keyup', function(){
          if(Number(htmlValue('numCantidad')) > existencias){
            htmlText('numCantidadError', 'La cantidad ingresada supera a la cantidad en existencias.');
          }else{
            htmlText('numCantidadError', '');
          }
        });
      }
    });
    //agregar los campos obligatorios
    mostrarListaTransacciones();
    console.log(store)
    htmlRender('selectProveedores', optionsProveedores(obtenerEntidades()));
    htmlRender('selectProductos', optionsProductos(obtenerProductos()));
});

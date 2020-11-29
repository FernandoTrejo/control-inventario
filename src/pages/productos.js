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

function obtenerProveedores(){
  let entidades = store.getObject().getEntidades();
  let proveedores = entidades.filter(entidad => entidad.getTipo() == Entidad.PROVEEDOR);
  return proveedores;
}

function obtenerProductos(){
  return store.getObject().getProductos();
}

function obtenerTransacciones(){
  let transacciones = store.getObject().getHistorial().consultarIniciales();
  return transacciones;
}

function obtenerTransaccionInicial(codigo){
  let transacciones = store.getObject().getHistorial().consultarIniciales();
  let inicial = transacciones.filter(transaccion => transaccion.getCodigoProducto() == codigo);
  return inicial[0];
}

function guardarProducto(producto, transaccion){ 
  if(htmlValue('inputEditar') == "EDICION"){
    let nuevoProducto = store.getObject().buscarProducto(producto.getCodigo());
    if(nuevoProducto != null){
      let transaccionesProducto = store.getObject().buscarTransacciones(nuevoProducto.getCodigo(), Transaccion.INVENTARIO_INICIAL);
      let nuevaTransaccion = null;
      if(transaccionesProducto.length > 0){
        nuevaTransaccion = transaccionesProducto[0];
      }
      nuevaTransaccion.setTipoTransaccion(Transaccion.INVENTARIO_INICIAL);
      nuevaTransaccion.copyFromObject(transaccion);
      nuevoProducto.copyFromObject(producto);
      store.save();
    }
  }else{
    let busqueda = store.getObject().buscarProducto(producto.getCodigo());
    if(busqueda == null){
      store.getObject().getProductos().push(producto);
      store.getObject().getHistorial().agregarInicial(transaccion);
      store.save();
    }
  }
}

/*FIN FUNCIONES PRINCIPALES*/

/*FUNCIONES CONSTANTES DE LA PAGINA*/
function obtenerInputsIdsProducto(){
  return ['txtCodigo', 'txtNombre', 'txtUnidad', 'txtDescripcion'];
}

function obtenerInputsIdsTransaccion(){ //inventario inicial
  return ['dateFechaTransaccion','inputDetalle','numCantidadInicial','numPrecio','txtCodigo','selectProveedores'];
}
/*FIN FUNCIONES CONSTANTES DE LA PAGINA*/

/*LISTA DE Clientes*/
function mostrarListaProductos(){
  reloadStore();
  let productos = obtenerProductos();
  
  let html = ``;
  for(let producto of productos){
    html += crearCardProducto(producto);
  }
  htmlRender('divProductos', html);
  
  //eliminar y editar
  document.querySelectorAll('.delete-asi').forEach(item => {
    item.addEventListener('click', event => {
      alertify.confirm("","Las transacciones asociadas a este producto también serán eliminadas. ¿Desea continuar?",
      function(){
        let res = item.id.split("-");
        store.getObject().eliminarProducto(res[2]);
        store.save();
        mostrarListaProductos();
        alertify.success('Producto Eliminado');
      },
      function(){
        alertify.error('Operación Cancelada');
      });
    })
  });
  
  document.querySelectorAll('.modify-asi').forEach(item => {
    item.addEventListener('click', event => {
      let res = item.id.split("-");
      let producto = store.getObject().buscarProducto(res[2]);
      if(producto != null){
        mostrarDatosProducto(producto);
        htmlValue('inputEditar', 'EDICION');
      }
    })
  });
  
  document.querySelectorAll('.check-asi').forEach(item => {
    item.addEventListener('click', event => {
      let res = item.id.split("-");
      let producto = store.getObject().buscarProducto(res[2]);
      if(producto != null){
        mostrarTransaccionesProducto(producto);
      }
    })
  });
  
  document.querySelectorAll('.cons-asi').forEach(item => {
    item.addEventListener('click', event => {
      let res = item.id.split("-");
      let producto = store.getObject().buscarProducto(res[2]);
      if(producto != null){
        mostrarTransaccionesProducto(producto);
      }
    })
  });
}

function mostrarTransaccionesProducto(producto){
  let historial = store.getObject().getHistorial().exportarDatos();
  let inventario = new Inventario(producto.getCodigo(), historial, Inventario.PROMEDIO);
  let transacciones = inventario.getTransacciones();
  
  let data = [];
  let tiposTransacciones = [Transaccion.VENTA, Transaccion.DEVOLUCION_VENTA];
  for(let transaccion of transacciones){
    let tipo = (tiposTransacciones.includes(transaccion.getTipoTransaccion())) ? Entidad.CLIENTE : Entidad.PROVEEDOR;
    let entidad = store.getObject().buscarEntidad(transaccion.getEntidad(), tipo);
    console.log(tipo,entidad)
    if(entidad != null){
      data.push([transaccion.fechaToString(),transaccion.getTipoTransaccionString(),entidad.getNombre(),transaccion.getCantidad()]);
    }
  }
  
  let tableHeader = new Header(['Fecha','Tipo','Cliente/Proveedor','Cantidad'], new HeaderProperties());
  
  let tableBody = new Body(data, new BodyProperties());
  
  let tableFooter = new Footer([], new FooterProperties());
  
  let propsTable = new TableProperties();
  propsTable.addPropMain("class","table")
  let table = new Table("TransaccionesProducto", tableHeader, tableBody, tableFooter, propsTable);
  
  let html = `<div class="table-responsive">`;
  html += table.getHtml();
  html += `</div>`;
  
  htmlRender('nombreProducto', 'Producto: ' + producto.getNombre());
  htmlRender('historialProducto', html);
  
  htmlUnsetClass('d-none', 'divHistorialProducto');
  htmlSetClass('d-flex', 'divHistorialProducto');
  
  htmlUnsetClass('d-flex', 'divListaProductos');
  htmlSetClass('d-none', 'divListaProductos');
  
  htmlUnsetClass('d-flex', 'divBotonCrear');
  htmlSetClass('d-none', 'divBotonCrear');
}

function retornar(){
  htmlRender('historialProducto', '');
  
  htmlUnsetClass('d-flex', 'divHistorialProducto');
  htmlSetClass('d-none', 'divHistorialProducto');
  
  htmlUnsetClass('d-none', 'divListaProductos');
  htmlSetClass('d-flex', 'divListaProductos');
  
  htmlUnsetClass('d-none', 'divBotonCrear');
  htmlSetClass('d-flex', 'divBotonCrear');
}

function crearCardProducto(producto){
  let historial = store.getObject().getHistorial().exportarDatos();
  let inventario = new Inventario(producto.getCodigo(), historial, Inventario.PROMEDIO);
  let transacciones = inventario.getTransacciones();
  let num = transacciones.length;
  let color = (num > 0) ? 'orange' : 'gray';
  
  let html = `<div class="card">
          <div class="card-header d-flex" style="background:#049446">
            <div>
             <a class="btn btn-link text-white" data-toggle="collapse" data-parent="#accordion-start" href="#collapse-${producto.getCodigo()}">
               <span class="fas fa-angle-down mr-3"></span> ${producto.getNombre().toUpperCase()}
             </a>
            </div>
            <div class="d-block ml-auto">
              <button style="margin: 4px 1px; background: ${color};" type="button" class="btn btn-info btn-sm check-asi" id="btn-check-${producto.getCodigo()}">
                ${num}
              </button>
              <button style="margin: 4px 1px" type="button" class="btn btn-info btn-sm modify-asi" id="btn-modify-${producto.getCodigo()}" data-toggle="modal" data-target="#exampleModalCenter">
                <i class="fas fa-edit" aria-hidden="true"></i>
              </button>
              <button type="button" class="btn btn-danger btn-sm delete-asi" id="btn-delete-${producto.getCodigo()}">
                <i class="fas fa-trash-alt" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div id="collapse-${producto.getCodigo()}" class="collapse in">
            <div class="card-body">
              ${obtenerDetallesProducto(producto)}
            </div>
            <div class="card-footer d-flex justify-content-center">
              <button class="btn btn-info cons-asi" id="btn-cons-${producto.getCodigo()}">Consultar Historial</button>
            </div>
          </div>
        </div>`;
  return html;
}

function optionsProveedores(proveedores){
  let html = `<option value="" selected>Seleccionar Proveedor</option>`;
  for(let proveedor of proveedores){
    html += `<option value="${proveedor.getCodigo()}">${proveedor.getNombre()}</option>`;
  }
  return html;
}

function obtenerDetallesProducto(producto){
  let tableHeader = new Header([], new HeaderProperties());
  
  let data = producto.toArray();
  let tableBody = new Body(data, new BodyProperties());
  
  let tableFooter = new Footer([], new FooterProperties());
  
  let propsTable = new TableProperties();
  propsTable.addPropMain("class","table")
  let table = new Table("DetallesProducto", tableHeader, tableBody, tableFooter, propsTable);
  
  let html = `<div class="table-responsive">`;
  html += table.getHtml();
  html += `</div>`;
  
  return html;
}

/*FIN LISTA DE Clientes*/

/*CREAR NUEVO*/

function crearNuevo(){
  let prodInputsValues = collectInputs(obtenerInputsIdsProducto());
  let tranInputsValues = collectInputs(obtenerInputsIdsTransaccion());
  
  if(nonEmptyFields([prodInputsValues[0],prodInputsValues[1],tranInputsValues[0],tranInputsValues[2],tranInputsValues[3],tranInputsValues[5]])){
    let producto = Producto.fromArray(prodInputsValues);
    let transaccion = Transaccion.fromArray(tranInputsValues); 
    
    guardarProducto(producto, transaccion);
    mostrarListaProductos();
  }
}

/*FIN CREAR NUEVO*/

/*EDITAR*/

function mostrarDatosProducto(producto){
  let transaccion = obtenerTransaccionInicial(producto.getCodigo());
  let datosProducto = [obtenerInputsIdsProducto(),producto.fieldsToArray()];
  let datosTransaccion = [obtenerInputsIdsTransaccion(),transaccion.fieldsToArray()];
  fillFields(datosProducto);
  fillFields(datosTransaccion);
  htmlValue('inputEditar', 'EDICION');
  htmlDisable('txtCodigo');
  htmlDisable('btnAgregarNuevo', false);
}

/*FIN EDITAR*/

/*FUNCIONES DE BOTONES*/
function limpiarControles(){ //REVISAR BIEN ESTO
  clearControls(obtenerInputsIdsProducto());
  clearControls(obtenerInputsIdsTransaccion());
  htmlValue('inputEditar', 'CREACION');
  htmlDisable('txtCodigo', false);
  htmlDisable('btnAgregarNuevo', true);
}

/*funciones de controles*/
function habilitarBotonGuardar(){
  let inputs = collectInputs(['txtCodigo','txtNombre','dateFechaTransaccion','numCantidadInicial','numPrecio','selectProveedores']);
  let response = inputs.filter(input => input == "");
 
  let busqueda = null;
  if(htmlValue('inputEditar') == "CREACION"){
    busqueda = store.getObject().buscarProducto(inputs[0]);
    let msg = "Este código ya está registrado";
    htmlText('txtCodigoError', (busqueda != null) ? msg : '');
  }
  
  let disabled = (response.length > 0) || (busqueda != null);
  htmlDisable('btnAgregarNuevo', disabled);
}

jQuery(document).ready(function($) {
    'use strict';
    
    /* Calender jQuery **/
    if ($("#datepicker").length) {
        $('#datepicker').datetimepicker({
            format: 'L'
        });
    }
    
    htmlEventListener('btnAgregarNuevo','click',crearNuevo);
    htmlEventListener('btnAbrirModal','click',limpiarControles);
    
    /*para habilitar el boton guardar*/
    htmlEventListener('txtCodigo', 'keyup', habilitarBotonGuardar);
    htmlEventListener('txtNombre', 'keyup', habilitarBotonGuardar);
    htmlEventListener('dateFechaTransaccion', 'input', habilitarBotonGuardar); // arreglar
    htmlEventListener('numCantidadInicial', 'keyup', habilitarBotonGuardar);
    htmlEventListener('numPrecio', 'keyup', habilitarBotonGuardar);
    htmlEventListener('selectProveedores', 'change', habilitarBotonGuardar);
    //agregar los campos obligatorios
    htmlEventListener('btnRetornar', 'click', retornar);
    mostrarListaProductos();
   
    htmlRender('selectProveedores', optionsProveedores(obtenerProveedores()));
});
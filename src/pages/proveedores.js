import {Entidad} from '../classes/Entidad.js';
import {Storage} from '../storage/Storage.js';
import {Table, TableProperties, Header, HeaderProperties, Body, BodyProperties, Footer, FooterProperties} from '../JSHELEMENTS/HTMLElements/Table.js';

let session = Storage.getSessionData();
let store = null; 

/*FUNCIONES PRINCIPALES*/

function reloadStore(){
  store = Storage.getInstance('INV-' + session.getObject().empresa);
}

function obtenerEntidades(){
  return store.getObject().getEntidades();
}

function obtenerProveedores(){
  let entidades = obtenerEntidades();
  let proveedores = entidades.filter(entidad => entidad.getTipo() == Entidad.PROVEEDOR);
  return proveedores;
}

function guardarEntidad(entidad){
  if(htmlValue('inputEditar') == "EDICION"){
    let nuevaEntidad = store.getObject().buscarEntidad(entidad.getCodigo(), Entidad.PROVEEDOR);
    if(nuevaEntidad != null){
      nuevaEntidad.copyFromObject(entidad);
      store.save();
    }
  }else{
    let busqueda = store.getObject().buscarEntidad(entidad.getCodigo(), Entidad.PROVEEDOR);
    if(busqueda == null){
      store.getObject().getEntidades().push(entidad);
      store.save();
    }
  }
}

/*FIN FUNCIONES PRINCIPALES*/

/*FUNCIONES CONSTANTES DE LA PAGINA*/
function obtenerInputsIds(){
  return ['txtCodigo', 'txtNombre', 'txtDireccion', 'txtTelefono', 'txtEmail', 'txtDescripcion'];
}
/*FIN FUNCIONES CONSTANTES DE LA PAGINA*/

/*LISTA DE PROVEEDORES*/
function mostrarListaProveedores(){
  reloadStore();
  let proveedores = obtenerProveedores();
  
  let html = ``;
  for(let proveedor of proveedores){
    html += crearCardProveedor(proveedor);
  }
  htmlRender('divProveedores', html);
  
  //eliminar y editar
  document.querySelectorAll('.delete-asi').forEach(item => {
    item.addEventListener('click', event => {
      alertify.confirm("","Las transacciones asociadas a este proveedor también serán eliminadas. ¿Desea continuar?",
      function(){
        let res = item.id.split("-");
        store.getObject().eliminarEntidad(res[2], Entidad.PROVEEDOR);
        store.save();
        mostrarListaProveedores();
        alertify.success('Proveedor Eliminado');
      },
      function(){
        alertify.error('Operación Cancelada');
      });
      
    })
  });
  
  document.querySelectorAll('.modify-asi').forEach(item => {
    item.addEventListener('click', event => {
      let res = item.id.split("-");
      let entidad = store.getObject().buscarEntidad(res[2], Entidad.PROVEEDOR);
      if(entidad != null){
        mostrarDatosProveedor(entidad);
        htmlValue('inputEditar', 'EDICION')
      }
    })
  });
  
  document.querySelectorAll('.check-asi').forEach(item => {
    item.addEventListener('click', event => {
      let res = item.id.split("-");
      let entidad = store.getObject().buscarEntidad(res[2], Entidad.PROVEEDOR);
      if(entidad != null){
        mostrarTransaccionesProveedor(entidad);
      }
    })
  });
  
  document.querySelectorAll('.cons-asi').forEach(item => {
    item.addEventListener('click', event => {
      let res = item.id.split("-");
      let entidad = store.getObject().buscarEntidad(res[2], Entidad.PROVEEDOR);
      if(entidad != null){
        mostrarTransaccionesProveedor(entidad);
      }
    })
  });
}

function mostrarTransaccionesProveedor(entidad){
  let transacciones = store.getObject().transaccionesEntidad(entidad.getCodigo(), Entidad.PROVEEDOR);
  let data = [];
  for(let transaccion of transacciones){
    let producto = store.getObject().buscarProducto(transaccion.getCodigoProducto());
    data.push([transaccion.fechaToString(),transaccion.getTipoTransaccionString(),producto.getNombre(),transaccion.getCantidad()]);
  }
  
  let tableHeader = new Header(['Fecha','Tipo','Producto','Cantidad'], new HeaderProperties());
  
  let tableBody = new Body(data, new BodyProperties());
  
  let tableFooter = new Footer([], new FooterProperties());
  
  let propsTable = new TableProperties();
  propsTable.addPropMain("class","table")
  let table = new Table("TransaccionesProveedor", tableHeader, tableBody, tableFooter, propsTable);
  
  let html = `<div class="table-responsive">`;
  html += table.getHtml();
  html += `</div>`;
  
  htmlRender('nombreProveedor', 'Proveedor: ' + entidad.getNombre());
  htmlRender('historialProveedor', html);
  
  htmlUnsetClass('d-none', 'divHistorialProveedor');
  htmlSetClass('d-flex', 'divHistorialProveedor');
  
  htmlUnsetClass('d-flex', 'divListaProveedores');
  htmlSetClass('d-none', 'divListaProveedores');
  
  htmlUnsetClass('d-flex', 'divBotonCrear');
  htmlSetClass('d-none', 'divBotonCrear');
}

function retornar(){
  htmlRender('historialProveedor', '');
  
  htmlUnsetClass('d-flex', 'divHistorialProveedor');
  htmlSetClass('d-none', 'divHistorialProveedor');
  
  htmlUnsetClass('d-none', 'divListaProveedores');
  htmlSetClass('d-flex', 'divListaProveedores');
  
  htmlUnsetClass('d-none', 'divBotonCrear');
  htmlSetClass('d-flex', 'divBotonCrear');
}

function crearCardProveedor(proveedor){
  let transacciones = store.getObject().transaccionesEntidad(proveedor.getCodigo(), Entidad.PROVEEDOR);
  let num = transacciones.length;
  let color = (num > 0) ? 'orange' : 'gray';
  
  let html = `<div class="card">
          <div class="card-header d-flex">
            <div>
             <a class="btn btn-link" data-toggle="collapse" data-parent="#accordion-start" href="#collapse-${proveedor.getCodigo()}">
               <span class="fas fa-angle-down mr-3"></span> ${proveedor.getNombre().toUpperCase()}
             </a>
            </div>
            <div class="d-block ml-auto">
              <button style="margin: 4px 1px; background: ${color};" type="button" class="btn btn-info btn-sm check-asi" id="btn-check-${proveedor.getCodigo()}">
                ${num}
              </button>
              <button style="margin: 4px 1px" type="button" class="btn btn-info btn-sm modify-asi" id="btn-modify-${proveedor.getCodigo()}" data-toggle="modal" data-target="#exampleModalCenter">
                <i class="fas fa-edit" aria-hidden="true"></i>
              </button>
              <button type="button" class="btn btn-danger btn-sm delete-asi" id="btn-delete-${proveedor.getCodigo()}">
                <i class="fas fa-trash-alt" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div id="collapse-${proveedor.getCodigo()}" class="collapse in">
            <div class="card-body">
              ${obtenerDetallesProveedor(proveedor)}
            </div>
            <div class="card-footer d-flex justify-content-center">
              <button class="btn btn-info cons-asi" id="btn-cons-${proveedor.getCodigo()}">Consultar Historial</button>
            </div>
          </div>
        </div>`;
  return html;
}

function obtenerDetallesProveedor(proveedor){
  let tableHeader = new Header([], new HeaderProperties());
  
  let data = proveedor.toArray();
  let tableBody = new Body(data, new BodyProperties());
  
  let tableFooter = new Footer([], new FooterProperties());
  
  let propsTable = new TableProperties();
  propsTable.addPropMain("class","table")
  let table = new Table("DetallesProveedor", tableHeader, tableBody, tableFooter, propsTable);
  
  let html = `<div class="table-responsive">`;
  html += table.getHtml();
  html += `</div>`;
  
  return html;
}

/*FIN LISTA DE PROVEEDORES*/

/*CREAR NUEVO*/

function crearNuevo(){
  let inputsValues = collectInputs(obtenerInputsIds());
  
  if(nonEmptyFields([inputsValues[0],inputsValues[1]])){
    let entidad = Entidad.fromArray(inputsValues);
    entidad.setTipo(Entidad.PROVEEDOR);
    guardarEntidad(entidad);
    mostrarListaProveedores();
  }
}

/*FIN CREAR NUEVO*/

/*EDITAR*/

function mostrarDatosProveedor(proveedor){
  let datos = [obtenerInputsIds(),proveedor.fieldsToArray()];
  fillFields(datos);
  htmlValue('inputEditar', 'EDICION');
  htmlDisable('txtCodigo');
  htmlDisable('btnAgregarNuevo', false);
}

/*FIN EDITAR*/

/*FUNCIONES DE BOTONES*/
function limpiarControles(){
  clearControls(obtenerInputsIds());
  htmlValue('inputEditar', 'CREACION');
  htmlDisable('txtCodigo', false);
  htmlDisable('btnAgregarNuevo', true);
  htmlText('txtCodigoError', '');
  htmlText('txtNombreError', '');
}

/*funciones de controles*/
function habilitarBotonGuardar(){
  let inputs = collectInputs(['txtCodigo','txtNombre']);
  let response = inputs.filter(input => input.trim() == "");
  
  let busqueda = null;
  if(htmlValue('inputEditar') == "CREACION"){
    busqueda = store.getObject().buscarEntidad(inputs[0], Entidad.PROVEEDOR);
    let msg01 = "Este código ya está registrado";
    htmlText('txtCodigoError', (busqueda != null) ? msg01 : '');
  }
  
  let disabled = (response.length > 0) || (busqueda != null);
  htmlDisable('btnAgregarNuevo', disabled);
}

jQuery(document).ready(function($) {
    'use strict';
    htmlEventListener('btnAgregarNuevo','click',crearNuevo);
    htmlEventListener('btnAbrirModal','click',limpiarControles);
    
    /*para habilitar el boton guardar*/
    htmlEventListener('txtCodigo', 'keyup', habilitarBotonGuardar);
    htmlEventListener('txtNombre', 'keyup', habilitarBotonGuardar);
    htmlEventListener('btnRetornar', 'click', retornar);
    
    mostrarListaProveedores();
});
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

function obtenerClientes(){
  let entidades = obtenerEntidades();
  let clientes = entidades.filter(entidad => entidad.getTipo() == Entidad.CLIENTE);
  return clientes;
}

function guardarEntidad(entidad){
  if(htmlValue('inputEditar') == "EDICION"){
    let nuevaEntidad = store.getObject().buscarEntidad(entidad.getCodigo(), Entidad.CLIENTE);
    if(nuevaEntidad != null){
      nuevaEntidad.copyFromObject(entidad);
      store.save();
    }
  }else{
    let busqueda = store.getObject().buscarEntidad(entidad.getCodigo(), Entidad.CLIENTE);
    if(busqueda == null){
      store.getObject().getEntidades().push(entidad);
      store.save();
    }
  }
}

function eliminarEntidad(codigo){
  let entidades = obtenerEntidades();
  let entidadesRestantes = entidades.filter(entidad => entidad.getCodigo() != codigo);
  store.getObject().setEntidades(entidadesRestantes);
  store.save();
}

/*FIN FUNCIONES PRINCIPALES*/

/*FUNCIONES CONSTANTES DE LA PAGINA*/
function obtenerInputsIds(){
  return ['txtCodigo', 'txtNombre', 'txtDireccion', 'txtTelefono', 'txtEmail', 'txtDescripcion'];
}
/*FIN FUNCIONES CONSTANTES DE LA PAGINA*/

/*LISTA DE Clientes*/
function mostrarListaClientes(){
  reloadStore();
  let clientes = obtenerClientes();
  
  let html = ``;
  for(let cliente of clientes){
    html += crearCardCliente(cliente);
  }
  htmlRender('divClientes', html);
  
  //eliminar y editar
  document.querySelectorAll('.delete-asi').forEach(item => {
    item.addEventListener('click', event => {
      let res = item.id.split("-");
      eliminarEntidad(res[2]);
      mostrarListaClientes();
    })
  });
  
  document.querySelectorAll('.modify-asi').forEach(item => {
    item.addEventListener('click', event => {
      let res = item.id.split("-");
      let entidad = store.getObject().buscarEntidad(res[2], Entidad.CLIENTE);
      if(entidad != null){
        mostrarDatosCliente(entidad);
        htmlValue('inputEditar', 'EDICION');
      }
    })
  });
}

function crearCardCliente(cliente){
  let html = `<div class="card">
          <div class="card-header d-flex">
            <div>
             <a class="btn btn-link" data-toggle="collapse" data-parent="#accordion-start" href="#collapse-${cliente.getCodigo()}">
               <span class="fas fa-angle-down mr-3"></span> ${cliente.getNombre().toUpperCase()}
             </a>
            </div>
            <div class="d-block ml-auto">
              <button style="margin: 4px 1px" type="button" class="btn btn-info btn-sm modify-asi" id="btn-modify-${cliente.getCodigo()}" data-toggle="modal" data-target="#exampleModalCenter">
                <i class="fas fa-edit" aria-hidden="true"></i>
              </button>
              <button type="button" class="btn btn-danger btn-sm delete-asi" id="btn-delete-${cliente.getCodigo()}">
                <i class="fas fa-trash-alt" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div id="collapse-${cliente.getCodigo()}" class="collapse in">
            <div class="card-body">
              ${obtenerDetallesCliente(cliente)}
            </div>
            <div class="card-footer d-flex justify-content-center">
              <button class="btn btn-info">Consultar Historial</button>
            </div>
          </div>
        </div>`;
  return html;
}

function obtenerDetallesCliente(cliente){
  let tableHeader = new Header([], new HeaderProperties());
  
  let data = cliente.toArray();
  let tableBody = new Body(data, new BodyProperties());
  
  let tableFooter = new Footer([], new FooterProperties());
  
  let propsTable = new TableProperties();
  propsTable.addPropMain("class","table")
  let table = new Table("DetallesCliente", tableHeader, tableBody, tableFooter, propsTable);
  
  let html = `<div class="table-responsive">`;
  html += table.getHtml();
  html += `</div>`;
  
  return html;
}

/*FIN LISTA DE Clientes*/

/*CREAR NUEVO*/

function crearNuevo(){
  let inputsValues = collectInputs(obtenerInputsIds());
  
  if(nonEmptyFields([inputsValues[0],inputsValues[1]])){
    let entidad = Entidad.fromArray(inputsValues);
    entidad.setTipo(Entidad.CLIENTE);
    guardarEntidad(entidad);
    mostrarListaClientes();
  }
}

/*FIN CREAR NUEVO*/

/*EDITAR*/

function mostrarDatosCliente(cliente){
  let datos = [obtenerInputsIds(),cliente.fieldsToArray()];
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
  htmlText('txtCodigoError', '* Este campo es obligatorio');
  htmlText('txtNombreError', '* Este campo es obligatorio');
}

/*funciones de controles*/
function habilitarBotonGuardar(){
  let inputs = collectInputs(['txtCodigo','txtNombre']);
  let response = inputs.filter(input => input == "");
  
  let busqueda = null;
  if(htmlValue('inputEditar') == "CREACION"){
    busqueda = store.getObject().buscarEntidad(inputs[0], Entidad.CLIENTE);
    let msg01 = "Este código ya está registrado";
    let msg02 = "* Este campo es obligatorio";
    htmlText('txtCodigoError', (busqueda != null) ? msg01 : msg02);
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
    
    mostrarListaClientes();
});
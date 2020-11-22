import { Storage } from '../storage/Storage.js';

let session = Storage.getSessionData();
let store = null;

function refreshStore(){
  store = Storage.getInstance(session.getObject().empresa);
}
function mostrarTimeline(){
  let resultHtml = `<section class="cd-timeline js-cd-timeline"><div class="cd-timeline__container">`;
  
  let asientos = store.getObject().getLibroDiario().getAsientos();
  agregarNombreEmpresa(store.getObject().getConfig().empresa.nombreComercial);
  
  if(asientos.length > 0){
    let fecha01 = asientos[0].getFechaString();
    let fecha02 = asientos[asientos.length - 1].getFechaString();
    document.getElementById("txtDaterange").value = `${fecha01} - ${fecha02}`;
    for(let asiento of asientos){
      let enlace = (Number(asiento.getTipo()) == 1) ? "simple.html" : "compuesto.html";
      let msg = (Number(asiento.getTipo()) == 1) ? "Ver asientos simples" : "Ver asientos compuestos";
      resultHtml += `
       <div class="cd-timeline__block js-cd-block">
          <div class="cd-timeline__img cd-timeline__img--picture js-cd-img">
              <img src="assets/vendor/timeline/img/notas.svg" alt="Picture">
          </div>
          <!-- cd-timeline__img -->
          <div class="cd-timeline__content js-cd-content">
              <h3>${asiento.getConcepto()}</h3>
              <p>${asiento.getComentarios()}</p>
              <a href="${enlace}" class="btn btn-primary btn-lg">${msg}</a>
              <span class="cd-timeline__date">${asiento.getFechaString()}</span>
          </div>
          <!-- cd-timeline__content -->
      </div>
      `;
    }
    resultHtml += ` </div></section>`;
  }else{
    resultHtml = `<h5 class="mb-0 text-center">No hay asientos registrados</h5>`;
  }
  
  document.getElementById("timelineContainer").innerHTML = resultHtml;
}

jQuery(document).ready(function($) {
    'use strict';
    
    refreshStore();
    mostrarTimeline();
});
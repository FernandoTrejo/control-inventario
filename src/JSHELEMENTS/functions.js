function htmlElement(id){
  return document.getElementById(id);
}

function htmlText(id, text = null){
  if(text != null){
    document.getElementById(id).innerText = text;
  }else{
    return document.getElementById(id).innerText;
  }
}

function htmlValue(id, value = null) {
  if (value != null) {
    document.getElementById(id).value = value;
  } else {
    return document.getElementById(id).value.trim();
  }
}

function htmlProperty(id, property, value = null){
  if (value != null) {
    //document.getElementById(id).property = value;
  } else {
    //return document.getElementById(id).property;
  }
}

function htmlDisable(id, value = true){
  document.getElementById(id).disabled = value;
}

function htmlEventListener(id, event, func){
  document.getElementById(id).addEventListener(event,func);
}

function htmlRender(id, html){
  document.getElementById(id).innerHTML = html;
}

function collectInputs(inputsIds){
  let inputs = inputsIds.map(id => htmlValue(id).trim());
  return inputs;
}

function clearControls(controlsIds){
  for(let id of controlsIds){
    htmlValue(id, '');
  }
}

function fillFields(data){
  let ids = data[0];
  let values = data[1];
  
  for(let i = 0; i < ids.length; i++){
    htmlValue(ids[i], values[i]);
  }
}
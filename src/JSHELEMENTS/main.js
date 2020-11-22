function enviar(){
  let valueInput = htmlValue("text");
  let textDiv = htmlText("div");
  
  htmlText("div",valueInput);
  htmlText("btnEnviar","Cambio")
  htmlValue("text", textDiv);
}

function render(){
  let list = ["manzanas","peras","mangos","piña","melon"];
  let html = createUnorderedList(list);
  htmlRender("newDiv", html);
}

htmlEventListener("btnEnviar","click",enviar);
htmlEventListener("btnRender","click",render);
class Datos{
  ordenarPorFecha(conjunto){
    return conjunto.sort(((a,b)=> a.getFecha() - b.getFecha()));
  }
  
  unificarDatos(conjunto){
    //unir los arrays en uno solo
    let resultado = [];
    for(let elemento of conjunto){
      resultado = resultado.concat(elemento);
    }
    return resultado;
  }
}

export {Datos};
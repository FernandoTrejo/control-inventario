class Datos{
  ordenarPorFecha(conjunto){
    return conjunto.sort(((a,b)=> a.getFecha().getTime() - b.getFecha().getTime()));
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
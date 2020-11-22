class Producto{
  constructor(codigo, nombre, unidad){
    this.codigo = codigo;
    this.nombre = nombre;
    this.unidad = unidad;
  }
  
  getCodigo(){
    return this.codigo;
  }
  
  getNombre(){
    return this.nombre;
  }
  
  getUnidad(){
    return this.unidad;
  }
}

export {Producto};
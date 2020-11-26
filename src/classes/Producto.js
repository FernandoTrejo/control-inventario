class Producto{
  constructor(codigo, nombre, unidad, descripcion){
    this.codigo = codigo;
    this.nombre = nombre;
    this.unidad = unidad;
    this.descripcion = descripcion;
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
  
  getDescripcion(){
    return this.descripcion;
  }
  
  setCodigo(codigo){
    this.codigo = codigo;
  }
  
  setNombre(nombre){
    this.nombre = nombre;
  }
  
  setUnidad(unidad){
    this.unidad = unidad;
  }
  
  setDescripcion(descripcion){
    this.descripcion = descripcion;
  }
  
  static fromArray(data){
    return new Producto(
      data[0],
      data[1],
      data[2],
      data[3]
    );
  }
  
  copyFromObject(producto){
    this.nombre = producto.getNombre();
    this.unidad = producto.getUnidad();
    this.descripcion = producto.getDescripcion();
  }
  
  toArray(){
    return [
      ['Código', this.codigo],
      ['Nombre', this.nombre],
      ['Unidad', this.unidad],
      ['Descripción', this.descripcion]
    ];
  }
  
  fieldsToArray(){
    return [
      this.codigo,
      this.nombre,
      this.unidad,
      this.descripcion
    ];
  }
}

export {Producto};
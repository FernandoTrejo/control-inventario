class Entidad{
  constructor(codigo, nombre, direccion, telefono, email, descripcion, tipo = null){
    this.codigo = codigo;
    this.nombre = nombre;
    this.direccion = direccion;
    this.telefono = telefono;
    this.email = email;
    this.descripcion = descripcion;
    this.tipo = tipo;
  }
  
  getCodigo(){
    return this.codigo;
  }
  
  getNombre(){
    return this.nombre;
  }
  
  getDireccion(){
    return this.direccion;
  }
  
  getTelefono(){
    return this.telefono;
  }
  
  getTipo(){
    return this.tipo;
  }
  
  getDescripcion(){
    return this.descripcion;
  }
  
  getEmail(){
    return this.email;
  }
  
  setCodigo(codigo){
    this.codigo = codigo;
  }
  
  setNombre(nombre){
    this.nombre = nombre;
  }
  
  setDireccion(direccion){
    this.direccion = direccion;
  }
  
  setTelefono(telefono){
    this.telefono = telefono;
  }
  
  setTipo(tipo){
    this.tipo = tipo;
  }
  
  setDescripcion(descripcion){
    this.descripcion = descripcion;
  }
  
  setEmail(email){
    this.email = email;
  }
  
  static get PROVEEDOR(){
    return 0;
  }
  
  static get CLIENTE(){
    return 1;
  }
  
  static fromArray(data){
    return new Entidad(
      data[0],
      data[1],
      data[2],
      data[3],
      data[4],
      data[5]
    );
  }
  
  copyFromObject(entidad){
    this.nombre = entidad.getNombre();
    this.direccion = entidad.getDireccion();
    this.telefono = entidad.getTelefono();
    this.email = entidad.getEmail();
    this.descripcion = entidad.getDescripcion();
  }
  
  toObject(){
    return {
      'Código': this.codigo,
      'Nombre': this.nombre,
      'Dirección': this.direccion,
      'Teléfono': this.telefono,
      'Email': this.email,
      'Descripción': this.descripcion
    };
  }
  
  toArray(){
    return [
      ['Código', this.codigo],
      ['Nombre', this.nombre],
      ['Dirección', this.direccion],
      ['Teléfono', this.telefono],
      ['Email', this.email],
      ['Descripción', this.descripcion]
    ];
  }
  
  fieldsToArray(){
    return [
      this.codigo,
      this.nombre,
      this.direccion,
      this.telefono,
      this.email,
      this.descripcion
    ];
  }
}

export {Entidad};
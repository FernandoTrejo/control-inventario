class Property{
  propExists(prop, obj){
    return obj.hasOwnProperty(prop);
  }
  
  addProperty(obj, prop, values){
    if(!Array.isArray(values)){
      values = [values];
    }
    
    if(this.propExists(prop, obj)){
      obj[prop] = obj[prop].concat(values);
    }else{
      obj[prop] = values;
    }
  }
}

export {Property};
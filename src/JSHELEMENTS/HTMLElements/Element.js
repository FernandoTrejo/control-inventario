class Element{
  constructor(props){
    this.props = props.getProperties();
    this.html = ``;
  }
  
  processProps(){
    let propSet = {};
    
    for(let section in this.props){
      propSet[section] = [];
      let propSection = this.props[section];
      for(let prop in propSection){
        propSet[section].push(`${prop}="${propSection[prop].join(' ')}"`);
      }
    }
    
    let res = {};
    for(let key in propSet){
      res[key] = propSet[key].join(' ');
    }
    
    return res;
  }
  
  getHtml(){
    return this.html;
  }
}

export {Element};
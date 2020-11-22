import {Property} from './Property.js';
import {Element} from './Element.js';

class Table extends Element{
  constructor(name, header, body, footer, props){
    super(props);
    this.name = name;
    this.header = header;
    this.body = body;
    this.footer = footer;

    let properties = this.processProps();
    this.createTable(properties);
  }
  
  createTable(properties){
    this.html = `<table ${properties.main}>`;
    
    this.html += this.header.getHtml();
    this.html += this.body.getHtml();
    this.html += this.footer.getHtml();
    
    this.html += `</table>`;
  }
}

class TableProperties extends Property{
  constructor(){
    super();
    this.props = {
      'main': {}
    };
  }
  
  addPropMain(prop, values){
    this.addProperty(this.props.main, prop, values);
  }
  
  getProperties(){
    return this.props;
  }
}

class Header extends Element{
  constructor(headers, props){
    super(props);
    this.headers = headers;
    
    let properties = this.processProps();
    this.create(properties);
  }
  
  create(properties){
    this.html += `<thead ${properties.main}><tr ${properties.row}>`;
    for(let header of this.headers){
      this.html += `<th ${properties.cols}>${header}</th>`;
    }
    this.html += `</tr></thead>`;
  }

}

class HeaderProperties extends Property{
  constructor(){
    super();
    this.props = {
      'main': {},
      'row': {},
      'cols': {}
    };
  }
  
  addPropMain(prop, values){
    this.addProperty(this.props.main, prop, values);
  }
  
  addPropRow(prop, values){
    this.addProperty(this.props.row, prop, values);
  }
  
  addPropCols(prop, values){
    this.addProperty(this.props.cols, prop, values);
  }
  
  getProperties(){
    return this.props;
  }
}

class Body extends Element{
  constructor(rows, props){
    super(props);
    this.rows = rows;
    
    let properties = this.processProps();
    this.create(properties);
  }
  
  create(properties){
    this.html += `<tbody ${properties.main}>`;
    for(let row of this.rows){
      this.html += `<tr ${properties.rows}>`;
      for(let field of row){
        this.html += `<td ${properties.cols}>${field}</td>`;
      }
      this.html += `</tr>`;
    }
    this.html += `</tbody>`;
  }
}

class BodyProperties extends Property{
  constructor(){
    super();
    this.props = {
      'main': {},
      'rows': {},
      'cols': {}
    };
  }
  
  addPropMain(prop, values){
    this.addProperty(this.props.main, prop, values);
  }
  
  addPropRows(prop, values){
    this.addProperty(this.props.rows, prop, values);
  }
  
  addPropCols(prop, values){
    this.addProperty(this.props.cols, prop, values);
  }
  
  getProperties(){
    return this.props;
  }
}

class Footer extends Element{
  constructor(row, props){
    super(props);
    this.row = row;
    
    let properties = this.processProps();
    this.create(properties);
  }
  
  create(properties){
    this.html += `<tfoot ${properties.main}><tr ${properties.row}>`;
    for(let col of this.row){
      this.html += `<td ${properties.cols}>${col}</td>`;
    }
    this.html += `</tr></tfoot>`;
  }
}

class FooterProperties extends Property{
  constructor(){
    super();
    this.props = {
      'main': {},
      'row': {},
      'cols': {}
    };
  }
  
  addPropMain(prop, values){
    this.addProperty(this.props.main, prop, values);
  }
  
  addPropRow(prop, values){
    this.addProperty(this.props.row, prop, values);
  }
  
  addPropCols(prop, values){
    this.addProperty(this.props.cols, prop, values);
  }
  
  getProperties(){
    return this.props;
  }
}

export {Table, TableProperties, Header, HeaderProperties, Body, BodyProperties, Footer, FooterProperties};
import {Property} from './Property.js';
import {Element} from './Element.js';

class List extends Element{
  constructor(tag, items, props){
    super(props);
    this.tag = tag;
    this.items = items;

    let properties = this.processProps();
    this.createList(properties);
  }
  
  createList(properties) {
    this.html = `<${this.tag} ${properties.main}>`;
    for (let item of this.items) {
      this.html += `<li ${properties.items}>${item}</li>`;
    }
    this.html += `</${this.tag}>`;
  }
  
  static get ORDERED(){
    return 0;
  }
  
  static get UNORDERED(){
    return 1;
  }
}

class OrderedList extends List{
  constructor(items, props){
    super("ol", items, props);
  }
  
  //Different types of lists
  static get DEFAULT(){
    return "1";
  }
  
  static get ALPH_LOW() {
    return "a";
  }
  
  static get ALPH_UPP() {
    return "A";
  }
  
  static get ROM_LOW() {
    return "i";
  }
  
  static get ROM_UPP() {
    return "I";
  }
}

class UnorderedList extends List{
  constructor(items, props) {
    super("ul", items, props);
  }
  
  //Different types of lists
  
  static get SQUARE() {
    return "square";
  }
  
  static get DISC() {
    return "disc";
  }
  
  static get CIRCLE() {
    return "circle";
  }//list-style-type: value;
  
  static get NONE() {
    return "none";
  }
}

/*class DescriptionList extends List{
  
}*/

class ListProperties extends Property{
  constructor(listType){
    super();
    this.listType = listType;
    this.props = {
      'main': {},
      'items': {}
    };
  }
  
  addPropMain(prop, values){
    if(this.listType == List.UNORDERED && prop.toLowerCase() == "type"){
      prop = "style";
      values = `list-style-type: ${values};`;
    }
    
    this.addProperty(this.props.main, prop, values);
  }
  
  addPropItems(prop, values){
    this.addProperty(this.props.items, prop, values);
  }
  
  getProperties(){
    return this.props;
  }
}

export {List, ListProperties, OrderedList, UnorderedList};
import {Storage} from '../storage/Storage.js';

let store = Storage.getSessionData();
let obj = store.getObject();
console.log(store);
console.log(obj);

if(!obj.is_auth){
  window.location.href = "inicio.html";
}

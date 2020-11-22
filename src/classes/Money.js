class Money{
  constructor(quantity, currency = '$'){
    this.completeQuantity = null;
    this.quantity = quantity;
    this.currency = currency;
    //console.log(quantity)
    if(this.isValid(quantity)){
      this.fix(quantity);
    }else{
      //console.log("error");
    }
  }
  
  isValid(quantity){
    return this.isNumber(quantity);
  }
  
  isNumber(quantity){
    return !isNaN(Number(quantity));
  }
  
  isPositive(){
    return Number(this.quantity) >= 0;
  }
  
  fix(quantity){
    this.completeQuantity = quantity;
    this.quantity = Number(quantity).toFixed(2);
  }
  
  get amount() {
    return this.quantity;
  }
  
  toString(){
    return Money.format(this.quantity, this.currency);
  }
  
  static format (quantity, currency) {
    let money = new Money(quantity);
    if(!money.isPositive()){
      let moneyFormatted = `(-) ${currency}${Math.abs(money.amount)}`;
      return moneyFormatted;
    }
    
    let moneyFormatted = `${currency}${money.amount}`;
    return moneyFormatted;
  }
  
  static calculateSum(collection){
    let result = 0;
    for(let val of collection){
      let money = new Money(val);
      result += Number(money.amount);
    }
    return new Money(result);
  }
  
  static calculateMoneySum(collection){
    let result = 0;
    for(let val of collection){
      result += Number(val.amount);
    }
    return new Money(result);
  }
  
  static calculateMoneySus(value1, value2){
    let result = Number(value1.amount) - Number(value2.amount);
    return new Money(result);
  }
  
  static calculateSus(value1, value2){
    let result = Number(value1) - Number(value2);
    console.log(value1,value2,result)
    return new Money(Number(result));
  }
  
  static calculateIva(monto, iva, ivaIncluded = false){
    let montoPrincipal = 0;
    let montoIva = 0;
    
    monto = Number(monto);
    iva = Number(iva);
    
    if(ivaIncluded){
      montoPrincipal = Number(monto / Number(1+Number(iva/100)));
      montoIva = Number(monto - montoPrincipal);
    }else{
      montoIva = Number(monto * Number(iva/100));
      montoPrincipal = Number(monto);
    }
    
    return {
      'principal': new Money(Number(montoPrincipal)),
      'iva': new Money(Number(montoIva))
    };
  }
  
  static multiply(collection){
    let result = 1;
    for(let value of collection){
      result *= Number(value);
    }
    return new Money(result);
  }
  
  static divide(num, den){
    if(Number(den) != 0){
      let result = Number(num) / Number(den);
      return new Money(result);
    }
  }
  
  static divideMoney(num, den){
    if(Number(den.quantity) != 0){
      let result = Number(num.quantity) / Number(den.quantity);
      return new Money(result);
    }
  }
}

export {Money};
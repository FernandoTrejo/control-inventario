let emptyString = "";

function nonEmptyFields(fields){
  let emptyFields = fields.filter(field => isEmpty(field));
  return (emptyFields.length == 0);
}

function isEmpty(field){
  return (field.trim() == emptyString);
}
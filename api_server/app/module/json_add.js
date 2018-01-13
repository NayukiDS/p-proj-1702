function jsonadd(obj, name, add_obj) {
    if(!obj[name]||typeof(obj[name])!=='object')return false;
    obj[name].push(add_obj);
    return obj;
}

module.exports = jsonadd;
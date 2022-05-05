const mongoIdRegex = /^[0-9a-fA-F]{24}$/

module.exports = validateMongoId = (value) => {
    if(value.match(mongoIdRegex)){
        return true;
    }else{
        return false;
    }
}
const validateXYCoords = (x, y) => {
    try{
        let isValid = true;
        if(!x || !y) isValid = false;

        if(isNaN(x) || isNaN(y)) isValid = false

        if(!(x.toString().length > 1 && x.toString().length < 4) ||
            !(y.toString().length > 1 && y.toString().length < 4)) isValid = false;

        return isValid;
    }catch(err){
        console.error('Error in validateXYCoords ', err.stack);
    }
}

export {
    validateXYCoords
}
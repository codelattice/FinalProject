const statesJSONData = require('../model/states');

const verifyState = (req, res, next) => {
    const stateAbbr = req.params.code.toUpperCase();
    const stateCodes = stateAbbr.map((st) => {
        return st.code
      });
    const isState = stateCodes.find(code => code === stateCode);

    if (isState){
      
      next();

    }
    else if (!isState)
    
    {

    }
}

module.exports = verifyState

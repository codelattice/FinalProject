const State = require('../model/State');

//const data = require('../model/statesData.json');

const data = {};
data.stateJSON = require('../model/statesData.json');

const getAllStates = async (req, res) => {
    const states = await State.find();
    if (!states) return res.status(204).json({ 'message': 'No states found.' });
    res.json(data);
}


const getState= async (req, res) => {

    if (!req?.params?.stateCode) return res.status(400).json({ 'message': 'State code required.' });
    
    const stateCodez = data.stateJSON.map(st => ({ code: st.code}));

    const state = await State.findOne({ _id: req.params.stateCodez }).exec();
    if (!state) {
        return res.status(204).json({ "message": `No state matches code ${req.params.code}.` });
    }

    //const stateCodez = data.map(st => st.code);





    res.json(state);
}

module.exports = {
    getAllStates,
    getState
}
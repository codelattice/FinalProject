const State = require("../model/State");
const Funfact = require("../model/Funfact");

const jsonStateData = require("../model/statesData.json");

const data = {
  states: require("../model/statesData.json"),
  setStates: function (data) {
    this.states = data;
  },
};

const getAllStates = async (req, res) => {
  //const states = await State.find();
  //if (!states) return res.status(204).json({ 'message': 'No states found.' });
  const contig = req.query?.contig;

  let statesList = [];

  if (contig === "true") {
    //return the contig states
    statesList = jsonStateData.filter(
      (st) => st.code !== "AK" && st.code !== "HI"
    );
    res.json(statesList);
  } else if (contig === "false") {
    statesList = jsonStateData.filter(
      (st) => st.code === "AK" || st.code === "HI"
    );
    res.json(statesList);
  }

  res.json(jsonStateData);
};

const getState = (req, res) => {
  const state = data.states.find(
    (st) => st.code === req.params.state.toUpperCase()
  );
  if (!state) {
    return res
      .status(400)
      .json({ message: "Invalid state abbreviation parameter" });
  }
  res.json(state);
};

const getCapital = (req, res) => {
  const state = data.states.find(
    (state) => state.code === req.params.state.toUpperCase()
  );
  if (!state) {
    return res
      .status(400)
      .json({ message: "Invalid state abbreviation parameter" });
  }
  res.json({ state: `${state.state}`, capital: `${state.capital_city}` });
};

const getNickname = (req, res) => {
  const state = data.states.find(
    (state) => state.code === req.params.state.toUpperCase()
  );
  if (!state) {
    return res
      .status(400)
      .json({ message: "Invalid state abbreviation parameter" });
  }
  res.json({ state: `${state.state}`, nickname: `${state.nickname}` });
};

const getPopulation = (req, res) => {
  const state = data.states.find(
    (state) => state.code === req.params.state.toUpperCase()
  );
  if (!state) {
    return res
      .status(400)
      .json({ message: "Invalid state abbreviation parameter" });
  }

  let pop_string = state.population.toString();
  let result = pop_string.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  res.json({ state: `${state.state}`, population: `${result}` });
};

const getAdmission = (req, res) => {
  const state = data.states.find(
    (state) => state.code === req.params.state.toUpperCase()
  );
  if (!state) {
    return res
      .status(400)
      .json({ message: "Invalid state abbreviation parameter" });
  }
  res.json({ state: `${state.state}`, admitted: `${state.admission_date}` });
};

const getFunfact = (req, res) => {
  const state = data.states.find(
    (state) => state.code === req.params.state.toUpperCase()
  );
  if (!state) {
    return res
      .status(400)
      .json({ message: "Invalid state abbreviation parameter" });
  }

  var [fact_array] = [state.funfacts];

  if (fact_array === undefined) {
    return res.json({ message: "No Fun Facts found for " + `${state.state}` });
  } else {
    res.json({ funfact: `${state.funfacts}` });
  }
};

const postFunfact = async (req, res) => {
  
  if (!req.body.funfacts) {
    return res.status(400).json({ message: "State fun facts value required" });
  }

  if (!Array.isArray(req.body.funfacts)) {
    return res
      .status(400)
      .json({ message: "State fun facts value must be an array" });
  }

  const state = data.states.find(
    (state) => state.code === req.params.state.toUpperCase()
  );

  if (!state) {
    return res
      .status(400)
      .json({ message: "Invalid state abbreviation parameter" });
  }
  
  try {
    const result = await Funfact.create({
      stateCode: req.params.state,
      funfacts: req.params.funfact,
    });
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }

  /*if (!Funfact.findOne)//({ funfact: state.funfacts }).exec()) {
    try {
      const result = await Funfact.createOne({
        stateCode: req.params.state,
        funfacts: req.params.funfact,
      });
      res.status(201).json(result);
    } catch (err) {
      console.error(err);
  } else {
    try {
      const result = await Funfact.updateOne({
        stateCode: req.params.state,
        funfacts: req.params.funfacts,
      });
      res.status(201).json(result);
    } catch (err) {
      console.error(err);
    }
  }*/
};


const patchFunfact = async (req, res) => {
  if (!req?.body?.index) {
    return res
      .status(400)
      .json({ message: "State fun fact index value required" });
  }

  if (!req.body.funfacts) {
    return res.status(400).json({ message: "State fun fact value required" });
  }

  /*if (!req?.body?.state) {
      return res.status(400).json({ message: "State code required" });
    }*/

  const state = await Funfact.findOne({ stateCode: req.code }).exec();
  const stated = data.states.find(
    (state) => state.code === req.params.state.toUpperCase()
  );
  const stateJSON = jsonStateData.find((st) => st.code === req.code);

  var [fact_array] = [stated.funfacts];

  if (fact_array === undefined) {
    return res.json({ message: `No Fun Facts found for ${stated.state} ` });
  } else {
    let indice = req.body.index - 1;
    if (indice > state.funfacts.length)
      return res.status(400).json({
        message: `No Fun Fact found at that index for ${state.state}`,
      });

    state.funfacts[indice] = req.body.funfacts;

    const result = await state.save();
    res.json(result);
  }
};

const deleteFunfact = async (req, res) => {
  if (!req?.body?.index) {
    return res
      .status(400)
      .json({ message: "State fun fact index value required" });
  }
  if (!req?.body?.funfacts) {
    return res.status(400).json({ message: "State fun fact value required" });
  }

  /*if (!req?.body?.state) {
      return res.status(400).json({ message: "State code required" });
    }*/

  const state = await State.findOne({ stateCode: req.code }).exec();
  const stateJSON = jsonStateData.find((st) => st.code === req.code);

   var [fact_array] = [state.funfacts];

  if (fact_array === undefined) {
    return res.json({ message: `No Fun Facts found for ${state.state} ` });
  } else {
    let indice = req.body.index - 1;
    if (indice > state.funfacts.length)
      return res.status(400).json({
        message: `No Fun Fact found at that index for ${state.state}`,
      });
   
    state.funfacts[indice] = req.body.funfacts;

    const result = await state.save();
    res.json(result);
  };
}


module.exports = {
  getAllStates,
  getState,
  getCapital,
  getNickname,
  getPopulation,
  getAdmission,
  getFunfact,
  postFunfact,
  patchFunfact,
  deleteFunfact,
};

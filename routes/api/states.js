const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController.js'); //everything below this line needs to be scrutinized and modified

router.route('/')
    .get(statesController.getAllStates);
//    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployee)
//    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee)
//    .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

router.route('/:code') // '/:stateCode' <--- correct?
    .get(statesController.getState);

module.exports = router;
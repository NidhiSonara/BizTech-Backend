const express = require('express');
const router = express.Router();

const employeeRouter = require('./employee');

router.get('/', function (req, res) {
    res.send(`Welcome to Web Route!`);
});

router.use('/employee', employeeRouter);

module.exports = router;
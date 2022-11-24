const express = require('express');
const router = express.Router();


/* ---------- controllers ---------- */
const employeeController = require('../../controllers/web/employeeController')

router.get('/list', employeeController.listEmployees);
router.get('/deails-by-id', employeeController.getEmployeeByID)
router.post('/add', employeeController.addEmployee);
router.put('/update', employeeController.updateEmployee);
router.delete('/delete', employeeController.deleteEmployee)

module.exports = router;
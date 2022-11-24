const Joi = require('joi').extend(require('@joi/date'));
Joi.objectId = require('joi-objectid')(Joi);

const { WebController } = require('./webController');
const { status } = require('../../config/statuscode');

const EmployeeModel = require('../../models/tbl_employee');
const { EMPLOYEETYPE } = require('../../config/constants');


class EmployeeController extends WebController {

    constructor() {
        super();
    }

    /** ---------- List all Employee ----------
    * 
    * 
    * @return {Array} - It will return All Employee data.
    * 
    * ---------------------------------------- */

    listEmployees = async (req, res, next) => {

        try {

            EmployeeModel.find().exec().then((result) => {
                return res.status(status.success_code).json({
                    message: "Employee list fetched successfully.",
                    data: result
                })
            }).catch((err) => {
                console.log("🚀 ~ file: employeeController.js ~ line 34 ~ EmployeeController ~ EmployeeModel.find ~ err", err)
                return res.status(status.internal_server_error_code).json({
                    message: err.message
                })
            })
        } catch (err) {
            console.log("🚀 ~ file: employeeController.js ~ line 40 ~ EmployeeController ~ listEmployees= ~ err", err)
            return res.status(status.internal_server_error_code).json({
                message: "Something went wrong.",
            });
        }
    }


    /** ---------- Add Employee ----------
    * 
    * @param {String} firstName - First Name.
    * @param {String} lastName - Last Name.
    * @param {String} email - Email.
    * @param {String} image - image.
    * @param {String} employeeType - Employee Type.
    * @param {Date} dob - dob.
    * @param {Array} hobbies - hobbies.
    * 
    * 
    * @return {Object} - It will return Employee data.
    * 
    * ---------------------------------------- */

    addEmployee = async (req, res, next) => {

        try {
            const { body } = req;

            const validationSchema = Joi.object({
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string().required().email(),
                image: Joi.string().required(),
                employeeType: Joi.string().required().valid(...Object.values(EMPLOYEETYPE)),
                dob: Joi.date().format('YYYY-MM-DD').utc().required(),
                hobbies: Joi.array().required()
            });

            const { error, value } = validationSchema.validate(body);

            if (error) {
                console.log("🚀 ~ file: employeeController.js ~ line 50 ~ EmployeeController ~ addEmployee= ~ error", error)
                return res.status(status.bad_request_code).json({
                    message: error.message,
                })
            } else {

                let filter = {
                    email: value.email
                }

                EmployeeModel.findOne(filter)
                    .exec()
                    .then((user) => {
                        if (user) {
                            return res.status(status.conflict_code).json({
                                message: "Employee is already available on this email, please use another email."
                            })
                        } else {

                            let employee = new EmployeeModel(value)
                            employee.save().then((result) => {
                                return res.status(status.created_code).json({
                                    message: "Employee details added successfully.",
                                    // data: result
                                })
                            }).catch((err) => {
                                console.log("🚀 ~ file: employeeController.js ~ line 76 ~ EmployeeController ~ employee.save ~ err", err)
                                return res.status(status.internal_server_error_code).json({
                                    message: err.message
                                })
                            });

                        }
                    }).catch((err) => {
                        console.log("🚀 ~ file: employeeController.js ~ line 84 ~ EmployeeController ~ .then ~ err", err)
                        return res.status(status.internal_server_error_code).json({
                            message: err.message
                        })
                    })
            }
        } catch (err) {
            console.log("🚀 ~ file: employeeController.js ~ line 91 ~ EmployeeController ~ addEmployee= ~ err", err)
            return res.status(status.internal_server_error_code).json({
                message: "Something went wrong.",
            });
        }
    }

    /** ---------- Update Employee  ----------
    * 
    * @param {String} firstName - First Name.
    * @param {String} lastName - Last Name.
    * @param {String} image - image.
    * @param {String} employeeType - Employee Type.
    * @param {Date} dob - dob.
    * @param {Array} hobbies - hobbies.
    * 
    * @return {Object} - It will give us Employeed details after update.
    * 
    * ---------------------------------------- */

    updateEmployee = (req, res, next) => {

        try {
            const { body } = req;

            const validationSchema = Joi.object({
                _id: Joi.objectId().required(),
                firstName: Joi.string().optional(),
                lastName: Joi.string().optional(),
                email: Joi.string().optional().email(),
                image: Joi.string().optional(),
                employeeType: Joi.string().optional().valid(...Object.values(EMPLOYEETYPE)),
                dob: Joi.date().format('YYYY-MM-DD').utc().optional(),
                hobbies: Joi.array().optional()
            });
            const { error, value } = validationSchema.validate(body);

            if (error) {
                return res.status(status.bad_request_code).json({
                    message: error.message,
                })
            } else {

                EmployeeModel.findByIdAndUpdate(value._id, {
                    ...value
                }, { new: true })
                    // .select(["firstName", "lastName", "email", "registrationType"])
                    .exec().then((result) => {
                        if (result) {
                            return res.status(status.success_code).json({
                                message: "Employee details updated successfully.",
                                data: result
                            })
                        } else {
                            return res.status(status.not_found_code).json({
                                message: "No Employee available for given id."
                            })
                        }
                    }).catch((err) => {
                        console.log("🚀 ~ file: employeeController.js ~ line 151 ~ EmployeeController ~ .exec ~ err", err)
                        return res.status(status.internal_server_error_code).json({
                            message: err.message
                        })
                    })
            }

        } catch (err) {
            console.log("🚀 ~ file: employeeController.js ~ line 159 ~ EmployeeController ~ err", err)
            return res.status(status.internal_server_error_code).json({
                message: "Something went wrong.",
            });
        }
    }

    /** ---------- Get Employee By ID  ----------
    * 
    * @param {objectId} _id - Employee ID.
    * 
    * @return {Object} - It will give us Employee details.
    * 
    * ---------------------------------------- */

    getEmployeeByID = (req, res, next) => {

        try {

            const { query } = req;

            const validationSchema = Joi.object({
                _id: Joi.objectId().required()
            });
            const { error, value } = validationSchema.validate(query);

            if (error) {
                return res.status(status.bad_request_code).json({
                    message: error.message,
                })
            } else {
                EmployeeModel.findById(value._id)
                    .select(["_id", "firstName", "lastName", "email", "image", "employeeType", "dob", "hobbies"])
                    .exec()
                    .then((result) => {
                        if (result) {
                            return res.status(status.success_code).json({
                                message: "Employee details fetched successfully",
                                data: result
                            })
                        } else {
                            return res.status(status.not_found_code).json({
                                message: "No Employee available for given id."
                            })
                        }
                    }).catch((err) => {
                        console.log("🚀 ~ file: employeeController.js ~ line 235 ~ EmployeeController ~ .then ~ err", err)
                        return res.status(status.internal_server_error_code).json({
                            message: err.message
                        })
                    })
            }
        } catch (err) {
            console.log("🚀 ~ file: employeeController.js ~ line 242 ~ EmployeeController ~ err", err)
            return res.status(status.internal_server_error_code).json({
                message: "Something went wrong.",
            });
        }
    }



    /** ---------- Delete Task Type ----------
    * 
    * @param {objectId} _id - Task Type ID.
    * 
    * @return {Object} - It will give us success details after delete.
    * 
    * ---------------------------------------- */

    deleteEmployee = (req, res, next) => {
        try {
            const { query } = req;

            const validationSchema = Joi.object({
                _id: Joi.objectId().required()
            });
            const { error, value } = validationSchema.validate(query);

            if (error) {
                return res.status(status.bad_request_code).json({
                    message: error.message,
                })
            } else {
                EmployeeModel.findById(value._id)
                    .exec()
                    .then((result) => {
                        if (result) {
                            EmployeeModel.deleteById(value._id).exec().then((result) => {
                                if (result) {
                                    return res.status(status.success_code).json({
                                        message: "Employee details deleted successfully.",
                                        data: result
                                    })
                                } else {
                                    return res.status(status.not_found_code).json({
                                        message: "No Employee details available for given id."
                                    })
                                }
                            }).catch((err) => {
                                console.log("🚀 ~ file: employeeController.js ~ line 289 ~ EmployeeController ~ EmployeeModel.deleteById ~ err", err)
                                return res.status(status.internal_server_error_code).json({
                                    message: err.message
                                })
                            })
                        } else {
                            return res.status(status.not_found_code).json({
                                message: "No Employee available for given id."
                            })
                        }
                    }).catch((err) => {
                        console.log("🚀 ~ file: employeeController.js ~ line 300 ~ EmployeeController ~ .then ~ err", err)
                        return res.status(status.internal_server_error_code).json({
                            message: err.message
                        })
                    })
            }
        } catch (err) {
            console.log("🚀 ~ file: employeeController.js ~ line 307 ~ EmployeeController ~ deleteEmployee ~ err", err)
            return res.status(status.internal_server_error_code).json({
                message: "Something went wrong.",
            });
        }
    }
}

module.exports = new EmployeeController();
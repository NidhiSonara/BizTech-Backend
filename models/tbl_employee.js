const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { EMPLOYEETYPE } = require('../config/constants');

const employeeSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            require: true
        },
        lastName: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true,
            unique: true
        },
        image: {
            type: String,
            require: true
        },
        employeeType: {
            type: String,
            enum: Object.values(EMPLOYEETYPE),
            require: true
        },
        dob: {
            type: Date,
            require: true
        },
        hobbies: {
            type: Array,
            require: true
        }
    },
    {
        timestamps: true,
    }
)

employeeSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: true,
});

module.exports = mongoose.model('tbl_employee', employeeSchema)
// schema.js
const Joi = require("joi");

module.exports.expenseSchema = Joi.object({
    expense: Joi.object({
        title: Joi.string().required(),
        amount: Joi.number().required().min(0),
        category: Joi.string().required(),
        note: Joi.string().allow("", null),
    }).required()
});
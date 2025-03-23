const { expenseSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.validateExpense = (req, res, next) => {
    const { error } = expenseSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
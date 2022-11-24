const { status } = require('../config/statuscode')

const webApiRouter = require("./web");


module.exports = app => {

    app.get('/', function (req, res) {
        res.send(`Welcome to Biztech!`);
    });

    app.use("/web", webApiRouter);

    app.use((req, res, next) => {
        const error = new Error('Sorry, this is an invalid Api')
        error.status = status.not_found_code
        next(error)
    })

    app.use((error, req, res, next) => {
        res.status(error.status || status.internal_server_error_code)
        res.json({
            message: error.message,
        })
    })
}
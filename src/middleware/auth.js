const auth = (req, res, next) => {
    console.log("middleware is called");
    next();
}

module.exports = {auth};
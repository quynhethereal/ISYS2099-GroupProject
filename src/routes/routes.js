
module.exports = app => {
    const users = require("../controllers/user.controller.js");
    const auth = require("../controllers/auth.controller.js");
    const products = require("../controllers/product.controller.js");
    const authMiddleware = require('../middlewares/auth.middleware');

    let router = require("express").Router();
    // authenticate a user
    router.post("/auth", auth.authenticate);


    // get a user by username and password
    router.post("/user", users.findByUsernamePassword);

    router.get("/user", authMiddleware.verifyToken, users.findAll);

    // product-related API
    router.get("/category/:id/products", authMiddleware.verifyToken, products.findAllByCategory);
    router.put("/product/:id", authMiddleware.verifyToken, products.update);

    app.use('/api', router);
}
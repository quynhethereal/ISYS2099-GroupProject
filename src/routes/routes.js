const multer = require("multer");
const path = require('path');

module.exports = app => {
    //Set Storage Engine
    const storage = multer.diskStorage({
        destination: './public/uploads/images',
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() +
                path.extname(file.originalname));
        }
    });
    const upload = multer({ storage: storage, limits: { fieldSize: 10 * 1024 * 1024 } }); //10MB
    const users = require("../controllers/user.controller.js");
    const auth = require("../controllers/auth.controller.js");
    const products = require("../controllers/product.controller.js");
    const orders = require("../controllers/order.controller.js");
    const authMiddleware = require('../middlewares/auth.middleware');

    let router = require("express").Router();
    // authenticate a user
    router.post("/auth", auth.authenticate);


    // get a user by username and password
    router.post("/user", users.findByUsernamePassword);

    // TODO: dummy route for testing
    router.get("/user", authMiddleware.verifyToken, users.findAll);

    // product-related API
    router.get("/category/:id/products", authMiddleware.verifyToken, products.findAllByCategory);
    router.put("/product/:id", authMiddleware.verifyToken, products.update);
    router.post("/product/:id/image", upload.single('productImage'), authMiddleware.verifyToken, products.updateImage);

    // order-related API
    router.post("/order", authMiddleware.verifyToken, orders.createOrder);

    // ---- view all orders of a user ----
    router.get("/order", authMiddleware.verifyToken, orders.getAllOrders);
    // ---- view a specific order of a user ----
    router.get("/order/:id", authMiddleware.verifyToken, orders.getOrder);
    // ---- accept an order ----
    router.put("/order/:id/accept", authMiddleware.verifyToken, orders.acceptOrder);

    app.use('/api', router);
}

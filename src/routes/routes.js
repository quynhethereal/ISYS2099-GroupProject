const multer = require("multer");
const path = require('path');
const inventories = require("../controllers/inventory.controller");
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
const warehouses = require("../controllers/warehouse.controller.js");
const authMiddleware = require('../middlewares/auth.middleware');
const categories = require('../controllers/category.controller');
const attributes = require('../controllers/product_attributes.controller');

module.exports = app => {
    let router = require("express").Router();
    // authenticate a user
    router.post("/auth", auth.authenticate);

    // get a user by username and password
    router.post("/user", users.findByUsernamePassword);

    router.get("/user", authMiddleware.verifyToken, users.findAll);

    // product-related API
    router.get("/products", products.findAll);
    router.get("/category/:id/products", products.findAllByCategory);
    router.get("/product/:id", products.findById);
    router.put("/product/:id", authMiddleware.verifyToken, products.update);
    router.post("/product/:id/image", upload.single('productImage'), authMiddleware.verifyToken, products.updateImage);
    router.get("/product/:id/image", products.getImage);
    router.get("/seller/products", authMiddleware.verifyToken, products.findBySellerId);
    router.get("/products/price-range", products.findAllByPriceRange);
    router.get("/products/search", products.findAllByKey);
    router.delete("/product/:id", authMiddleware.verifyToken, products.delete);
    router.post("/product", authMiddleware.verifyToken, products.create);


    // order-related API
    router.post("/order", authMiddleware.verifyToken, orders.createOrder);

    // ---- view all orders of a user ----
    router.get("/order", authMiddleware.verifyToken, orders.getAllOrders);
    // ---- view a specific order of a user ----
    router.get("/order/:id", authMiddleware.verifyToken, orders.getOrder);
    // ---- accept an order ----
    router.put("/order/:id/accept", authMiddleware.verifyToken, orders.acceptOrder);
    // ---- reject an order ----
    router.put("/order/:id/reject", authMiddleware.verifyToken, orders.rejectOrder);

    // warehouse-related API
    router.post("/warehouses", authMiddleware.verifyToken, warehouses.create);
    router.get("/warehouses", authMiddleware.verifyToken, warehouses.findAll);
    router.get("/warehouses/:id", authMiddleware.verifyToken, warehouses.findById);
    router.delete("/warehouses/:id", authMiddleware.verifyToken, warehouses.delete);
    router.put("/warehouses/:id", authMiddleware.verifyToken, warehouses.update);

    // inventory-related API
    router.get("/warehouses/:id/inventory", authMiddleware.verifyToken, warehouses.getInventoryByWarehouseId);
    router.get("/inventories", authMiddleware.verifyToken, inventories.getAll);
    router.post("/inventories/move", authMiddleware.verifyToken, inventories.moveInventory);
    router.put("/product/:id/quantity", authMiddleware.verifyToken, inventories.updateInventory);
    router.get("/inventories/pending", authMiddleware.verifyToken, inventories.getPendingInventory);
    router.get("/product/:id/inventory", authMiddleware.verifyToken, inventories.getInventoryByProductId);

    // category api
    router.post("/category", authMiddleware.verifyToken, categories.createCategory);
    router.put("/category/:id/subcategory", authMiddleware.verifyToken, categories.createSubcategory);
    router.put("/category/:id", authMiddleware.verifyToken, categories.updateCategory);
    router.get("/category/seller", categories.findFlattenCategory);
    router.get("/category", categories.findAll);
    router.get("/category/:id", categories.findOne);
    router.get("/category/:id/attributes", categories.findAttributes);
    router.delete("/category/:id", authMiddleware.verifyToken, categories.deleteCategory);
    router.put("/category/:id/subcategory/delete", authMiddleware.verifyToken, categories.deleteSubcategory);

    // product attributes 
    router.get("/attributes", attributes.findAll);
    router.get("/attributes/product/:id", attributes.findByProductId);

    app.use('/api', router);
}

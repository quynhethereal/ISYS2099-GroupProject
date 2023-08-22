const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema ({
    id: {
        type: Number, 
        required: true, 
        unique: true
    },
    name: {
        type: String, 
        required: true,
        unique: true
    },
    attributes: [String],
    parent: Number
}, {autoIndex: false});

const Category = mongoose.model('Category', CategorySchema);

// Drop if collection is existed to restructure when needed
// Category.collection.drop(); 

Category.find({})
.then((documents) => {
    if (documents.length == 0) {
        Category.insertMany([
            {id: 1, name: 'Clothing and Accessories'},
            {id: 2, name: 'Electronics and Gadgets'},
            {id: 3, name: 'Home and Kitchen Appliances'},
            {id: 4, name: 'Beauty and Personal Care'},
            {id: 5, name: 'Books, Music, and Movies'},
            {id: 6, name: 'Sports and Fitness Equipment'},
            {id: 7, name: 'Toys and Games'},
            {id: 8, name: 'Furniture and Home Decor'},
            {id: 9, name: 'Groceries and Food Items'},
            {id: 10, name: 'Health and Wellness Products'},
            {id: 11, name: 'Automotive and Car Accessories'},
            {id: 12, name: 'Office Supplies and Stationery'},
            {id: 13, name: 'Pet Supplies'},
            {id: 14, name: 'Outdoor and Camping Gear'},
            {id: 15, name: 'Jewelry and Watches'},
            {id: 16, name: 'Baby and Kids Products'},
            {id: 17, name: 'Crafts and DIY Supplies'},
            {id: 18, name: 'Party and Event Supplies'},
            {id: 19, name: 'Travel and Luggage'},
            {id: 20, name: 'Gifts and Novelty Items'}
        ]);
    }
})
.catch((error) => {
    console.error('Error fetching documents:', error);
});

module.exports = mongoose.model('Category', CategorySchema);
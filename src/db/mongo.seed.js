const {Category, Sequence} = require('../models/category.model');
const { generateMany } = require('./mongo.helper');

exports.dropCollection = async () => {
    try {
        await Category.collection.drop();
        await Sequence.collection.drop();
        console.log('Categories collection dropped');
    } catch (err) {
        console.error('Error dropping categories collection:', err);
        throw err;
    }
}

exports.generateSeedData  = async (count) => {
    try {
        const count = await Category.countDocuments();

        if (count === 0) {
            Category.insertMany(await generateMany(5))
                .then((result) => {
                    console.log(`Categories saved to MongoDB`);
                })
                .catch((error) => {
                    console.log(`Categories could not save to MongoDB`, error);
                });
        }
    } catch (err) {
        console.error('Error generating seed data:', err);
        throw err;
    }
}
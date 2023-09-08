const {Category, Sequence} = require('../models/category.model');
const {ProductAttributes} = require('../models/product_attributes.model');

const data = [
    {
        id: 1,
        name: "Electronic Devices",
        subcategoriesArray: [2, 30, 4, 29, 6],
        subcategoriesNameArray: [
            "Phones and tablets",
            "Phones",
            "Tablets",
            "Laptops",
            "Gaming Laptops"
        ],
        subcategories: [
            {
                id: 2, 
                parentId: 1,
                name: "Phones and tablets",
                subcategories: [
                    {
                    id: 30, 
                    parentId: 2,
                    name: "Phones",
                    subcategories: [],
                    attributes: [
                        {
                            name: "Series",
                            type: "string",
                            required: false
                        },
                        {
                            name: "Functionality",
                            type: "string",
                            required: false
                        }
                    ]
                    },
                    {
                        id: 6, 
                        parentId: 2,
                        name: "Tablets",
                        subcategories: [],
                        attributes: [
                            {
                                name: "Compatibility",
                                type: "string",
                                required: false
                            }
                        ]
                    }
                ],
                attributes: [
                    {
                        name: "Waterproof level",
                        type: "string", 
                        required: true
                    },
                    {
                        name: "Bluetooth connection",
                        type: "number",
                        required: true
                    }
                ]
            },
            {
                id: 4, 
                parentId: 1,
                name: "Laptops",
                subcategories: [
                    {
                        id: 29, 
                        parentId: 4,
                        name: "Gaming Laptops",
                        subcategories: [],
                        attributes: [
                            {
                                name: "Weight",
                                type: "number",
                                required: true
                            },
                            {
                                name: "Graphics card",
                                type: "string", 
                                required: false
                            }
                        ]
                    }
                ],
                attributes: [
                    {
                        name: "Size",
                        type: "number",
                        required: true
                    },
                    {
                        name: "Screen",
                        type: "string",
                        required: true
                    },
                    {
                        name: "Official version",
                        type: "number",
                        type: true
                    }
                ]
            }
        ],
        attributes: [
            {
                name: "Connection type",
                type: "string",
                required: true
            },
            {
                name: "Brand",
                type: "string",
                required: true
            }
        ]
    },
    {
        id: 7,
        name: "Electronic Accessories",
        subcategoriesArray: [8,9,10,11,12],
        subcategoriesNameArray: [
            "Mobile Accessories",
            "Power Bank",
            "Network Components",
            "Drone Accessories",
            "Drone bags and cases"
        ],
        subcategories: [
            {
                id: 8, 
                parentId: 7,
                name: "Mobile Accessories",
                subcategories: [
                    {
                    id: 9, 
                    parentId: 8,
                    name: "Power Bank",
                    subcategories: [],
                    attributes: [
                        {
                            name: "Storage Size",
                            type: "number",
                            required: true
                        }
                    ]
                    },
                    {
                        id: 10, 
                        parentId: 8,
                        name: "Network Components",
                        subcategories: [],
                        attributes: [
                            {
                                name: "Router type",
                                type: "string",
                                required: false
                            },
                            {
                                name: "Modern",
                                type: "string",
                                required: false
                            }
                        ]
                    }
                ],
                attributes: [
                    {
                        name: "Color",
                        type: "string",
                        required: false
                    }
                ]
            },
            {
                id: 11, 
                parentId: 7,
                name: "Drone Accessories",
                subcategories: [{
                    id: 12, 
                    parentId: 11,
                    name: "Drone bags and cases",
                    subcategories: [],
                    attributes: [
                        {
                            name: "Waterproof level",
                            type: "number",
                            required: true
                        },
                        {
                            name: "Size",
                            type: "string",
                            required: true
                        }
                    ]
                }],
                attributes: [
                    {
                        name: "Flight distance",
                        type: "number",
                        required: false
                    },
                    {
                        name: "Battery hour",
                        type: "number",
                        required: true
                    }
                ]
            }
        ],
        attributes: [
            {
                name: "Connection Type",
                type: "string",
                required: true
            },
            {
                name: "Warranty",
                type: "string",
                required: false
            }
        ]
    },
    {
        id: 13,
        name: "TV & Home Appliances",
        subcategoriesArray: [14, 15, 16, 17, 18, 19],
        subcategoriesNameArray: [
            "Televisions & Videos",
            "Smart televisions",
            "TV appliances",
            "Large Appliances",
            "Air Conditioners",
            "Fridges and Freezers"
        ],
        subcategories: [
            {
                id: 14, 
                parentId: 13,
                name: "Televisions and Videos",
                subcategories: [
                    {
                    id: 15, 
                    parentId: 14,
                    name: "Smart televisions",
                    subcategories: [],
                    attributes: [
                        {
                            name: "TV Size",
                            type: "string",
                            required: true
                        },
                        {
                            name: "Functionality",
                            type: "string",
                            required: true
                        }
                    ]
                    },
                    {
                        id: 16, 
                        parentId: 14,
                        name: "TV appliances",
                        subcategories: [],
                        attributes: [
                            {
                                name: "Cooling function",
                                type: "string",
                                required: false
                            }
                        ]
                    }
                ],
                attributes: []
            },
            {
                id: 17, 
                parentId: 13,
                name: "Large Appliances",
                subcategories: [
                    {
                        id: 18, 
                        parentId: 17,
                        name: "Air Conditioners",
                        subcategories: [],
                        attributes: [
                            {
                                name: "Inventer",
                                type: "string",
                                required: false
                            }
                        ]
                    },
                    {
                        id: 19, 
                        parentId: 17,
                        name: "Fridges and Freezers",
                        subcategories: [],
                        attributes: [
                            {
                                name: "Inventer",
                                type: "string",
                                required: false
                            }
                        ]
                    }
                ],
                attributes: [
                    {
                        name: "Volumn",
                        type: "number",
                        required: true
                    }
                ]
            }
        ],
        attributes: [
            {
                name: "Compatibility",
                type: "string",
                required: false
            },
            {
                name: "Material",
                type: "string",
                required: true
            }
        ]
    },
    {
        id: 20,
        name: "Health & Beauty",
        subcategoriesArray: [21, 22, 23],
        subcategoriesNameArray: [
            "Skincare",
            "Body Care",
            "Body Scrubs"
        ],
        subcategories: [
            {
                id: 21, 
                parentId: 20,
                name: "Skincare",
                subcategories: [],
                attributes: []
            },
            {
                id: 22, 
                parentId: 20,
                name: "Body Care",
                subcategories: [
                    {
                        id: 23, 
                        parentId: 22,
                        name: "Body Scrubs",
                        subcategories: [],
                        attributes: [
                            {
                                name: "Irritability",
                                type: "string",
                                required: false
                            }
                        ]
                    }
                ],
                attributes: [
                    {
                        name: "Feeling",
                        type: "string",
                        required: true
                    },
                    {
                        name: "Fresh level",
                        type: "number",
                        required: true
                    }
                ]
            }
        ],
        attributes: [
            {
                name: "Calming efficiency",
                type: "string",
                required: false
            },
            {
                name: "Ingredients",
                type: "string",
                required: true
            }
        ]
    },
    {
        id: 24,
        name: "Sports & Travel",
        subcategoriesArray: [25, 26, 27, 28],
        subcategoriesNameArray: [
            "Sport Shoes",
            "Apparel",
            "T-shirts",
            "Sport Accessories"
        ],
        subcategories: [
            {
                id: 25, 
                parentId: 24,
                name: "Sport Shoes",
                subcategories: [],
                attributes: []
            },
            {
                id: 26, 
                parentId: 24,
                name: "Apparel",
                subcategories: [
                    {
                        id: 27, 
                        parentId: 26,
                        name: "T-shirts",
                        subcategories: [],
                        attributes: [
                            {
                                name: "Size",
                                type: "string",
                                required: false
                            }
                        ]
                    },
                    {
                        id: 28, 
                        parentId: 26,
                        name: "Sport Accessories",
                        subcategories: [],
                        attributes: []
                    },
                ],
                attributes: [
                    {
                        name: "Waterproof",
                        type: "string",
                        required: true
                    }
                ]
            }
        ],
        attributes: []
    },
    {
        id: 5,
        name: "Home Decoration",
        subcategoriesArray: [],
        subcategoriesNameArray: [],
        subcategories: [],
        attributes: [
            {
                name: "Color",
                type: "string",
                required: true
            },
            {
                name: "Size",
                type: "number",
                required: true
            },
            {
                name: "Material",
                type: "string",
                required: true
            }
        ]
    }, 
    {
        id: 3,
        name: "Gym & Fitness",
        subcategoriesArray: [],
        subcategoriesNameArray: [],
        subcategories: [],
        attributes: [
            {
                name: "Color",
                type: "string",
                required: false
            },
            {
                name: "Size",
                type: "number",
                required: false
            }
        ]
    }
]

// Include hard code database of product attributes
const attributes = [
    {
        productId: 1,
        attributes: [
            {
                name: "Connection type", 
                value: {
                    description: "Type C",
                    type: "string"
                },
                required: true
            },
            {
                name: "Brand", 
                value: {
                    description: "Apple",
                    type: "string"
                },
                required: true
            }
        ]
    },
    {
        productId: 2,
        attributes: [
            {
                name: "Waterproof level", 
                value: {
                    description: "IPX6",
                    type: "string"
                },
                required: true
            },
            {
                name: "Brand", 
                value: {
                    description: "Samsung",
                    type: "string"
                },
                required: true
            },
            {
                name: "Bluetooth connection", 
                value: {
                    description: 5,
                    type: "number"
                },
                required: true
            },
            {
                name: "Connection type", 
                value: {
                    description: "Type C",
                    type: "string"
                },
                required: true
            }
        ]
    },
    {
        productId: 3,
        attributes: [
            {
                name: "Color",
                value: {
                    description: "Grey blue",
                    type: "string"
                },
                required: false
            },
            {
                name: "Size",
                value: {
                    description: 7,
                    type: "number"
                },
                required: false
            }
        ]
    },
    {
        productId: 4,
        attributes: [
            {
                name: "Connection type", 
                value: {
                    description: "Type C",
                    type: "string"
                },
                required: true
            },
            {
                name: "Brand", 
                value: {
                    description: "Samsung",
                    type: "string"
                },
                required: true
            }
        ]
    },
    {
        productId: 5,
        attributes: [
            {
                name: "Connection type", 
                value: {
                    description: "USB C",
                    type: "string"
                },
                required: true
            },
            {
                name: "Brand", 
                value: {
                    description: "Samsung",
                    type: "string"
                },
                required: true
            },
            {
                name: "Size", 
                value: {
                    description: 10,
                    type: "number"
                },
                required: true
            },
            {
                name: "Screen",
                value: {
                    description: "20-inch",
                    type: "string"
                },
                required: true
            },
            {
                name: "Official version",
                value: {
                    description: 11,
                    type: "number"
                },
                required: true
            }
        ]
    },
    {
        productId: 6,
        attributes: [
            {
                name: "Waterproof level", 
                value: {
                    description: "IPX6",
                    type: "string"
                },
                required: true
            },
            {
                name: "Brand", 
                value: {
                    description: "Sony Interactive Entertainment",
                    type: "string"
                },
                required: true
            },
            {
                name: "Bluetooth connection", 
                value: {
                    description: 5,
                    type: "number"
                },
                required: true
            },
            {
                name: "Connection type", 
                value: {
                    description: "HDMI",
                    type: "string"
                },
                required: true
            }
        ]
    },
    {
        productId: 7,
        attributes: [
            {
                name: "Connection type", 
                value: {
                    description: "Power plug",
                    type: "string"
                },
                required: true
            },
            {
                name: "Brand", 
                value: {
                    description: "JBL",
                    type: "string"
                },
                required: true
            }
        ]
    },
    {
        productId: 8,
        attributes: [
            {
                name: "Color",
                value: {
                    description: "Black",
                    type: "string"
                },
                required: false
            },
            {
                name: "Size",
                value: {
                    description: 5,
                    type: "number"
                },
                required: false
            }
        ]
    },
    {
        productId: 9,
        attributes: [
            {
                name: "Waterproof level", 
                value: {
                    description: "IPX5",
                    type: "string"
                },
                required: true
            },
            {
                name: "Brand", 
                value: {
                    description: "Nikon",
                    type: "string"
                },
                required: true
            },
            {
                name: "Bluetooth connection", 
                value: {
                    description: 0,
                    type: "number"
                },
                required: true
            },
            {
                name: "Connection type", 
                value: {
                    description: "Type C",
                    type: "string"
                },
                required: true
            }
        ]
    },
    {
        productId: 10,
        attributes: [
            {
                name: "Connection type", 
                value: {
                    description: "Power plug",
                    type: "string"
                },
                required: true
            },
            {
                name: "Brand", 
                value: {
                    description: "Kangaroo",
                    type: "string"
                },
                required: true
            },
            {
                name: "Size", 
                value: {
                    description: 12,
                    type: "number"
                },
                required: true
            },
            {
                name: "Screen",
                value: {
                    description: "Not available",
                    type: "string"
                },
                required: true
            },
            {
                name: "Official version",
                value: {
                    description: 0,
                    type: "number"
                },
                required: true
            }
        ]
    },
    {
        productId: 11,
        attributes: [
            {
                name: "Color",
                value: {
                    description: "Black",
                    type: "string"
                },
                required: false
            },
            {
                name: "Size",
                value: {
                    description: 5,
                    type: "number"
                },
                required: false
            }
        ]
    },
    {
        productId: 12,
        attributes: [
            {
                name: "Waterproof level", 
                value: {
                    description: "IPX5",
                    type: "string"
                },
                required: true
            },
            {
                name: "Brand", 
                value: {
                    description: "Logitech",
                    type: "string"
                },
                required: true
            },
            {
                name: "Bluetooth connection", 
                value: {
                    description: 5,
                    type: "number"
                },
                required: true
            },
            {
                name: "Connection type", 
                value: {
                    description: "USB C",
                    type: "string"
                },
                required: true
            }
        ]
    },
    {
        productId: 13,
        attributes: [
            {
                name: "Connection type", 
                value: {
                    description: "Power plug",
                    type: "string"
                },
                required: true
            },
            {
                name: "Brand", 
                value: {
                    description: "Sony",
                    type: "string"
                },
                required: true
            }
        ]
    },
    {
        productId: 14,
        attributes: [
            {
                name: "Connection type", 
                value: {
                    description: "No connection",
                    type: "string"
                },
                required: true
            },
            {
                name: "Brand", 
                value: {
                    description: "Walmart",
                    type: "string"
                },
                required: true
            },
            {
                name: "Size", 
                value: {
                    description: 10,
                    type: "number"
                },
                required: true
            },
            {
                name: "Screen",
                value: {
                    description: "Not available",
                    type: "string"
                },
                required: true
            },
            {
                name: "Official version",
                value: {
                    description: 0,
                    type: "number"
                },
                required: true
            }
        ]
    },
    {
        productId: 15,
        attributes: [
            {
                name: "Connection type", 
                value: {
                    description: "Bluetooth",
                    type: "string"
                },
                required: true
            },
            {
                name: "Brand", 
                value: {
                    description: "JBL",
                    type: "string"
                },
                required: true
            }
        ]
    },
    {
        productId: 16,
        attributes: []
    },
    {
        productId: 17,
        attributes: [
            {
                name: "Waterproof level", 
                value: {
                    description: "Not supported",
                    type: "string"
                },
                required: true
            },
            {
                name: "Brand", 
                value: {
                    description: "Bissel",
                    type: "string"
                },
                required: true
            },
            {
                name: "Bluetooth connection", 
                value: {
                    description: 0,
                    type: "number"
                },
                required: true
            },
            {
                name: "Connection type", 
                value: {
                    description: "Power Plug",
                    type: "string"
                },
                required: true
            }
        ]
    },
    {
        productId: 18,
        attributes: [
            {
                name: "Connection type", 
                value: {
                    description: "Power Plug",
                    type: "string"
                },
                required: true
            },
            {
                name: "Brand", 
                value: {
                    description: "Dell",
                    type: "string"
                },
                required: true
            }
        ]
    },
    {
        productId: 19,
        attributes: [
            {
                name: "Connection type", 
                value: {
                    description: "No connection",
                    type: "string"
                },
                required: true
            },
            {
                name: "Brand", 
                value: {
                    description: "Harvest Growth",
                    type: "string"
                },
                required: true
            },
            {
                name: "Size", 
                value: {
                    description: 5,
                    type: "number"
                },
                required: true
            },
            {
                name: "Screen",
                value: {
                    description: "Not available",
                    type: "string"
                },
                required: true
            },
            {
                name: "Official version",
                value: {
                    description: 0,
                    type: "number"
                },
                required: true
            }
        ]
    },
    {
        productId: 20,
        attributes: [
            {
                name: "Color",
                value: {
                    description: "Black",
                    type: "string"
                },
                required: false
            },
            {
                name: "Size",
                value: {
                    description: 10,
                    type: "number"
                },
                required: false
            }
        ]
    },
    {
        productId: 21,
        attributes: [
            {
                name: "Color",
                value: {
                    description: "Golden brown",
                    type: "string"
                },
                required: true
            },
            {
                name: "Size",
                value: {
                    description: 18,
                    type: "number"
                },
                required: true
            },
            {
                name: "Material",
                value: {
                    description: "Wood",
                    type: "string"
                },
                required: true
            }
        ]
    },
    {
        productId: 22,
        attributes: [
            {
                name: "Color",
                value: {
                    description: "Brown",
                    type: "string"
                },
                required: true
            },
            {
                name: "Size",
                value: {
                    description: 20,
                    type: "number"
                },
                required: true
            },
            {
                name: "Material",
                value: {
                    description: "Leather",
                    type: "string"
                },
                required: true
            }
        ]
    },
    {
        productId: 23,
        attributes: [
            {
                name: "Color",
                value: {
                    description: "Light brown",
                    type: "string"
                },
                required: true
            },
            {
                name: "Size",
                value: {
                    description: 18,
                    type: "number"
                },
                required: true
            },
            {
                name: "Material",
                value: {
                    description: "Wood",
                    type: "string"
                },
                required: true
            }
        ]
    },
    {
        productId: 24,
        attributes: [
            {
                name: "Color",
                value: {
                    description: "Golden brown",
                    type: "string"
                },
                required: true
            },
            {
                name: "Size",
                value: {
                    description: 12,
                    type: "number"
                },
                required: true
            },
            {
                name: "Material",
                value: {
                    description: "Acrylic",
                    type: "string"
                },
                required: true
            }
        ]
    },
    {
        productId: 25,
        attributes: [
            {
                name: "Color",
                value: {
                    description: "Terracotta",
                    type: "string"
                },
                required: true
            },
            {
                name: "Size",
                value: {
                    description: 18,
                    type: "number"
                },
                required: true
            },
            {
                name: "Material",
                value: {
                    description: "Synthetic Upholstery",
                    type: "string"
                },
                required: true
            }
        ]
    },
    {
        productId: 26,
        attributes: [
            {
                name: "Color",
                value: {
                    description: "Off-white",
                    type: "string"
                },
                required: true
            },
            {
                name: "Size",
                value: {
                    description: 12,
                    type: "number"
                },
                required: true
            },
            {
                name: "Material",
                value: {
                    description: "Marble",
                    type: "string"
                },
                required: true
            }
        ]
    },
    {
        productId: 27,
        attributes: [
            {
                name: "Color",
                value: {
                    description: "Grey black",
                    type: "string"
                },
                required: true
            },
            {
                name: "Size",
                value: {
                    description: 76,
                    type: "number"
                },
                required: true
            },
            {
                name: "Material",
                value: {
                    description: "Wood",
                    type: "string"
                },
                required: true
            }
        ]
    },
    {
        productId: 28,
        attributes: [
            {
                name: "Color",
                value: {
                    description: "Beige",
                    type: "string"
                },
                required: true
            },
            {
                name: "Size",
                value: {
                    description: 20,
                    type: "number"
                },
                required: true
            },
            {
                name: "Material",
                value: {
                    description: "Velvet",
                    type: "string"
                },
                required: true
            }
        ]
    },
    {
        productId: 29,
        attributes: [
            {
                name: "Color",
                value: {
                    description: "Natural Wood Tones",
                    type: "string"
                },
                required: true
            },
            {
                name: "Size",
                value: {
                    description: 24,
                    type: "number"
                },
                required: true
            },
            {
                name: "Material",
                value: {
                    description: "Laminate",
                    type: "string"
                },
                required: true
            }
        ]
    },
    {
        productId: 30,
        attributes: [
            {
                name: "Color",
                value: {
                    description: "Tan brown",
                    type: "string"
                },
                required: true
            },
            {
                name: "Size",
                value: {
                    description: 6,
                    type: "number"
                },
                required: true
            },
            {
                name: "Material",
                value: {
                    description: "Pavers",
                    type: "string"
                },
                required: true
            }
        ]
    },
]

// drop all collection
exports.dropCollection = async () => {
    try {
        await Category.collection.drop();
        await Sequence.collection.drop();
        await ProductAttributes.collection.drop();
        console.log('Categories collection dropped');

    } catch (err) {
        console.error('Error dropping categories collection:', err);
        throw err;
    }
}

// generate seed data for categories collection
exports.generateSeedData = async (count) => {
    try {
        const catCount = await Category.countDocuments();
        const attrCount = await ProductAttributes.countDocuments();

        if (catCount === 0) {
            // Category.insertMany(await generateMany(10))
            Category.insertMany(data)
                .then((result) => {
                    console.log(`Categories saved to MongoDB`);
                })
                .catch((error) => {
                    console.log(`Categories could not save to MongoDB`, error);
                });
        }

        if (attrCount === 0) {
            ProductAttributes.insertMany(attributes)
                .then((result) => {
                    console.log(`Product attributes saved to MongoDB`);
                })
                .catch((error) => {
                    console.log(`Product attributes could not save to MongoDB`, error);
                });
        }
    } catch (err) {
        console.error('Error generating seed data:', err);
        throw err;
    }
}

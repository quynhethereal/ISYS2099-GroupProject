const {Category, Sequence} = require('../models/category.model');

const data = [
    {
        id: 1,
        name: "Electronic Devices",
        subcategoriesArray: [2, 3, 4, 5, 6],
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
                    id: 3, 
                    parentId: 2,
                    name: "Phones",
                    subcategories: [],
                    attributes: [
                        {
                            name: "Mobile",
                            value: {
                                description: "User-friendly", 
                                type: "string"
                            },
                            required: true
                        },
                        {
                            name: "Price",
                            value: {
                                description: 300,
                                type: "number"
                            },
                            required: true
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
                                name: "Functionality",
                                required: false
                            },
                            {
                                name: "Collection",
                                value: {
                                    description: "Multiple version",
                                    type: "string"
                                },
                                required: true
                            }
                        ]
                    }
                ],
                attributes: []
            },
            {
                id: 4, 
                parentId: 1,
                name: "Laptops",
                subcategories: [
                    {
                        id: 5, 
                        parentId: 4,
                        name: "Gaming Laptops",
                        subcategories: [],
                        attributes: [
                            {
                                name: "Weight",
                                value: {
                                    description: 3, 
                                    type: "number"
                                },
                                required: true
                            },
                            {
                                name: "Price",
                                required: false
                            }
                        ]
                    }
                ],
                attributes: [
                    {
                        name: "Size",
                        required: false
                    },
                    {
                        name: "Screen",
                        value: {
                            description: "13-inch, 14-inch, 15-inch", 
                            type: "string"
                        },
                        required: true
                    }
                ]
            }
        ],
        attributes: [
            {
                name: "Smarthome",
                value: {
                    description: "Electronic devices for smarthome",
                    type: "string"
                },
                required: true
            },
            {
                name: "Price",
                value: {
                    description: 500,
                    type: "number"
                },
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
                            name: "Power Storage",
                            value: {
                                description: "1000GB",
                                type: "string"
                            },
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
                                required: false
                            },
                            {
                                name: "Modern",
                                required: false
                            }
                        ]
                    }
                ],
                attributes: [
                    {
                        name: "Color",
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
                            value: {
                                description: 3,
                                type: "number"
                            },
                            required: true
                        },
                        {
                            name: "Size",
                            value: {
                                description: "Many sizes",
                                type: "string"
                            },
                            required: true
                        }
                    ]
                }],
                attributes: [
                    {
                        name: "Flight distance",
                        required: false
                    },
                    {
                        name: "Storage hour",
                        value: {
                            description: 5,
                            type: "number"
                        },
                        required: true
                    }
                ]
            }
        ],
        attributes: [
            {
                name: "Connection Type",
                value: {
                description: "USB, Bluetooth, HDMI",
                type: "string"
                },
                required: true
            },
            {
                name: "Warranty",
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
                            value: {
                                description: "24-inch, 20-inch, 30-inch",
                                type: "string"
                            },
                            required: true
                        },
                        {
                            name: "Functionality",
                            value: {
                                description: "Multiple Applications",
                                type: "string"
                            },
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
                                required: false
                            }
                        ]
                    }
                ],
                attributes: [
                    {
                        name: "Volumn",
                        value: {
                            description: 100,
                            type: "number"
                        },
                        required: true
                    }
                ]
            }
        ],
        attributes: [
            {
                name: "Compatibility",
                required: false
            },
            {
                name: "Material",
                value: {
                    description: "metal",
                    type: "string"
                },
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
                                required: false
                            }
                        ]
                    }
                ],
                attributes: [
                    {
                        name: "Feeling",
                        value: {
                            description: "Nourishing",
                            type: "string"
                        },
                        required: true
                    },
                    {
                        name: "Fresh level",
                        value: {
                            description: 80,
                            type: "number"
                        },
                        required: true
                    }
                ]
            }
        ],
        attributes: [
            {
                name: "Calming",
                required: false
            },
            {
                name: "Ingredients",
                value: {
                    description: "silky",
                    type: "string"
                },
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
                        name: "Water leaking",
                        value: {
                            description: "Waterproof",
                            type: "string"
                        },
                        required: true
                    }
                ]
            }
        ],
        attributes: []
    },
]

// drop categories collection
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

// generate seed data for categories collection
exports.generateSeedData = async (count) => {
    try {
        const count = await Category.countDocuments();

        if (count === 0) {
            // Category.insertMany(await generateMany(10))
            Category.insertMany(data)
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

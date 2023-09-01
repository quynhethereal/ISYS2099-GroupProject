const { CategoryTree } = require('../../helpers/category_tree.structure');
describe('CategoryTree', () => {
    let tree;

    beforeEach(() => {
        tree = new CategoryTree();
    });

    test('Adding a root category', () => {
        const category = tree.add(1, 'Electronics', null, ['color']);
        expect(tree.getRoot()).toEqual(category);
    });

    test('Adding subcategories', () => {
        const rootCategory = tree.add(1, 'Electronics', null, ['color']);
        const laptopCategory = tree.add(2, 'Laptops', rootCategory, ['processor']);
        expect(rootCategory.subcategories[0]).toEqual(laptopCategory);
    });

    test('Getting node attributes', () => {
        const rootCategory = tree.add(1, 'Electronics', null, ['color']);
        const laptopCategory = tree.add(2, 'Laptops', rootCategory, ['processor']);
        const smartphoneCategory = tree.add(3, 'Smartphones', laptopCategory, ['camera']);

        const attributes = tree.getNodeAttributes(smartphoneCategory);
        expect(attributes).toEqual(['camera', 'processor', 'color']);
    });

    test('Searching for a node by id', () => {
        const rootCategory = tree.add(1, 'Electronics', null, ['color']);
        const laptopCategory = tree.add(2, 'Laptops', rootCategory, ['processor']);
        const foundCategory = tree.searchNode(2);
        expect(foundCategory).toEqual(laptopCategory);
    });

    test('Building the tree', () => {
        const data = {
            "id": 1,
            "name": "Electronics",
            "attributes": ["color"],
            "subcategories": [
                {
                    "id": 2,
                    "name": "Laptops",
                    "parentId": 1,
                    "attributes": ["processor"],
                    "subcategories": [
                        {
                            "id": 3,
                            "name": "Smartphones",
                            "parentId": 2,
                            "attributes": ["camera"],
                            "subcategories": []
                        }
                    ]
                }
            ]
        };
        tree.buildTree(data);
        expect(tree.getRoot().subcategories[0].subcategories[0].name).toEqual('Smartphones');
    });
});

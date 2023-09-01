class Node {
    constructor(id, name, parentNode = [], attributes = [], subcategories = []) {
        this.id = id;
        this.name = name;
        this.parentNode = parentNode;
        this.attributes = attributes;
        this.subcategories = subcategories;
    }
}

// This class represents a tree of categories. Each node in the tree is a category.
// Each category has a list of subcategories, a list of attributes, and a reference to its parent category.
class CategoryTree {
    constructor(attributes = []) {
        this.root = null;
        this.attributes = attributes;
    }

    add(id, name, parentNode, attributes = []) {
        const newNode = new Node(id, name, parentNode, attributes);
        if (this.root === null) {
            this.root = newNode;
        } else {
            this.insertNode(this.root, newNode, parentNode, attributes);
        }
        return newNode;
    }

    insertNode(node, newNode, parentNode) {
        if (node.id === parentNode.id) {
            node.subcategories.push(newNode);
        } else {
            for (let i = 0; i < node.subcategories.length; i++) {
                this.insertNode(node.subcategories[i], newNode, parentNode);
            }
        }
    }

    getRoot() {
        return this.root;
    }

    // Attributes of a category are the attributes of its parent category plus its own attributes.
    // We start the traversal from the found category and go up the tree until we reach the root.
    getNodeAttributes(node) {
        const attributes = [];

        while (node !== null) {
            const nodeAttributes = node.attributes.map((attribute) => attribute.description);
            attributes.push(...nodeAttributes);
            node = node.parentNode;
        }
        return attributes;
    }

    // Traverse the tree by DFS to find the node with the given id.
    searchNode(id) {
        let node = this.getRoot();
        let result = null;

        const traverse = (node) => {
            if (node.id === id) {
                result = node;
            } else {
                for (let i = 0; i < node.subcategories.length; i++) {
                    traverse(node.subcategories[i]);
                }
            }
        }
        traverse(node);
        return result;
    }

    buildTree(obj) {
        if (this.root === null) {
            this.root = new Node(obj.id, obj.name, null, obj.attributes, []);
        }

        if (obj.subcategories.length === 0) {
            return;
        }

        // recursively add subcategories
        for (let i = 0; i < obj.subcategories.length; i++) {
            this.add(obj.subcategories[i].id, obj.subcategories[i].name, this.searchNode(obj.subcategories[i].parentId), obj.subcategories[i].attributes);
            this.buildTree(obj.subcategories[i]);
        }
    }
}

module.exports = { CategoryTree };

// test code
// const tree = new CategoryTree();
// root = tree.add(1, 'Electronics', null, ["color", "size"]);
// laptop = tree.add(2, 'Laptops', root, ["processor", "hello"]);
// phones = tree.add(3, 'Smartphones', laptop, ["camera", "memory"]);
// dell = tree.add(4, 'Dell', root, ["processor", "memory"]);
//
//
// res = tree.getNodeAttributes(phones);
// // console.log(res);
//
// data =
//     {
//         "id": 1,
//         "name": "Electronics",
//         "subcategories": [
//             {
//                 "id": 2,
//                 "name": "Laptops",
//                 "parentId": 1,
//                 "attributes": ["processor", "hello"],
//                 "subcategories": [
//                     {
//                         "id": 3,
//                         "name": "Smartphones",
//                         "parentId": 2,
//                         "attributes": ["camera", "memory"],
//                         "subcategories": []
//                     }
//                 ]
//             },
//             {
//                 "id": 4,
//                 "name": "Dell",
//                 "parentId": 1,
//                 "attributes": ["don't show up", "memory"],
//                 "subcategories": []
//             }
//         ],
//         "attributes": ["color", "size"]
//     }
//
// tree1 = new CategoryTree();
// tree1.buildTree(data);
// console.log(tree1.getNodeAttributes(tree1.searchNode(1)));
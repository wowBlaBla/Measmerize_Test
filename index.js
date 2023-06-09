const nodes = require("./input/nodes.json");
const fs = require('fs');

// Build tree without sorting root nodes
function buildTree(nodes) {
    const nodeMap = new Map();

    // Create a map with nodeId as key and node object as value
    for (const node of nodes) {
        nodeMap.set(node.nodeId, node);
    }

    const rootNodes = [];

    // Iterate over the nodes to build the tree structure
    for (const node of nodes) {
        const parentId = node.parentId;
        const previousSiblingId = node.previousSiblingId;

        if (parentId === null) {
            // If the node has no parent, it is a root-level node
            rootNodes.push(node);
        } else {
            const parentNode = nodeMap.get(parentId);
            if (parentNode) {
                // If the parent node exists, add the current node as its child
                if (!parentNode.children) {
                    parentNode.children = [];
                }

                const previousSiblingNode = nodeMap.get(previousSiblingId);

                if (previousSiblingNode) {
                    // If previous sibling node exists, insert the current node after it
                    const index = parentNode.children.indexOf(previousSiblingNode);
                    parentNode.children.splice(index + 1, 0, node);
                    rearrangeNodes(parentNode.children);
                } else {
                    // If previous sibling node doesn't exist, add the current node as the first child
                    parentNode.children.unshift(node);
                }
            }
        }
    }

    return rootNodes;
}

// Sort the nodes based on previousSiblingId
function rearrangeNodes(nodes) {
    nodes.sort((a, b) => {
        if (a.previousSiblingId === null) return -1;
        if (b.previousSiblingId === null) return 1;
        return b.previousSiblingId - a.previousSiblingId;
    });
}

const tree = buildTree(nodes);

// Arrange root nodes
rearrangeNodes(tree);

const jsonNodes = JSON.stringify(tree, null, 2); // null and 2 for pretty formatting

// Write the JSON tree to a file
fs.writeFile('./output/result-tree.json', jsonNodes, 'utf8', (err) => {
  if (err) {
    console.error('Error writing to file:', err);
  } else {
    console.log('tree has been written to result-tree.json');
  }
});

console.log(tree)
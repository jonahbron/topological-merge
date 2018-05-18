
module.exports = topologicalMerge;

function topologicalMerge(arrays) {

    var rootNodes = {};
    // Produce directional graph
    var keyedNodes = arrays.reduce(addArrayToNodes.bind(null, rootNodes), {});


    // Add prev references to speed up sorting
    addPrevCountToNodes(keyedNodes);

    // Remove all but lowest prevCount root nodes
    const smallestPrev = Object.keys(rootNodes).reduce(function (smallestPrev, key) {
        return Math.min(smallestPrev, keyedNodes[key].prevCount);
    }, Infinity);
    Object.keys(rootNodes).forEach(function (key) {
        if (rootNodes[key].prevCount > smallestPrev) {
            delete rootNodes[key];
        }
    });

    // Make acyclic
    removeCycles(rootNodes);

    return sortGraph(keyedNodes, Object.keys(rootNodes));
}

function sortGraph(keyedNodes, rootNodeKeys) {
    // Get topologically sorted output
    var traversedNodes = {};
    var node;
    var orderedKeys = [];
    while (rootNodeKeys.length > 0) {
        node = keyedNodes[rootNodeKeys.shift()];
        if (traversedNodes[node.key]) {
            continue;
        }
        traversedNodes[node.key] = node;
        orderedKeys.push(node.key);
        Object.keys(node.next).forEach(function (key) {
            var childNode = node.next[key];
            delete node.next[key];
            childNode.prevCount--;
            if (childNode.prevCount === 0) {
                rootNodeKeys.push(key);
            }
        });
    }

    return orderedKeys;
}

function addPrevCountToNodes(keyedNodes) {
    Object.keys(keyedNodes).forEach(function (key) {
        var node = keyedNodes[key];
        Object.keys(node.next).forEach(function (childKey) {
            node.next[childKey].prevCount++;
        });
    });
}

function addArrayToNodes(rootNodes, keyedNodes, array) {
    var reversedArray = array.slice(0).reverse();
    return reversedArray.reduce(addItemToNodes.bind(null, rootNodes, reversedArray), keyedNodes);
}

function addItemToNodes(rootNodes, reversedArray, keyedNodes, key, index) {
    var node = keyedNodes[key] || (keyedNodes[key] = {key: key, next: {}, prevCount: 0});
    if (index > 0) {
        var nextNode = keyedNodes[reversedArray[index - 1]];
        node.next[nextNode.key] = nextNode;
    }
    if (index === reversedArray.length - 1) {
        rootNodes[key] = node;
    }
    return keyedNodes;
}

function removeCycles(nodes, traversedNodes) {
    traversedNodes = traversedNodes || {};
    Object.keys(nodes).forEach(function (key) {
        var node = nodes[key];
        if (traversedNodes[key]) {
            // keep prevCount up-to-date
            nodes[key].prevCount--;
            delete nodes[key];
        } else {
            traversedNodes[key] = node;
            removeCycles(node.next, Object.assign({}, traversedNodes));
        }
    });
}

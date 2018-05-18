var assert = require('assert');
var topologicalMerge = require('./index');

assert.deepEqual(
    topologicalMerge([
    ]),
    [
    ]
, 'No arrays should have empty result');

assert.deepEqual(
    topologicalMerge([
        [],
        []
    ]),
    [
    ]
, 'Empty arrays should have empty result');

assert.deepEqual(
    topologicalMerge([
        ['A', 'B', 'C'],
        ['A', 'B', 'C']
    ]),
    ['A', 'B', 'C']
, 'Matching arrays should have matching result');

assert.deepEqual(
    topologicalMerge([
        ['A', 'B', 'C'],
        ['A', 'B', 'C', 'D', 'E']
    ]),
    ['A', 'B', 'C', 'D', 'E']
, 'Supersets should be appended');

assert.deepEqual(
    topologicalMerge([
        ['A', 'B', 'C'],
        ['A', 'C', 'B', 'E'],
        ['B', 'A', 'E', 'C', 'F']
    ]),
    ['A', 'B', 'C', 'E', 'F']
, 'Order presidence should cascade');

assert.deepEqual(
    topologicalMerge([
        ['B', 'C'],
        ['A', 'B', 'C']
    ]),
    ['A', 'B', 'C']
, 'Earlier nodes should be pre-pended');

assert.deepEqual(
    topologicalMerge([
        ['A', 'B', 'C'],
        ['C', 'B', 'A']
    ]),
    ['A', 'C', 'B']
, 'Cycles should not break sorting');

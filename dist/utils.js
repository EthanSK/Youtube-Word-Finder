"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomInt = exports.removeFirstOccurrence = exports.delay = void 0;
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.delay = delay;
function removeFirstOccurrence(string, searchString) {
    var index = string.indexOf(searchString);
    if (index === -1) {
        return string;
    }
    return string.slice(0, index) + string.slice(index + searchString.length);
}
exports.removeFirstOccurrence = removeFirstOccurrence;
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
exports.getRandomInt = getRandomInt;

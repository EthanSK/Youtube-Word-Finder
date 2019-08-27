"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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

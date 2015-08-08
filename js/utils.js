'use strict';

// Returns a regular expression which will match against 1 or more occurrences of a class name
function classMatchingRegex(className) {
    return new RegExp("\\b" + className + "\\b");
}

// Returns true iff the specified element has the specified class name
function hasClass(element, className) {
    return classMatchingRegex(className).test(element.className);
}

// Adds the specified class to the specified element, if the element does not already have the class
function addClass(element, className) {
    if (hasClass(element, className)) return; // Element already has the class - so do not add it
    element.className = element.className === "" ? className : element.className + " " + className;
}

// Removes the specified class from the specified element
function removeClass(element, className) {
    if (!hasClass(element, className)) return; // Element already does not have this class - so nothing to remove
    element.className = element.className.replace(classMatchingRegex(className), "").trim();
}

function removeElement(element) {
    element.parentNode.removeChild(element);
}

function prependChild(child, to) {
    to.insertBefore(child, to.firstChild);
}

function insertBeforeLastChild(child, to) {
    to.insertBefore(child, to.children[to.children.length - 1]);
}

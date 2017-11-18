(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["vdom"] = factory();
	else
		root["vdom"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

const diffType = {
  NODE_DELETE: 'NODE_DELETE',
  NODE_TEXT_MODIFY: 'NODE_TEXT_MODIFY',
  NODE_REPLACE: 'NODE_REPLACE',
  NODE_ADD: 'NODE_ADD',
  NODE_ATTRIBUTE_MODIFY: 'NODE_ATTRIBUTE_MODIFY',
  NODE_ATTRIBUTE_ADD: 'NODE_ATTRIBUTE_ADD',
  NODE_ATTRIBUTE_DELETE: 'NODE_ATTRIBUTE_DELETE'
};
/* harmony export (immutable) */ __webpack_exports__["a"] = diffType;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__diff__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__patch__ = __webpack_require__(4);



class VirtualDom {
  constructor(vdom) {
    this.element = new Element(vdom);
  }

  render() {
    if (this.element) {
      return this.element.render();
    }

    throw new Error('unable to parse empty vdom');
  }

  update($dom, newVirtualDom) {
    const patches = Object(__WEBPACK_IMPORTED_MODULE_0__diff__["a" /* default */])(this.element, new Element(newVirtualDom));
    console.log(patches);
    Object(__WEBPACK_IMPORTED_MODULE_1__patch__["a" /* default */])($dom, patches);
  }
}
/* harmony export (immutable) */ __webpack_exports__["default"] = VirtualDom;


class Element {
  constructor(velement) {
    this.props = {};

    for (const vkey in velement) {
      switch (vkey) {
        case 'tag':
          this.tagName = velement[vkey];
          break;
        case 'children':
          this.children = velement[vkey];
          break;
        case 'text':
          this.text = velement[vkey];
          break;
        default:
          this.props[vkey] = velement[vkey];
      }
    }

    if (this.children) {
      this.children = this.children.map(child => {
        return new Element(child);
      });
    }

    this.key = this.props.key || void 0;
  }

  render() {
    const $dom = document.createElement(this.tagName);
    if (this.text) $dom.textContent = this.text; // or $dom.innerText = xxx
    for (const propKey in this.props) {
      $dom.setAttribute(propKey === 'className' ? 'class' : propKey, this.props[propKey]);
    }
    if (this.children) {
      this.children.forEach(child => {
        $dom.appendChild(child.render());
      });
    }

    return $dom;
  }
}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_constant__ = __webpack_require__(0);




/* harmony default export */ __webpack_exports__["a"] = (diff);

function diff(oldTree, newTree) {
  let index = { value: 0 };
  let patches = {};
  dfsWalk(oldTree, newTree, index, patches);
  return patches;
}

function dfsWalk(oldNode, newNode, index, patches) {
  const currentIdx = index.value;
  const currentIndexPatch = [];
  if (Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* getType */])(oldNode && oldNode.text) === 'String' && Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* getType */])(newNode && newNode.text) === 'String') {
    if (oldNode.text !== newNode.text) {
      currentIndexPatch.push({
        type: __WEBPACK_IMPORTED_MODULE_1__utils_constant__["a" /* diffType */].NODE_TEXT_MODIFY,
        value: newNode.text
      });
    }
  }
  if (newNode === undefined) {
    currentIndexPatch.push({
      type: __WEBPACK_IMPORTED_MODULE_1__utils_constant__["a" /* diffType */].NODE_DELETE
    });
  } else if (oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
    diffProps(oldNode.props, newNode.props, index, currentIndexPatch);
    diffChildren(oldNode.children, newNode.children, index, currentIndexPatch, patches);
  } else {
    currentIndexPatch.push({
      type: __WEBPACK_IMPORTED_MODULE_1__utils_constant__["a" /* diffType */].NODE_REPLACE,
      value: newNode
    });
  }

  if (currentIndexPatch.length > 0) {
    patches[currentIdx] = currentIndexPatch;
  }
}

function diffProps(oldProps, newProps, index, currentIndexPatch) {
  for (const propKey in oldProps) {
    if (!newProps.hasOwnProperty(propKey)) {
      currentIndexPatch.push({
        type: __WEBPACK_IMPORTED_MODULE_1__utils_constant__["a" /* diffType */].NODE_ATTRIBUTE_DELETE,
        key: propKey
      });
    } else if (newProps[propKey] !== oldProps[propKey]) {
      currentIndexPatch.push({
        type: __WEBPACK_IMPORTED_MODULE_1__utils_constant__["a" /* diffType */].NODE_ATTRIBUTE_MODIFY,
        key: propKey,
        value: newProps[propKey]
      });
    }
  }

  for (const propKey in newProps) {
    if (!oldProps.hasOwnProperty(propKey)) {
      currentIndexPatch.push({
        type: __WEBPACK_IMPORTED_MODULE_1__utils_constant__["a" /* diffType */].NODE_ATTRIBUTE_ADD,
        key: propKey,
        value: newProps[propKey]
      });
    }
  }
}

function diffChildren(oldChildren, newChildren, index, currentIndexPatch, patches) {
  const oLen = oldChildren ? oldChildren.length : 0;
  const nLen = newChildren ? newChildren.length : 0;
  console.log(oldChildren);
  console.log(newChildren);
  if (oLen < nLen) {
    let i = 0;
    for (; i < oLen; i++) {
      index.value++;
      dfsWalk(oldChildren[i], newChildren[i], index, patches);
    }
    for (; i < nLen; i++) {
      currentIndexPatch.push({
        type: __WEBPACK_IMPORTED_MODULE_1__utils_constant__["a" /* diffType */].NODE_ADD,
        value: newChildren[i]
      });
    }
  } else {
    for (let i = 0; i < oLen; i++) {
      index.value++;
      dfsWalk(oldChildren[i], newChildren[i], index, patches);
    }
  }
}

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const getType = v => Object.prototype.toString.call(v).slice(8, -1);
/* harmony export (immutable) */ __webpack_exports__["a"] = getType;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_constant__ = __webpack_require__(0);


/* harmony default export */ __webpack_exports__["a"] = (patch);

function patch($dom, patches) {
  const index = { value: 0 };
  dfsWalk($dom, index, patches);
}

function dfsWalk($node, index, patches, isEnd = false) {
  if (patches[index.value]) {
    patches[index.value].forEach(p => {
      if (p.key) {
        p.key = p.key === 'className' ? 'class' : p.key;
      }
      switch (p.type) {
        case __WEBPACK_IMPORTED_MODULE_0__utils_constant__["a" /* diffType */].NODE_ATTRIBUTE_MODIFY:
          {
            $node.setAttribute(p.key, p.value);
            break;
          }
        case __WEBPACK_IMPORTED_MODULE_0__utils_constant__["a" /* diffType */].NODE_ATTRIBUTE_DELETE:
          {
            $node.removeAttribute(p.key.toLowerCase());
            break;
          }
        case __WEBPACK_IMPORTED_MODULE_0__utils_constant__["a" /* diffType */].NODE_ATTRIBUTE_ADD:
          {
            $node.setAttribute(p.key, p.value);
            break;
          }
        case __WEBPACK_IMPORTED_MODULE_0__utils_constant__["a" /* diffType */].NODE_ADD:
          {
            $node.appendChild(p.value.render());
            break;
          }
        case __WEBPACK_IMPORTED_MODULE_0__utils_constant__["a" /* diffType */].NODE_TEXT_MODIFY:
          {
            $node.textContent = p.value;
            break;
          }
        case __WEBPACK_IMPORTED_MODULE_0__utils_constant__["a" /* diffType */].NODE_REPLACE:
          {
            $node.replaceWith(p.value.render());
            break;
          }
        case __WEBPACK_IMPORTED_MODULE_0__utils_constant__["a" /* diffType */].NODE_DELETE:
          {
            $node.remove();
            break;
          }
        default:
          {
            console.error(p);
          }
      }
    });
  }

  if (isEnd) return;
  if ($node.children.length > 0) {
    for (let i = 0; i < $node.children.length; i++) {
      index.value++;
      dfsWalk($node.children[i], index, patches);
    }
  } else {
    index.value++;
    dfsWalk($node, index, patches, true);
  }
}

/***/ })
/******/ ]);
});
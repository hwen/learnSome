
import { getType } from './utils'
import { diffType } from './utils/constant'

export default diff

function diff (oldTree, newTree) {
  let index = { value: 0 }
  let patches = {}
  dfsWalk(oldTree, newTree, index, patches)
  return patches
}

function dfsWalk (oldNode, newNode, index, patches) {
  const currentIdx = index.value
  const currentIndexPatch = []
  if (getType(oldNode && oldNode.text) === 'String' && getType(newNode && newNode.text) === 'String') {
    if (oldNode.text !== newNode.text) {
      currentIndexPatch.push({
        type: diffType.NODE_TEXT_MODIFY,
        value: newNode.text
      })
    }
  }
  if (newNode === undefined) {
    currentIndexPatch.push({
      type: diffType.NODE_DELETE
    })
  } else if (oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
    diffProps(oldNode.props, newNode.props, index, currentIndexPatch)
    diffChildren(oldNode.children, newNode.children, index, currentIndexPatch, patches)
  } else {
    currentIndexPatch.push({
      type: diffType.NODE_REPLACE,
      value: newNode
    })
  }

  if (currentIndexPatch.length > 0) {
    patches[currentIdx] = currentIndexPatch
  }
}

function diffProps (oldProps, newProps, index, currentIndexPatch) {
  for (const propKey in oldProps) {
    if (!newProps.hasOwnProperty(propKey)) {
      currentIndexPatch.push({
        type: diffType.NODE_ATTRIBUTE_DELETE,
        key: propKey
      })
    } else if (newProps[propKey] !== oldProps[propKey]) {
      currentIndexPatch.push({
        type: diffType.NODE_ATTRIBUTE_MODIFY,
        key: propKey,
        value: newProps[propKey]
      })
    }
  }

  for (const propKey in newProps) {
    if (!oldProps.hasOwnProperty(propKey)) {
      currentIndexPatch.push({
        type: diffType.NODE_ATTRIBUTE_ADD,
        key: propKey,
        value: newProps[propKey]
      })
    }
  }
}

function diffChildren (oldChildren, newChildren, index, currentIndexPatch, patches) {
  const oLen = oldChildren ? oldChildren.length : 0
  const nLen = newChildren ? newChildren.length : 0
  console.log(oldChildren)
  console.log(newChildren)
  if (oLen < nLen) {
    let i = 0
    for (; i < oLen; i++) {
      index.value++
      dfsWalk(oldChildren[i], newChildren[i], index, patches)
    }
    for (; i < nLen; i++) {
      currentIndexPatch.push({
        type: diffType.NODE_ADD,
        value: newChildren[i]
      })
    }
  } else {
    for (let i = 0; i < oLen; i++) {
      index.value++
      dfsWalk(oldChildren[i], newChildren[i], index, patches)
    }
  }
}

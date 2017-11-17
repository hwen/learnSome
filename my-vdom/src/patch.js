import { diffType } from './utils/constant'

export default patch

function patch ($dom, patches) {
  const index = { value: 0 }
  dfsWalk($dom, index, patches)
}

function dfsWalk ($node, index, patches, isEnd = false) {
  if (patches[index.value]) {
    patches[index.value].forEach(p => {
      if (p.key) {
        p.key = p.key === 'className' ? 'class' : p.key
      }
      switch (p.type) {
        case diffType.NODE_ATTRIBUTE_MODIFY: {
          $node.setAttribute(p.key, p.value)
          break
        }
        case diffType.NODE_ATTRIBUTE_DELETE: {
          $node.removeAttribute(p.key.toLowerCase())
          break
        }
        case diffType.NODE_ATTRIBUTE_ADD: {
          $node.setAttribute(p.key, p.value)
          break
        }
        case diffType.NODE_ADD: {
          $node.appendChild(p.value.render())
          break
        }
        case diffType.NODE_TEXT_MODIFY: {
          $node.textContent = p.value
          break
        }
        case diffType.NODE_REPLACE: {
          $node.replaceWith(p.value.render())
          break
        }
        case diffType.NODE_DELETE: {
          $node.remove()
          break
        }
        default: {
          console.error(p)
        }
      }
    })
  }

  if (isEnd) return
  if ($node.children.length > 0) {
    for (let i = 0; i < $node.children.length; i++) {
      index.value++
      dfsWalk($node.children[i], index, patches)
    }
  } else {
    index.value++
    dfsWalk($node, index, patches, true)
  }
}

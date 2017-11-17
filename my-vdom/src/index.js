import diff from './diff'
import patch from './patch'

export default class VirtualDom {
  constructor (vdom) {
    this.element = new Element(vdom)
  }

  render () {
    if (this.element) {
      return this.element.render()
    }

    throw new Error('unable to parse empty vdom')
  }

  update ($dom, newVirtualDom) {
    const patches = diff(this.element, new Element(newVirtualDom))
    console.log(patches)
    patch($dom, patches)
  }
}

class Element {
  constructor (velement) {
    this.props = {}

    for (const vkey in velement) {
      switch (vkey) {
        case 'tag':
          this.tagName = velement[vkey]
          break
        case 'children':
          this.children = velement[vkey]
          break
        case 'text':
          this.text = velement[vkey]
          break
        default:
          this.props[vkey] = velement[vkey]
      }
    }

    if (this.children) {
      this.children = this.children.map(child => {
        return new Element(child)
      })
    }
   
    this.key = this.props.key || void 0
  }

  render () {
    const $dom = document.createElement(this.tagName)
    if (this.text) $dom.textContent = this.text // or $dom.innerText = xxx
    for (const propKey in this.props) {
      $dom.setAttribute(propKey === 'className' ? 'class' : propKey, this.props[propKey])
    }
    if (this.children) {
      this.children.forEach(child => {
        $dom.appendChild(child.render())
      })
    }

    return $dom
  }
}

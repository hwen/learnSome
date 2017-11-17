import './main.scss'
import VirtualDom from '@/index'

const tree = new VirtualDom({
  tag: 'div',
  children: [
    {
      tag: 'h1',
      className: 'header',
      style: 'color: red;padding-left: 16px;',
      text: 'Hi there ~'
    },
    {
      tag: 'section',
      className: 'content',
      style: 'color: #606c76;padding-left: 16px;',
      text: 'Hallo, vdom content ~~',
      children: [
        {
          tag: 'p',
          text: 'too young'
        },
        {
          tag: 'p',
          text: 'too simple'
        },
        {
          tag: 'p',
          text: 'some time nativeeee'
        }
      ]
    },
    {
      tag: 'footer',
      text: '@power by hwen <hwenleung@gmail.com>'
    }
  ]
})

const $dom = tree.render()
const $app = document.querySelector('#app')
$app.replaceWith($dom)

tree.update($dom, {
  tag: 'div',
  children: [
    {
      tag: 'h1',
      className: 'header',
      style: 'color: blue;padding-left: 16px;',
      text: 'Hii ~'
    },
    {
      tag: 'section',
      className: 'content',
      style: 'color: #606c76;padding-left: 16px;',
      text: 'Hallo, vdom content ~~',
      children: [
        {
          tag: 'p',
          text: 'too young'
        },
        {
          tag: 'p',
          text: 'some time nativeeee'
        }
      ]
    },
    {
      tag: 'footer',
      text: '@power by hwen <hwenleung@gmail.com>'
    }
  ]
})

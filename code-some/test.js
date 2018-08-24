const message = 'asssssss'

function A({ message }) {
  this.message = message
  this.stack = new Error().stack
}

A.prototype = Object.create(Error.prototype)
A.prototype.constructor = A

function dp() {
  throw new A({message: 'what the fuck'})
}

try {
  dp()
} catch (e) {
  console.log(e)
}

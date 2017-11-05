import {getTopics, setDivContent} from './../src'
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'chai-sinon'
chai.should()
chai.use(sinonChai)

describe('simple test demo', function () {
  const info = console.info.bind(console)
  const mountPoint = '<div id="test">here</div>'
  document.body.insertAdjacentHTML(
    'afterbegin',
    mountPoint
  )

  afterEach('do something', () => {
  })

  beforeEach('do something', () => {
  })

  // #region
  it('test dom', () => {
    const div = document.getElementById('test')

    const content = div.innerHTML
    content.should.be.equal('here')

    setDivContent()
    const after = div.innerHTML
    after.should.be.equal('hallo world')
  })

  it('test async', done => {
    getTopics()
      .then(res => {
        // res.success.should.be.true
        res.success.should.be.equal(true)
        done()
      })
      .catch(err => {
        // info(err)
        done(err)
      })
  })
  // #endregion
})

const { defineSupportCode } = require('cucumber')
const World = require('./world')
const Model = require('../../src/database/model')
const treeKill = require('tree-kill')

defineSupportCode(({ After, setDefaultTimeout, setWorldConstructor }) => {
  setDefaultTimeout(5000)
  setWorldConstructor(World)
  After(function(_testCaseResult, done) {
    Model.destroy({ logging: false, truncate: true })
      .then(() => {
        treeKill(this.process.pid(), () => this.exocom.close(done))
      })
      .catch(done)
  })
})

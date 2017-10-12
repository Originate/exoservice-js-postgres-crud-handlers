const { defineSupportCode } = require('cucumber')
const ExoComMock = require('exocom-mock')
const { expect } = require('chai')
const fs = require('fs')
const N = require('nitroglycerin')
const portReservation = require('port-reservation')
const yaml = require('js-yaml')
const ObservableProcess = require('observable-process')
const async = require('async')
const camelCaseKeys = require('camelcase-keys')

const serviceConfig = yaml.safeLoad(fs.readFileSync('service.yml'), 'utf8')

function normalizePayload(obj) {
  if (Array.isArray(obj)) {
    return obj.map(normalizePayload)
  }
  const newObj = Object.assign({}, obj)
  if (newObj.id) {
    newObj.id = '<uuid>'
  }
  if (newObj.createdAt) {
    newObj.createdAt = '<timestamp>'
  }
  if (newObj.updatedAt) {
    newObj.updatedAt = '<timestamp>'
  }
  return newObj
}

defineSupportCode(({ Given, When, Then }) => {
  Given(/^an ExoCom server$/, function(done) {
    portReservation.getPort(
      N(exocomPort => {
        this.exocomPort = exocomPort
        this.exocom = new ExoComMock()
        this.exocom.listen(exocomPort, done)
      })
    )
  })

  Given(/^an instance of this service$/, { timeout: 20 * 1000 }, function(
    done
  ) {
    const command = serviceConfig.development.scripts.run
    this.process = new ObservableProcess(command, {
      env: {
        EXOCOM_PORT: this.exocomPort,
        EXOCOM_HOST: 'localhost',
        ROLE: serviceConfig.type,
      },
      stdout: false,
      stderr: false,
    })
    this.process.wait(serviceConfig.startup['online-text'], done, 15 * 1000)
  })

  When(/^receiving the message "([^"]*)"$/, function(message) {
    this.exocom.send({
      service: 'my-service',
      name: message,
    })
  })

  When(/^receiving the message "([^"]*)" with the payload:$/, function(
    message,
    payloadStr
  ) {
    const payload = JSON.parse(payloadStr)
    if (payload.id === '<uuid of one>') {
      payload.id = this.instanceNameToId.one
    }
    this.exocom.send({
      service: 'my-service',
      name: message,
      payload,
    })
  })

  Then(/^the service replies with "([^"]*)"$/, function(
    expectedMessageName,
    done
  ) {
    this.exocom.onReceive(() => {
      const actualMessage = this.exocom.receivedMessages[0]
      const errorDetail = JSON.stringify(actualMessage)
      expect(actualMessage.name).to.eql(expectedMessageName, errorDetail)
      done()
    })
  })

  Given(/^the service contains the users:$/, function(table, done) {
    this.instanceNameToId = {}
    async.eachSeries(
      table.hashes().map(camelCaseKeys),
      (data, cb) => {
        this.exocom.send({
          service: 'my-service',
          name: 'create user',
          payload: data,
        })
        this.exocom.onReceive(() => {
          const replyMessage = this.exocom.receivedMessages[0]
          const errorDetail = JSON.stringify(replyMessage)
          expect(replyMessage.name).to.eql('user created', errorDetail)
          this.instanceNameToId[data.name] = replyMessage.payload.id
          cb()
        })
      },
      done
    )
  })

  Then(/^the service replies with "([^"]*)" and the payload:$/, function(
    expectedName,
    expectedPayloadStr,
    done
  ) {
    const expectedPayload = JSON.parse(expectedPayloadStr)
    this.exocom.onReceive(() => {
      const actualMessage = this.exocom.receivedMessages[0]
      const errorDetail = JSON.stringify(actualMessage)
      expect(actualMessage.name).to.eql(expectedName, errorDetail)
      const actualPayload = normalizePayload(actualMessage.payload)
      expect(actualPayload).to.eql(expectedPayload, errorDetail)
      done()
    })
  })

  Then(/^the service contains no users$/, function(done) {
    this.exocom.send({
      service: 'my-service',
      name: 'list user',
    })
    this.exocom.onReceive(() => {
      const actualMessage = this.exocom.receivedMessages[0]
      const errorDetail = JSON.stringify(actualMessage)
      expect(actualMessage.payload.length).to.eql(0, errorDetail)
      done()
    })
  })

  Then(/^the service now contains the users:$/, function(table, done) {
    this.exocom.send({
      service: 'my-service',
      name: 'list user',
    })
    this.exocom.onReceive(() => {
      const actualNames = this.exocom.receivedMessages[0].payload.map(
        x => x.name
      )
      const expectedNames = table
        .hashes()
        .map(camelCaseKeys)
        .map(x => x.name)
      expect(actualNames).to.have.members(expectedNames)
      done()
    })
  })
})

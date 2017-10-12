const childProcess = require('child_process')
const fs = require('fs')
const fsExtra = require('fs-extra')
const path = require('path')

const srcPath = path.join(__dirname, 'index.js')
const serviceCopyOfSrcPath = path.join(
  __dirname,
  'example-app',
  'my-service',
  'exoservice-sequelize-crud-handlers-copy.js'
)

fsExtra.copySync(srcPath, serviceCopyOfSrcPath)

let testErrored
try {
  childProcess.execSync('exo test --no-mount', {
    cwd: path.join(__dirname, 'example-app'),
    stdio: 'inherit',
  })
} catch (error) {
  testErrored = true
} finally {
  fs.unlinkSync(serviceCopyOfSrcPath)
}

if (testErrored) {
  process.exit(1)
}

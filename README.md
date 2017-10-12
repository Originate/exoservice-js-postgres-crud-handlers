# ExoService Sequelize CRUD Handlers

## Requirements

* Node 8 or higher

## Usage

```js
const sequelizeInstance = require('...')
const sequelizeModel = require('...')
const { bootstrap } = require('exoservice')
const createHandlers = require('exoservice-sequelize-crud-handlers')

// For a CRUD only service use:
bootstrap(createHandlers({messageName: 'user', sequelizeModel, sequelizeInstance}))

// For a CRUD service with additional methods use:
const handlers = createHandlers({messageName: 'user', sequelizeModel, sequelizeInstance})
handlers['custom'] = function() { /* ... */ }
bootstrap(handlers)
```

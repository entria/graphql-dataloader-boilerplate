// eslint-disable-next-line import/no-extraneous-dependencies
const NodeEnvironment = require('jest-environment-node')
const MongodbMemoryServer = require('mongodb-memory-server')

class MongoDbEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config)
    // eslint-disable-next-line new-cap
    this.mongod = new MongodbMemoryServer.default({
      binary: {
        version: '3.6.4',
      },
    })
  }

  async setup() {
    await super.setup()
    // console.log('\n# MongoDB Environment Setup #');

    this.global.__MONGO_URI__ = await this.mongod.getConnectionString()
    this.global.__MONGO_DB_NAME__ = await this.mongod.getDbName()
    this.global.__COUNTERS__ = {
      user: 0,
    }
  }

  async teardown() {
    // console.log('\n# MongoDB Environment Teardown #');
    await super.teardown()
    await this.mongod.stop()
  }

  runScript(script) {
    return super.runScript(script)
  }
}

module.exports = MongoDbEnvironment

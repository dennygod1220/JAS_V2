'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', table => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('email', 180).notNullable().unique()
      table.string('password', 60).notNullable()
      table.integer('isAdmin').default(1)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema

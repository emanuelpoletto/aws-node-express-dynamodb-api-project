const AWS = require('aws-sdk');

const UserEntity = require('../entities/UserEntity');
const NotificationService = require('./NotificationService');

class UserService {
  #USERS_TOPIC;

  constructor() {
    this.#USERS_TOPIC = process.env.USERS_TOPIC;
  }

  findById(userId) {
    if (userId) {
      return UserEntity.findById(userId);
    }
    return { error: 'You must provide a user id.' }
  }

  list({ limit = 50 }) {
    return UserEntity.list({ limit });
  }

  async create({ email, name }) {
    if (typeof email !== 'string') {
      return { error: '"email" must be a string' };
    }
    if (typeof name !== 'string') {
      return { error: '"name" must be a string' };
    }

    try {
      const user = await UserEntity.create({ email, name });
      const topic = this.#USERS_TOPIC;
      await NotificationService.send({ topic, message: user });
      return user;
    } catch (error) {
      console.log(error);
      return { error: 'Could not create user', ...error };
    }
  }
}

module.exports = new UserService();

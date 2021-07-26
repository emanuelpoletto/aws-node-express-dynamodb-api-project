const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const { CustomError } = require('../helpers/ErrorHelper')

class UserEntity {
  #USERS_TABLE;
  #dynamoDbClient;

  constructor() {
    this.#USERS_TABLE = process.env.USERS_TABLE;
    this.#dynamoDbClient = new AWS.DynamoDB.DocumentClient();
  }

  async findById(userId) {
    const params = {
      TableName: this.#USERS_TABLE,
      Key: {
        userId,
      },
    };

    try {
      const { Item } = await this.#dynamoDbClient.get(params).promise();
      if (Item) {
        const { userId, email, name } = Item;
        return { userId, email, name };
      }
    } catch (error) {
      console.error(error);
      throw new CustomError('Could not retrieve user', 500);
    }

    throw new CustomError('Could not find user with provided "userId"', 404);
  }

  async list({ limit = 50 }) {
    const params = {
      TableName: this.#USERS_TABLE,
      Limit: limit,
    };

    try {
      const { Items } = await this.#dynamoDbClient.scan(params).promise();
      if (Items) {
        return Items;
      }
      return { error: 'Users not found' };
    } catch (error) {
      console.log(error);
      return { error: 'Could not retrieve users' };
    }
  }

  async create({ email, name }) {
    const userId = uuidv4();
    const user = {
      userId,
      email,
      name,
    };
    const dbParams = {
      TableName: this.#USERS_TABLE,
      Item: user,
    };

    try {
      await this.#dynamoDbClient.put(dbParams).promise();
      return { ...user };
    } catch (error) {
      console.log(error);
      return { error: 'Could not create user', ...error };
    }
  }
}

module.exports = new UserEntity();

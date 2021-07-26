const AWS = require('aws-sdk');

class NotificationService {
  #snsClient;

  constructor() {
    this.#snsClient = new AWS.SNS();
  }

  async send({ topic, message }) {
    const topicParams = {
      TopicArn: topic,
      Message: JSON.stringify(message),
    };

    try {
      await snsClient.publish(topicParams).promise();
      return message;
    } catch (error) {
      console.log(error);
      return { error: 'Could not create user', ...error };
    }
  }
}

module.exports = new NotificationService();

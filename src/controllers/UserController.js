const UserService = require('../services/UserService');

class UserController {
  async findById(req, res, next) {
    try {
      const user = await UserService.findById(req.params.userId);
      return res.json(user);
    } catch (error) {
      return next(error);
    }
  }

  async list(req, res, next) {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    
    try {
      const users = await UserService.list({ limit });
      if (users) {
        return res.json(users);
      }
      return res.status(404).json({ error: 'There are no users' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Could not retrieve users' });
    }
  }
  
  async create(req, res, next) {
    const { email, name } = req.body;
    try {
      const user = await UserService.create({ email, name });
      return res.json({ ...user });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Could not create user', ...error });
    }
  }
}

module.exports = new UserController();

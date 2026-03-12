var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users');

// GET all users
router.get('/', async function(req, res, next) {
  try {
    let data = await userModel.find({
      isDeleted: false
    }).populate({
      path: 'role',
      select: 'name description'
    });
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message
    });
  }
});

// GET user by id
router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let result = await userModel.findOne({
      isDeleted: false,
      _id: id
    }).populate({
      path: 'role',
      select: 'name description'
    });
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({
        message: "USER NOT FOUND"
      });
    }
  } catch (error) {
    res.status(404).send({
      message: error.message
    });
  }
});

// CREATE new user
router.post('/', async function(req, res) {
  try {
    let newUser = new userModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      status: req.body.status,
      role: req.body.role,
      loginCount: req.body.loginCount
    });
    await newUser.save();
    res.send(newUser);
  } catch (error) {
    res.status(400).send({
      message: error.message
    });
  }
});

// UPDATE user by id
router.put('/:id', async function(req, res) {
  try {
    let id = req.params.id;
    let result = await userModel.findOneAndUpdate(
      {
        isDeleted: false,
        _id: id
      },
      {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        status: req.body.status,
        role: req.body.role,
        loginCount: req.body.loginCount
      },
      { new: true }
    ).populate({
      path: 'role',
      select: 'name description'
    });
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({
        message: "USER NOT FOUND"
      });
    }
  } catch (error) {
    res.status(400).send({
      message: error.message
    });
  }
});

// SOFT DELETE user by id
router.delete('/:id', async function(req, res) {
  try {
    let id = req.params.id;
    let result = await userModel.findOneAndUpdate(
      {
        isDeleted: false,
        _id: id
      },
      {
        isDeleted: true
      },
      { new: true }
    );
    if (result) {
      res.send({
        message: "USER DELETED SUCCESSFULLY"
      });
    } else {
      res.status(404).send({
        message: "USER NOT FOUND"
      });
    }
  } catch (error) {
    res.status(400).send({
      message: error.message
    });
  }
});

// ENABLE user (set status to true)
router.post('/enable', async function(req, res) {
  try {
    let email = req.body.email;
    let username = req.body.username;
    
    let result = await userModel.findOneAndUpdate(
      {
        isDeleted: false,
        email: email,
        username: username
      },
      {
        status: true
      },
      { new: true }
    ).populate({
      path: 'role',
      select: 'name description'
    });
    
    if (result) {
      res.send({
        message: "USER ENABLED SUCCESSFULLY",
        user: result
      });
    } else {
      res.status(404).send({
        message: "USER NOT FOUND"
      });
    }
  } catch (error) {
    res.status(400).send({
      message: error.message
    });
  }
});

// DISABLE user (set status to false)
router.post('/disable', async function(req, res) {
  try {
    let email = req.body.email;
    let username = req.body.username;
    
    let result = await userModel.findOneAndUpdate(
      {
        isDeleted: false,
        email: email,
        username: username
      },
      {
        status: false
      },
      { new: true }
    ).populate({
      path: 'role',
      select: 'name description'
    });
    
    if (result) {
      res.send({
        message: "USER DISABLED SUCCESSFULLY",
        user: result
      });
    } else {
      res.status(404).send({
        message: "USER NOT FOUND"
      });
    }
  } catch (error) {
    res.status(400).send({
      message: error.message
    });
  }
});

module.exports = router;

var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/roles');
let userModel = require('../schemas/users');

// GET all roles
router.get('/', async function(req, res, next) {
  try {
    let data = await roleModel.find({
      isDeleted: false
    });
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message
    });
  }
});

// GET role by id
router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let result = await roleModel.findOne({
      isDeleted: false,
      _id: id
    });
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({
        message: "ROLE NOT FOUND"
      });
    }
  } catch (error) {
    res.status(404).send({
      message: error.message
    });
  }
});

// CREATE new role
router.post('/', async function(req, res) {
  try {
    let newRole = new roleModel({
      name: req.body.name,
      description: req.body.description
    });
    await newRole.save();
    res.send(newRole);
  } catch (error) {
    res.status(400).send({
      message: error.message
    });
  }
});

// UPDATE role by id
router.put('/:id', async function(req, res) {
  try {
    let id = req.params.id;
    let result = await roleModel.findOneAndUpdate(
      {
        isDeleted: false,
        _id: id
      },
      {
        name: req.body.name,
        description: req.body.description
      },
      { new: true }
    );
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({
        message: "ROLE NOT FOUND"
      });
    }
  } catch (error) {
    res.status(400).send({
      message: error.message
    });
  }
});

// SOFT DELETE role by id
router.delete('/:id', async function(req, res) {
  try {
    let id = req.params.id;
    let result = await roleModel.findOneAndUpdate(
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
        message: "ROLE DELETED SUCCESSFULLY"
      });
    } else {
      res.status(404).send({
        message: "ROLE NOT FOUND"
      });
    }
  } catch (error) {
    res.status(400).send({
      message: error.message
    });
  }
});

// GET all users by role id
router.get('/:id/users', async function(req, res, next) {
  try {
    let roleId = req.params.id;
    
    // Check if role exists
    let roleExists = await roleModel.findOne({
      isDeleted: false,
      _id: roleId
    });
    
    if (!roleExists) {
      return res.status(404).send({
        message: "ROLE NOT FOUND"
      });
    }
    
    // Get all users with this role
    let users = await userModel.find({
      isDeleted: false,
      role: roleId
    }).populate({
      path: 'role',
      select: 'name description'
    });
    
    res.send(users);
  } catch (error) {
    res.status(400).send({
      message: error.message
    });
  }
});

module.exports = router;

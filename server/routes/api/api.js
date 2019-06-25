const router = require('express').Router();
const Joi = require('@hapi/joi');

const User = require('../../models/User');
const Group = require('../../models/Group');
const Todo = require('../../models/Todo');

router.get('/users/:username', async (req, res) => {
    try {
        const user = await User.findByUsername(req.params.username);
        res.send(user);
    }
    catch(err) {
        res.status(404).send('Error finding user with the given username.');
        console.error(err);
        return;
    }
});

router.get('/groups/:groupid', async (req, res) => {
    try {
        const group = await Group.findByGroupID(req.params.groupid);
        res.send(group);
    }
    catch(err) {
        res.status(404).send('Error finding group with the given username.');
        console.error(err);
        return;
    }
});

router.post('/groups', async (req, res) => {
    // Validate request
    const schema = {
        name: Joi.string().max(80).required(),
        username: Joi.array().length(1).required()
    };
    const validation = Joi.validate(req.body, schema);
    if(validation.error) {
        res.status(400).send(result.error);
        console.error(result);
        return;
    }
    const reqGroup = {
        name: req.body.name,
        usernames: req.body.usernames  
    };

    // Check that username exists
    try {
        await findByUsername(reqGroup.usernames[0]);
    }
    catch(err) {
        res.status(400).send('Specified username does not exist.');
        console.error(err);
        return;
    }

    try {
        const retGroup = await Group.insert(reqGroup);
        res.send(retGroup);
    }
    catch(err) {
        res.status(500).send('Error inserting group.');
        console.error(err);
        return;
    }
});

router.post('/groups/:groupid/todos', async (req, res) => {
    // Validate request
    const schema = {
        title: Joi.string().max(80).required(),
        description: Joi.string()
    };
    const validation = Joi.validate(req.body, schema);
    if(validation.error) {
        res.status(400).send(result.error);
        console.error(result);
        return;
    }
    const reqTodo = {
        title: req.body.title,
        description: req.body.description
    };

    // Check that group exists
    try {
        await Group.findByGroupID(req.params.groupid);
    }
    catch(err) {
        res.status(400).send('Specified group does not exist.');
        console.error(err);
        return;
    }

    try {
        const retTodo = await Todo.insert(req.params.groupid, reqTodo);
        res.send(retTodo);
    }
    catch(err) {
        res.status(500).send('Error inserting todo.');
        console.error(err);
        return;
    }
});

router.post('/groups/:groupid/users', async (req, res) => {
    const username = req.body.username;
    const groupid = req.params.groupid;
    if(!username) {
        res.status(400).send('Username not specified.');
    }

    try {
        await Group.findByGroupID(groupid);
    }
    catch(err) {
        res.status(400).send('Specified group does not exist.');
        console.error(err);
        return;
    }
    try {
        await User.findByUsername(username);
    }
    catch(err) {
        res.status(400).send('Specified username does not exist.');
        console.error(err);
        return;
    }

    try {
        const retGU = Group.insertUsername(groupid, username);
        res.send(retGU);
    }
    catch(err) {
        res.status(500).send('Error inserting user into group.');
        console.error(err);
        return;
    }
});

module.exports = router;

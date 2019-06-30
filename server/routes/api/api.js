const router = require('express').Router();
const Joi = require('@hapi/joi');
const errors = require('pg-promise').errors;

const User = require('../../models/User');
const Group = require('../../models/Group');
const Todo = require('../../models/Todo');

router.get('/users/:userid', async (req, res) => {
    try {
        const user = await User.findByUserID(req.params.userid);
        res.send(user);
    }
    catch(err) {
        res.status(404).send('Error finding user with the given user_id.');
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
        res.status(404).send('Error finding group with the given group_id.');
        console.error(err);
        return;
    }
});

router.post('/groups', async (req, res) => {
    // Validate request
    const schema = {
        name: Joi.string().max(80).required(),
        user_ids: Joi.array().length(1).required()
    };
    const validation = Joi.validate(req.body, schema);
    if(validation.error) {
        res.status(400).send(result.error);
        console.error(result);
        return;
    }
    const reqGroup = {
        name: req.body.name,
        user_ids: req.body.user_ids  
    };

    // Check that user_id exists
    try {
        await findByUserID(reqGroup.user_ids[0]);
    }
    catch(err) {
        res.status(400).send('Specified user_id does not exist.');
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
    const user_id = req.body.user_id;
    const group_id = req.params.groupid;
    if(!user_id) {
        res.status(400).send('user_id not specified.');
        return;
    }

    try {
        await Group.findByGroupID(group_id);
    }
    catch(err) {
        res.status(400).send('Specified group_id does not exist.');
        console.error(err);
        return;
    }
    try {
        await User.findByUserID(user_id);
    }
    catch(err) {
        res.status(400).send('Specified user_id does not exist.');
        console.error(err);
        return;
    }

    try {
        const retGU = Group.insertUserID(group_id, user_id);
        res.send(retGU);
    }
    catch(err) {
        res.status(500).send('Error inserting user into group.');
        console.error(err);
        return;
    }
});

router.put('/users/:userid', async (req, res) => {
    const schema = {
        user_id: Joi.integer().required(),
        nusnet_id: Joi.integer(),
        username: Joi.string(),
        fullname: Joi.string(),
        email: Joi.string(),
        timetableurl: Joi.string(),
    };
    const validation = Joi.validate(req.body, schema);
    if(validation.error) {
        res.status(400).send(result.error);
        console.error(result);
        return;
    }
    const reqUser = {
        user_id: req.body.user_id,
        nusnet_id: req.body.nusnet_id,
        username: req.body.username,
        fullname: req.body.fullname,
        email: req.body.email,
        timetableurl: req.body.timetableurl
    };
    if(reqUser.user_id !== req.params.userid) {
        res.status(400).send('Body and URL user_id do not match.');
        console.error(`Error updating ${req.params.userid}:
            user_id does not match body ${reqUser.user_id}`);
        return;
    }

    try {
        await User.findByUserID(reqUser.user_id);
    }
    catch(err) {
        res.status(400).send('Specified user_id does not exist.');
        console.error(err);
        return;
    }

    try {
        const retUser = await User.update(reqUser);
        res.send(retUser);
    }
    catch(err) {
        res.status(500).send('Error updating user.');
        console.error(err);
        return;
    }
});

router.put('/users/:userid/timetableurl', async (req, res) => {
    const schema = {
        timetableurl: Joi.string().required()
    };
    const validation = Joi.validate(req.body, schema);
    if(validation.error) {
        res.status(400).send(result.error);
        console.error(result);
        return;
    }

    try {
        await User.findByUserID(req.params.userid);
    }
    catch(err) {
        res.status(400).send('Specified user_id does not exist.');
        console.error(err);
        return;
    }

    try {
        const retUser = await User.updateTimetableURL(req.params.userid, req.body.timetableurl);
        res.send(retUser);
    }
    catch(err) {
        res.status(500).send('Error updating user.');
        console.error(err);
        return;
    }
});

router.put('/groups/:groupid/name', async (req, res) => {
    const validation = Joi.validate(req.body, {
        name: Joi.string().required()
    });
    if(validation.error) {
        res.status(400).send(result.error);
        console.error(result);
        return;
    }
    
    try {
        const retGroup = await Group.updateName(req.params.groupid, req.body.name);
        res.send(retGroup);
    }
    catch(err) {
        console.error(err);
        if(err instanceof errors.QueryResultError) {
            if(err.code === errors.queryResultErrorCode.noData) {
                res.status(400).send('Specified group_id does not exist.');
                return;
            }
        }
        res.status(500).send('Error updating group.');
        return;
    }
});

router.put('/todos/:todoid', async (req, res) => {
    if(req.params.todoid !== req.body.todo_id) {
        res.status(400).send('Body and URL todo_id do not match.');
        return;
    }
    const schema = {
        todo_id: Joi.integer.required(),
        title: Joi.string().required(),
        description: Joi.string().required()
    };
    const validation = Joi.validate(req.body, schema);
    if(validation.error) {
        res.status(400).send(result.error);
        console.error(result);
        return;
    }
    const reqTodo = {
        todo_id: req.body.todo_id,
        title: req.body.title,
        description: req.body.description
    };

    try {
        const retTodo = await Todo.update(reqTodo);
        res.send(retTodo);
    }
    catch(err) {
        console.error(err);
        if(err instanceof errors.QueryResultError) {
            if(err.code === errors.queryResultErrorCode.noData) {
                res.status(400).send('Specified todo_id does not exist.');
                return;
            }
        }
        res.status(500).send('Error updating todo.');
        return;
    }
});

router.delete('/groups/:groupid', async (req, res) => {
    try {
        await Group.remove(req.params.groupid);
    }
    catch(err) {
        console.error(err);
        res.status(500).send('Error deleting group.');
        return;
    }
});

router.delete('/groups/:groupid/users/:userid', async (req, res) => {
    try {
        await Group.removeUserID(req.params.groupid, req.params.userid);
    }
    catch(err) {
        console.error(err);
        res.status(500).send('Error removing user from group.');
        return;
    }
});

router.delete('/todos/:todoid', async (req, res) => {
    try {
        await Todo.remove(req.params.todoid);
    }
    catch(err) {
        console.error(err);
        res.status(500).send('Error deleting todo.');
        return;
    }
});

module.exports = router;

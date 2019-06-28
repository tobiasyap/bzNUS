const router = require('express').Router();
const Joi = require('@hapi/joi');

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
        res.status(400).send('Error: body and URL user_id do not match.');
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

module.exports = router;

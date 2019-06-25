const router = require('express').Router();

const User = require('../../models/User');
const Group = require('../../models/Group');

router.get('/users/:username', async (req, res, next) => {
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

router.get('/groups/:groupid', async (req, res, next) => {
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

module.exports = router;

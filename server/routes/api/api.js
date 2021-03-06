const router = require("express").Router();
const Joi = require("@hapi/joi");
const errors = require("pg-promise").errors;

const User = require("../../models/User");
const Group = require("../../models/Group");
const Todo = require("../../models/Todo");
const Event = require("../../models/Event");
const DbUtilities = require("../../models/Utilities");

const Global = require("../../config/Global");

// ---------- GET METHODS ----------

router.get("/users/:userid", async (req, res) => {
  try {
    const user = await User.findByUserID(req.params.userid);
    res.send(user);
  } catch (err) {
    res.status(404).send("Error finding user with the given user_id.");
    console.error(err);
    return;
  }
});

router.get("/groups/:groupid", async (req, res) => {
  try {
    const group = await Group.findByGroupID(req.params.groupid);
    res.send(group);
  } catch (err) {
    res.status(404).send("Error finding group with the given group_id.");
    console.error(err);
    return;
  }
});

router.get("/time", async (req, res) => {
  try {
    const now = await DbUtilities.getNow();
    const timeData = {
      now: now,
      year: Global.YEAR,
      semester: Global.SEMESTER
    };
    res.send(timeData);
  } catch (err) {
    res.status(500).send("Error connecting to database.");
    console.error(err);
    return;
  }
});

// ---------- POST METHODS ----------

router.post("/groups", async (req, res) => {
  // Validate request
  const schema = {
    name: Joi.string()
      .max(80)
      .required(),
    user_ids: Joi.array()
      .length(1)
      .required()
  };
  const validation = Joi.validate(req.body, schema);
  if (validation.error) {
    res.status(400).send(validation.error);
    console.error(validation);
    return;
  }
  const reqGroup = {
    name: req.body.name,
    user_ids: req.body.user_ids
  };

  // Check that user_id exists
  try {
    await User.findByUserID(reqGroup.user_ids[0]);
  } catch (err) {
    res.status(400).send("Specified user_id does not exist.");
    console.error(err);
    return;
  }

  try {
    const retGroup = await Group.insert(reqGroup);
    res.send(retGroup);
  } catch (err) {
    res.status(500).send("Error inserting group.");
    console.error(err);
    return;
  }
});

router.post("/groups/:groupid/todos", async (req, res) => {
  // Validate request
  const schema = {
    title: Joi.string()
      .max(80)
      .required(),
    description: Joi.string()
  };
  const validation = Joi.validate(req.body, schema);
  if (validation.error) {
    res.status(400).send(validation.error);
    console.error(validation);
    return;
  }
  const reqTodo = {
    title: req.body.title,
    description: req.body.description
  };

  // Check that group exists
  try {
    await Group.findByGroupID(Number(req.params.groupid));
  } catch (err) {
    res.status(400).send("Specified group does not exist.");
    console.error(err);
    return;
  }

  try {
    const retTodo = await Todo.insert(Number(req.params.groupid), reqTodo);
    res.send(retTodo);
  } catch (err) {
    res.status(500).send("Error inserting todo.");
    console.error(err);
    return;
  }
});

router.post("/groups/:groupid/users", async (req, res) => {
  let { user_id, username } = req.body;
  const group_id = req.params.groupid;
  if (!user_id && !username) {
    res.status(400).send("Neither user_id nor username specified.");
    return;
  }

  try {
    await Group.findByGroupID(group_id);
  } catch (err) {
    res.status(400).send("Specified group_id does not exist.");
    console.error(err);
    return;
  }

  if (user_id) {
    try {
      await User.findByUserID(user_id);
    } catch (err) {
      res.status(400).send("Specified user_id does not exist.");
      console.error(err);
      return;
    }
  } else {
    try {
      const user = await User.findByUsername(username);
      user_id = user.user_id;
    } catch (err) {
      res.status(400).send("Specified username does not exist.");
      console.error(err);
      return;
    }
  }

  try {
    const retGU = Group.insertUserID(group_id, user_id);
    res.send(retGU);
  } catch (err) {
    res.status(500).send("Error inserting user into group.");
    console.error(err);
    return;
  }
});

router.post("/groups/:groupid/events", async (req, res) => {
  // Validate request
  const schema = {
    title: Joi.string()
      .max(80)
      .required(),
    description: Joi.string(),
    minutes: Joi.string(),
    start_timestamp: Joi.date().iso(),
    end_timestamp: Joi.date().iso()
  };
  const validation = Joi.validate(req.body, schema);
  if (validation.error) {
    res.status(400).send(validation.error);
    console.error(validation);
    return;
  }
  const reqEvent = {
    title: req.body.title,
    description: req.body.description,
    minutes: req.body.minutes,
    start_timestamp: new Date(req.body.start_timestamp),
    end_timestamp: new Date(req.body.end_timestamp)
  };
  if (reqEvent.start_timestamp > reqEvent.end_timestamp) {
    res.status(400).send("start_timestamp cannot be after end_timestamp");
    console.error(
      `Error inserting event: start_timestamp ${reqEvent.start_timestamp}` +
        ` is after end_timestamp ${reqEvent.end_timestamp}.`
    );
    return;
  }

  try {
    const retEvent = await Event.insert(Number(req.params.groupid), reqEvent);
    res.send(retEvent);
  } catch (err) {
    res.status(500).send("Error inserting event.");
    console.error(err);
    return;
  }
});

// ---------- PUT METHODS ----------

router.put("/users/:userid", async (req, res) => {
  const schema = {
    user_id: Joi.number()
      .integer()
      .required(),
    nusnet_id: Joi.string(),
    username: Joi.string().allow(null),
    fullname: Joi.string().allow(null),
    email: Joi.string().allow(null),
    timetableurl: Joi.string().allow(null)
  };
  const validation = Joi.validate(req.body, schema);
  if (validation.error) {
    res.status(400).send(validation.error);
    console.error(validation);
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
  if (reqUser.user_id !== Number(req.params.userid)) {
    res.status(400).send("Body and URL user_id do not match.");
    console.error(`Error updating ${req.params.userid}:
            user_id does not match body ${reqUser.user_id}`);
    return;
  }

  try {
    await User.findByUserID(reqUser.user_id);
  } catch (err) {
    res.status(400).send("Specified user_id does not exist.");
    console.error(err);
    return;
  }

  try {
    const retUser = await User.update(reqUser);
    res.send(retUser);
  } catch (err) {
    const message =
      err.message === "Username already in use"
        ? err.message
        : "Error updating user";
    res.status(500).send(message);
    console.error(err);
    return;
  }
});

router.put("/users/:userid/timetableurl", async (req, res) => {
  const schema = {
    timetableurl: Joi.string().required()
  };
  const validation = Joi.validate(req.body, schema);
  if (validation.error) {
    res.status(400).send(validation.error);
    console.error(validation);
    return;
  }

  try {
    await User.findByUserID(req.params.userid);
  } catch (err) {
    res.status(400).send("Specified user_id does not exist.");
    console.error(err);
    return;
  }

  try {
    console.log("Received: ", req.params.userid, " ", req.body.timetableurl);
    const retUser = await User.updateTimetableURL(
      req.params.userid,
      req.body.timetableurl
    );
    res.send(retUser);
  } catch (err) {
    res.status(500).send("Error updating user.");
    console.error(err);
    return;
  }
});

router.put("/groups/:groupid/name", async (req, res) => {
  const validation = Joi.validate(req.body, {
    name: Joi.string().required()
  });
  if (validation.error) {
    res.status(400).send(validation.error);
    console.error(validation);
    return;
  }

  try {
    const retGroup = await Group.updateName(req.params.groupid, req.body.name);
    res.send(retGroup);
  } catch (err) {
    console.error(err);
    if (err instanceof errors.QueryResultError) {
      if (err.code === errors.queryResultErrorCode.noData) {
        res.status(400).send("Specified group_id does not exist.");
        return;
      }
    }
    res.status(500).send("Error updating group.");
    return;
  }
});

router.put("/todos/:todoid", async (req, res) => {
  if (req.params.todoid !== req.body.todo_id) {
    res.status(400).send("Body and URL todo_id do not match.");
    return;
  }
  const schema = {
    todo_id: Joi.number()
      .integer()
      .required(),
    title: Joi.string().required(),
    description: Joi.string().required()
  };
  const validation = Joi.validate(req.body, schema);
  if (validation.error) {
    res.status(400).send(validation.error);
    console.error(validation);
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
  } catch (err) {
    console.error(err);
    if (err instanceof errors.QueryResultError) {
      if (err.code === errors.queryResultErrorCode.noData) {
        res.status(400).send("Specified todo_id does not exist.");
        return;
      }
    }
    res.status(500).send("Error updating todo.");
    return;
  }
});

router.put("/todos/:todoid/isdone", async (req, res) => {
  const schema = {
    is_done: Joi.boolean().required()
  };
  const validation = Joi.validate(req.body, schema);
  if (validation.error) {
    res.status(400).send(validation.error);
    console.error(validation);
    return;
  }

  try {
    const retTodo = await Todo.updateDone(
      Number(req.params.todoid),
      Boolean(req.body.is_done)
    );
    res.send(retTodo);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating todo.");
    return;
  }
});

router.put("/events/:eventid", async (req, res) => {
  if (Number(req.params.eventid) !== Number(req.body.event_id)) {
    res.status(400).send("Body and URL event_id do not match.");
    return;
  }
  const schema = {
    event_id: Joi.number(),
    title: Joi.string()
      .max(80)
      .required(),
    description: Joi.string(),
    minutes: Joi.string(),
    start_timestamp: Joi.date().iso(),
    end_timestamp: Joi.date().iso()
  };
  const validation = Joi.validate(req.body, schema);
  if (validation.error) {
    res.status(400).send(validation.error);
    console.error(validation);
    return;
  }
  const reqEvent = {
    event_id: Number(req.body.event_id),
    title: req.body.title,
    description: req.body.description,
    minutes: req.body.minutes,
    start_timestamp: new Date(req.body.start_timestamp),
    end_timestamp: new Date(req.body.end_timestamp)
  };
  if (reqEvent.start_timestamp > reqEvent.end_timestamp) {
    res.status(400).send("start_timestamp cannot be after end_timestamp");
    console.error(
      `Error inserting event: start_timestamp ${reqEvent.start_timestamp}` +
        ` is after end_timestamp ${reqEvent.end_timestamp}.`
    );
    return;
  }

  try {
    const retEvent = await Event.update(reqEvent);
    res.send(retEvent);
  } catch (err) {
    if (err instanceof errors.QueryResultError) {
      if (err.code === errors.queryResultErrorCode.noData) {
        res.status(400).send("Specified event_id does not exist.");
        return;
      }
    }
    res.status(500).send("Error updating event.");
    console.error(err);
    return;
  }
});

// ---------- DELETE METHODS ----------

router.delete("/groups/:groupid", async (req, res) => {
  try {
    await Group.remove(Number(req.params.groupid));
    res.send(`Deleted group ${req.params.groupid}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting group.");
    return;
  }
});

router.delete("/groups/:groupid/users/:userid", async (req, res) => {
  try {
    await Group.removeUserID(
      Number(req.params.groupid),
      Number(req.params.userid)
    );
    res.send(
      `Deleted user ${req.params.userid} from group ${req.params.groupid}`
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Error removing user from group.");
    return;
  }
});

router.delete("/todos/:todoid", async (req, res) => {
  try {
    await Todo.remove(req.params.todoid);
    res.send(`Deleted todo ${req.params.todoid}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting todo.");
    return;
  }
});

router.delete("/events/:eventid", async (req, res) => {
  try {
    await Event.remove(Number(req.params.eventid));
    res.send(`Deleted event ${req.params.eventid}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting event.");
    return;
  }
});

module.exports = router;

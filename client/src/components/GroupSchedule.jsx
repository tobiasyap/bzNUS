import React, { Component } from "react";
import PropTypes, { string } from "prop-types";

import Scheduler, {
  SchedulerData,
  ViewTypes,
  DATE_FORMAT
} from "react-big-scheduler";
import "react-big-scheduler/lib/css/style.css";
import moment from "moment";

export default class GroupSchedule extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  fetchUserTimetables = async users => {
    let timetables = {};
    for (let user of users) {
      try {
        if (!user.timetableurl)
          throw new Error("User does not have a timetableurl");
        const timetable = await fetch(`/api/nusmods/${user.timetableurl}`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
          }
        });
        timetables[user.user_id] = timetable;
      } catch (err) {
        timetables[user.user_id] = null;
      }
    }
    return timetables;
  };

  usersToResources = users => {
    let resources = [];
    for (let i in users.filter(user => user.timetableurl)) {
      resources.push({
        id: users[i].user_id,
        name: users[i].username || users[i].fullname
      });
    }
    for (let i in users.filter(user => !user.timetableurl)) {
      resources.push({
        id: users[i].user_id,
        name: users[i].username || users[i].fullname
      });
    }
    return resources;
  };

  getTimetableEventsOnDay(timetable, day) {
    for (let [modName, modData] of Object.entries(timetable)) {
      for (let lesson of modData.filter(m => m.day === day)) {
      }
    }
  }

  render() {
    return <div />;
  }
}

GroupSchedule.propTypes = {
  users: PropTypes.array.isRequired
};

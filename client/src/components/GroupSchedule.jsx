import React, { Component } from "react";
import PropTypes from "prop-types";
import { Spinner } from "reactstrap";

import Scheduler, {
  SchedulerData,
  ViewTypes,
  DATE_FORMAT,
  DATETIME_FORMAT
} from "react-big-scheduler";
import "react-big-scheduler/lib/css/style.css";
import moment from "moment";

export default class GroupSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weekSchedulerData: null,
      loaded: false,
      userTimetables: {}
    };
  }

  componentDidMount() {
    this.fetchAndUpdateSchedulerData();
  }

  componentDidUpdate(prevProps) {
    if(this.props.users !== prevProps.users) {
      this.fetchAndUpdateSchedulerData();
    }
  }

  fetchAndUpdateSchedulerData = async () => {
    const { users } = this.props;
    const userTimetables = await this.fetchUserTimetables(users);
    this.setState({ userTimetables });
    let resources = this.usersToResources(users);

    const firstDayOfWeekMoment = moment().startOf("week");
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    let weekEvents = {};
    for (const day of days) {
      weekEvents[day] = [];
      for (const { user_id } of users) {
        const userEventsOnDay = this.getResourceTimetableEventsOnDay(
          userTimetables[user_id],
          firstDayOfWeekMoment.clone().isoWeekday(day),
          user_id
        );
        weekEvents[day] = weekEvents[day].concat(userEventsOnDay);
      }
    }

    let weekSchedulerData = {};
    for (const day of days) {
      weekSchedulerData[day] = new SchedulerData(
        firstDayOfWeekMoment
          .clone()
          .isoWeekday(day)
          .format(DATE_FORMAT),
        ViewTypes.Day
      );
      weekSchedulerData[day].setResources(resources);
      weekSchedulerData[day].setEvents(weekEvents[day]);
    }

    this.setState({ loaded: true, weekSchedulerData });
  };

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
        }).then(res => res.json());
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
        name: users[i].fullname || users[i].username || `User ${i}`
      });
    }
    for (let i in users.filter(user => !user.timetableurl)) {
      resources.push({
        id: users[i].user_id,
        name: users[i].fullname || users[i].username || `User ${i}`
      });
    }
    return resources;
  };

  getResourceTimetableEventsOnDay = (timetable, dayMoment, resourceId) => {
    let events = [];
    let i = 1;
    for (let [modName, modData] of Object.entries(timetable)) {
      for (let lesson of modData.filter(
        m => m.day === dayMoment.format("dddd")
      )) {
        events.push({
          id: i,
          start: dayMoment.clone().add(lesson.startTime / 100, "hours"),
          end: dayMoment
            .clone()
            .add(lesson.endTime / 100, "hours")
            .format(DATETIME_FORMAT),
          resourceId: resourceId,
          title: `${modName} ${lesson.lessonType}`
        });
        i++;
      }
    }
    events.sort((a, b) => a.start.diff(b.start));
    for (let i in events) {
      events[i].start = events[i].start.format(DATETIME_FORMAT);
      events[i].id = i;
    }
    return events;
  };

  render() {
    const { weekSchedulerData, loaded } = this.state;
    if(!loaded) {
      return (
        <div>
          <Spinner color="primary" />
        </div>
      );
    }
    return (
      <div>
        <Scheduler schedulerData={weekSchedulerData["Monday"]} />
        <Scheduler schedulerData={weekSchedulerData["Tuesday"]} />
        <Scheduler schedulerData={weekSchedulerData["Wednesday"]} />
        <Scheduler schedulerData={weekSchedulerData["Thursday"]} />
        <Scheduler schedulerData={weekSchedulerData["Friday"]} />
        <h1>NUSMods JSON data</h1>
        <p>{JSON.stringify(this.state.userTimetables)}</p>
      </div>
    );
  }
}

GroupSchedule.propTypes = {
  users: PropTypes.array.isRequired
};

import React from "react";
import PropTypes from "prop-types";

import { Spinner } from "reactstrap";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";
import moment from "moment";

class GroupTimeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weekTimelineData: null,
      loaded: false,
      userTimetables: {}
    };
  }
  static propTypes = {
    users: PropTypes.array.isRequired,
    events: PropTypes.array.isRequired,
    onEventClick: PropTypes.func
  };

  componentDidMount() {
    this.fetchAndUpdateTimelineData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.users !== prevProps.users) {
      this.fetchAndUpdateTimelineData();
    }
  }

  fetchAndUpdateTimelineData = async () => {
    this.setState({ loaded: false });
    const { users, events } = this.props;
    const userTimetables = await this.fetchUserTimetables(users);
    this.setState({ userTimetables });
    let timeGroups = this.usersToTimeGroups(users);

    const firstDayOfWeekMoment = moment().startOf("isoWeek");
    const dayMoments = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ].map(d => moment(firstDayOfWeekMoment.clone().isoWeekday(d)));
    const firstDayMoment = dayMoments[0];
    const lastDayMoment = dayMoments[4];

    const weekEvents = events.filter(e => {
      const start = moment(e.start_timestamp);
      const end = moment(e.end_timestamp);
      return (
        start.isBetween(firstDayMoment, lastDayMoment, "[]") ||
        end.isBetween(firstDayMoment, lastDayMoment, "[]")
      );
    });
    let weekItems = {};
    for (const day of dayMoments) {
      const dayName = day.format("dddd");
      weekItems[dayName] = [];
      for (const { user_id } of users) {
        weekItems[dayName] = weekItems[dayName].concat(
          this.getUserItemsOnDay(userTimetables[user_id], day, user_id)
        );
        weekItems[dayName] = weekItems[dayName].concat(
          this.getEventItemsOnDay(weekEvents, day, user_id)
        );
      }

      weekItems[dayName].sort((a, b) => a.start_time.diff(b.start_time));
      // Make sure each item has a unique id
      for (let i = 0; i < weekItems[dayName].length; i++) {
        weekItems[dayName][i].id = i+1; // ids start from 1
      }
    }

    let weekTimelineData = {};
    for (const day of dayMoments) {
      const dayName = day.format("dddd");
      weekTimelineData[dayName] = {
        groups: timeGroups,
        items: weekItems[dayName],
        dayMoment: day
      };
    }

    this.setState({ loaded: true, weekTimelineData });
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

  usersToTimeGroups = users => {
    let timeGroups = [];
    for (let i in users.filter(user => user.timetableurl)) {
      timeGroups.push({
        id: users[i].user_id,
        title: users[i].fullname || users[i].username || `User ${i}`
      });
    }
    for (let i in users.filter(user => !user.timetableurl)) {
      timeGroups.push({
        id: users[i].user_id,
        title: users[i].fullname || users[i].username || `User ${i}`
      });
    }
    return timeGroups;
  };

  getUserItemsOnDay = (timetable, dayMoment, id) => {
    let items = [];
    let i = 1;
    for (let [modName, modData] of Object.entries(timetable)) {
      for (let lesson of modData.filter(
        m => m.day === dayMoment.format("dddd")
      )) {
        items.push({
          id: i,
          group: id,
          title: `${modName} ${lesson.lessonType}`,
          start_time: dayMoment.clone().add(lesson.startTime / 100, "hours"),
          end_time: dayMoment.clone().add(lesson.endTime / 100, "hours"),
        });
        i++;
      }
    }
    return items;
  };

  getEventItemsOnDay = (events, dayMoment, id) => {
    const dayEvents = events.filter(e => {
      return (
        moment(e.start_timestamp).isSame(dayMoment, "day") ||
        moment(e.end_timestamp).isSame(dayMoment, "day")
      );
    });
    let i = 1;
    const dayEventItems = dayEvents.map(e => {
      return {
        id: i++,
        group: id,
        title: e.title,
        start_time: moment(e.start_timestamp),
        end_time: moment(e.end_timestamp),
        _event_id: e.event_id,
      };
    });
    return dayEventItems;
  };

  render() {
    const { weekTimelineData, loaded } = this.state;

    if (!loaded) {
      return (
        <div>
          <Spinner color="primary" />
        </div>
      );
    }

    const { startHour, endHour } = this.getWeekStartEndHours(
      weekTimelineData,
      8,
      18
    );
    return (
      <div>
        <Timeline
          {...this.makeTimelineProps(
            weekTimelineData,
            "Monday",
            startHour,
            endHour
          )}
        />
        <p> </p>
        <Timeline
          {...this.makeTimelineProps(
            weekTimelineData,
            "Tuesday",
            startHour,
            endHour
          )}
        />
        <p> </p>
        <Timeline
          {...this.makeTimelineProps(
            weekTimelineData,
            "Wednesday",
            startHour,
            endHour
          )}
        />
        <p> </p>
        <Timeline
          {...this.makeTimelineProps(
            weekTimelineData,
            "Thursday",
            startHour,
            endHour
          )}
        />
        <p> </p>
        <Timeline
          {...this.makeTimelineProps(
            weekTimelineData,
            "Friday",
            startHour,
            endHour
          )}
        />
        <p> </p>
      </div>
    );
  }

  makeTimelineProps = (weekTimelineData, day, startHour, endHour) => {
    const minTime = weekTimelineData[day].dayMoment.clone().hour(startHour);
    const maxTime = weekTimelineData[day].dayMoment.clone().hour(endHour);
    return {
      groups: weekTimelineData[day].groups,
      items: weekTimelineData[day].items,
      canMove: false,
      defaultTimeStart: minTime,
      defaultTimeEnd: maxTime,
      onTimeChange: (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
        if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
          updateScrollCanvas(minTime, maxTime);
        } else if (visibleTimeStart < minTime) {
          updateScrollCanvas(
            minTime,
            minTime + (visibleTimeEnd - visibleTimeStart)
          );
        } else if (visibleTimeEnd > maxTime) {
          updateScrollCanvas(
            maxTime - (visibleTimeEnd - visibleTimeStart),
            maxTime
          );
        } else {
          updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
        }
      },
      onItemSelect: (itemId, e, time) => this.onItemClick(itemId, e, time, day),
      onItemClick: (itemId, e, time) => this.onItemClick(itemId, e, time, day),
    };
  };

  /**
   * Returns the start and end hours for the current weekTimelineData. The start
   * hour will be set to the earliest item start hour if it is earlier than the
   * default. The end hour will be the latest item end hour if it is later than
   * the default.
   * @param {Object} weekTimelineData - The object containining timeline data
   *    for the week. The item arrays MUST be sorted in ascending order of
   *    start_time.
   * @param {Number} defaultStartHour - The default starting hour for the week.
   * @param {Number} defaultEndHour - The default ending hour for the week.
   * @returns {Object} - Object containing the startHour and endHour Numbers
   *    for the week.
   */
  getWeekStartEndHours = (
    weekTimelineData,
    defaultStartHour = 8,
    defaultEndHour = 18
  ) => {
    // Each item in each day in weekTimelineData must be sorted by ascending start_time

    let startHour = defaultStartHour;
    for (const dayTimelineData of Object.values(weekTimelineData)) {
      if (dayTimelineData.items.length > 0) {
        const dayStartMoment = dayTimelineData.items[0].start_time;
        const curStartMoment = dayStartMoment.clone().hour(startHour);
        if (curStartMoment.isAfter(dayStartMoment)) {
          startHour = dayStartMoment.hour();
        }
      }
    }

    let endHour = defaultEndHour;
    for (const dayTimelineData of Object.values(weekTimelineData)) {
      if (dayTimelineData.items.length > 0) {
        let dayEndMoment = dayTimelineData.items[0].end_time;
        for (const item of dayTimelineData.items) {
          if (item.end_time.isAfter(dayEndMoment)) {
            dayEndMoment = item.end_time;
          }
        }
        const curEndMoment = dayEndMoment.clone().hour(endHour);
        if (dayEndMoment.isAfter(curEndMoment)) {
          endHour = dayEndMoment.hour();
        }
      }
    }

    return {
      startHour,
      endHour
    };
  };

  onItemClick = (itemId, e, time, day) => {
    this.props.onEventClick(this.state.weekTimelineData[day].items[itemId-1]._event_id);
  };
}

export default GroupTimeline;

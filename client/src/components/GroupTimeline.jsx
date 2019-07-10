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
    users: PropTypes.array.isRequired
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
    const { users } = this.props;
    const userTimetables = await this.fetchUserTimetables(users);
    this.setState({ userTimetables });
    let timeGroups = this.usersToTimeGroups(users);

    const firstDayOfWeekMoment = moment().startOf("isoWeek");
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    let weekItems = {};
    for (const day of days) {
      weekItems[day] = [];
      for (const { user_id } of users) {
        const userItemsOnDay = this.getUserItemsOnDay(
          userTimetables[user_id],
          firstDayOfWeekMoment.clone().isoWeekday(day),
          user_id
        );
        weekItems[day] = weekItems[day].concat(userItemsOnDay);
      }
      weekItems[day].sort((a, b) => a.start_time.diff(b.start_time));
      // Make sure each item has a unique id
      for (let i = 0; i < weekItems[day].length; i++) {
        weekItems[day][i].id = i;
      }
    }

    let weekTimelineData = {};
    for (const day of days) {
      weekTimelineData[day] = {
        groups: timeGroups,
        items: weekItems[day],
        dayMoment: firstDayOfWeekMoment.clone().isoWeekday(day)
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
          end_time: dayMoment.clone().add(lesson.endTime / 100, "hours")
        });
        i++;
      }
    }
    return items;
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
      defaultTimeStart: minTime,
      defaultTimeEnd: maxTime,
      onTimeChange: (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
        if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
          updateScrollCanvas(minTime, maxTime)
        } else if (visibleTimeStart < minTime) {
          updateScrollCanvas(minTime, minTime + (visibleTimeEnd - visibleTimeStart))
        } else if (visibleTimeEnd > maxTime) {
          updateScrollCanvas(maxTime - (visibleTimeEnd - visibleTimeStart), maxTime)
        } else {
          updateScrollCanvas(visibleTimeStart, visibleTimeEnd)
        }
      }
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
}

export default GroupTimeline;

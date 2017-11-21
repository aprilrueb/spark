import React from 'react';
import Event from './Event';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);
function tripDates(startDate, endDate){
  let range = moment.range(startDate, endDate);
  range = Array.from(range.by('day')).map(day => {
    return day.toDate().toDateString();
  });
  return range;
}

export default class Itinerary extends React.Component {
  constructor(props) { //props is the events we tell the bot to pin?
    super(props);
    this.state = {
      events: [],
      dates: tripDates(props.startDate, props.endDate),
      objectVersion: {}
    };
  }

  componentDidMount() {
    this.props.room.orderBy('time').onSnapshot((snapshot) => {
      this.setState({events: snapshot.docs});
    });
  }

  render() {
    console.log('WHAT IS THIS: ', this.props.endDate);
    console.log('MOMENT: ', moment(this.props.startDate).format());
    return (
      <div className="event-box">
        <h3>ITINERARY</h3>
        <div>{
          this.state.dates.map((date, index) => (
            <div className="date-box" key={index}>
              <p className="date-text">{date}</p>
              <div>
                {this.state.events.map((event, idx) => {
                  const { itineraryStatus, time } = event.data();
                  const eventDate = time.toDateString && time.toDateString();
                  return itineraryStatus && (eventDate === date ) && (
                      <Event key={idx} {...event.data() } />
                  );}
                )}
              </div>
            </div>
          ))
        }</div>
      </div>
    );
  }
}

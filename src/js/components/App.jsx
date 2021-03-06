/* eslint-disable no-console */
/* eslint-disable import/extensions */
import React from 'react';

import Form from './Form.jsx';
import CalContainer from './CalContainer.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    // state will keep track of input fields as well as an array of entry submissions
    this.state = {
      date: '',
      time: '',
      location: '',
      people: '',
      entry: [],
    };
    this.handleDate = this.handleDate.bind(this);
    this.handleTime = this.handleTime.bind(this);
    this.handleLoc = this.handleLoc.bind(this);
    this.handlePeople = this.handlePeople.bind(this);
    this.clickSubmit = this.clickSubmit.bind(this);
    this.clickUndo = this.clickUndo.bind(this);
  }

  componentDidMount() {
    fetch('/api/')
      .then((res) => res.json())
      .then((entry) => {
        // eslint-disable-next-line no-param-reassign
        if (!Array.isArray(entry)) entry = [];
        return this.setState({ entry });
      })
      .catch((err) => console.log('App.jsx componentDidMount: get entries error', err));
  }

  handleDate(e) {
    this.setState({ date: e.target.value });
  }

  handleTime(e) {
    this.setState({ time: e.target.value });
  }

  handleLoc(e) {
    this.setState({ location: e.target.value });
  }

  handlePeople(e) {
    this.setState({ people: e.target.value });
  }

  // when submit button is clicked
  // all the state properties will be added into the entry array as an object
  clickSubmit() {
    this.setState((state) => {
      const entryObj = {
        date: state.date,
        time: state.time,
        location: state.location,
        people: state.people,
      };
      // use a fetch request to post new entry into the database
      fetch('/api/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryObj),
      })
        .then((response) => response.json())
        .then((data) => console.log('Successful Entry Submitted', data))
        .catch((err) => console.log('App.jsx clickSubmit: entry submit error', err));
      // entry array of objects is updated with new entry object
      const entry = [...state.entry];
      entry.push(entryObj);
      return { entry };
    });
  }

  // when undo button is clicked, the last entry in the array will be removed
  clickUndo() {
    this.setState((state) => {
      const entry = [...state.entry];
      const deletedEntry = entry.pop();

      // use a fetch request to delete entry in the database
      fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deletedEntry),
      })
        .then((response) => response.json())
        .then((data) => console.log('Successful Entry Submitted', data))
        .catch((err) => console.log('App.jsx clickSubmit: entry submit error', err));

      return { entry };
    });
  }

  render() {
    const {
      date, time, location, people, entry,
    } = this.state;
    return (
      <div>
        <Form
          handleDate={this.handleDate}
          handleTime={this.handleTime}
          handleLoc={this.handleLoc}
          handlePeople={this.handlePeople}
          clickSubmit={this.clickSubmit}
          clickUndo={this.clickUndo}
          date={date}
          time={time}
          location={location}
          people={people}
        />
        <CalContainer
          entry={entry}
        />
      </div>
    );
  }
}

export default App;

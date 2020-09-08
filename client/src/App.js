import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      activeItem: {
        id: null,
        title: '',
        completed: false,
      },
      editing: false,
    }
    this.fetchTask = this.fetchTask.bind(this)
  }

  componentDidMount() {
    this.fetchTask()
  }

  fetchTask() {
    console.log('Fetching...');
    fetch('http://localhost:8000/api/task-list/')
      .then((response) => response.json())
      .then(data => {
        this.setState({
          todoList: data,
        })
      })
  }

  render() {
    let task = this.state.todoList
    return (
      <React.Fragment>
        <div className="container">
          <div id="task-container">
            <div id="form-wrapper">
              <form id="form">
                <div className="flex-wrapper">
                  <div style={{ flex: 6 }}>
                    <input id="title" className="form-control" name="title" type="text" placeholder="Whats you next task" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <input id="submit" className="btn btn-warning" type="submit" name="Add" value="Add a new task" />
                  </div>
                </div>
              </form>
            </div>
            <div id="list-wrapper">
              {task.map(function (task, index) {
                return (
                  <div key={index} className="task-wrapper flex-wrapper">
                    <span>{task.title}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

}

export default App;

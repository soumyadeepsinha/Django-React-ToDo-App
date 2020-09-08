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
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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

  handleChange(e) {
    let name = e.target.name
    let value = e.target.value
    console.log('Name: ', name, 'Value: ', value);
    this.setState({
      activeItem: {
        // spread operator to update the child
        ...this.state.activeItem,
        title: value
      }
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    console.log('Item: ', this.state.activeItem);
    let url = ' http://127.0.0.1:8000/api/task-create/'
    fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(this.state.activeItem)
    }).then((response) => {
      this.fetchTask()
      this.setState({
        activeItem: {
          id: null,
          title: '',
          completed: false,
        },
        completed: false
      })
    }).catch(function (err) {
      console.log('Error: ', err);
    })
  }

  render() {
    let task = this.state.todoList
    return (
      <React.Fragment>
        <div className="container">
          <div id="task-container">
            <div id="form-wrapper">
              <form onSubmit={this.handleSubmit} id="form">
                <div className="flex-wrapper">
                  <div style={{ flex: 6 }}>
                    <input onChange={this.handleChange} id="title" className="form-control" name="title" type="text" autoComplete="off" placeholder="Whats you next task" />
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
                    <div style={{ flex: 7 }}>
                      <span>{task.title}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <button className="btn btn-sm btn-outline-info">Edit</button>
                    </div>
                    <div style={{ flex: 2 }}>
                      <button className="btn btn-sm btn-outline-dark delete">x</button>
                    </div>
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

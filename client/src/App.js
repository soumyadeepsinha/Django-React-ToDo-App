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
    this.getCookie = this.getCookie.bind(this)
    this.todoEdit = this.todoEdit.bind(this)
    this.todoDelete = this.todoDelete.bind(this)
    this.strikeUnstrike = this.strikeUnstrike.bind(this)
  };

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      let cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        // does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  componentWillMount() {
    this.fetchTask()
  }

  fetchTask() {
    console.log('Fetching...')

    fetch('http://127.0.0.1:8000/api/task-list/')
      .then(response => response.json())
      .then(data =>
        this.setState({
          todoList: data
        })
      )
  }

  handleChange(e) {
    let name = e.target.name
    let value = e.target.value
    console.log('Name: ', name)
    console.log('Value: ', value)

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
    console.log('Item: ', this.state.activeItem)

    let csrftoken = this.getCookie('csrftoken')

    let url = 'http://127.0.0.1:8000/api/task-create/'

    if (this.state.editing === true) {
      url = `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}/`
      this.setState({
        editing: false
      })
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify(this.state.activeItem)
    }).then((response) => {
      this.fetchTask()
      this.setState({
        activeItem: {
          id: null,
          title: '',
          completed: false,
        }
      })
    }).catch(function (error) {
      console.log('Error: ', error)
    })

  }

  todoEdit(task) {
    this.setState({
      activeItem: task,
      editing: true,
    })
  }


  todoDelete(task) {
    let csrftoken = this.getCookie('csrftoken')

    fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}/`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
    }).then((response) => {
      // re-render tasks after delete
      this.fetchTask()
    })
  }

  strikeUnstrike(task) {

    task.completed = !task.completed
    let csrftoken = this.getCookie('csrftoken')
    let url = `http://127.0.0.1:8000/api/task-update/${task.id}/`

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify({ 'completed': task.completed, 'title': task.title })
    }).then(() => {
      this.fetchTask()
    })

    console.log('Task :', task.completed)
  }

  render() {
    let tasks = this.state.todoList
    let self = this
    return (
      <React.Fragment>
        <div className="container">
          <div id="task-container">
            <div id="form-wrapper">
              <form onSubmit={this.handleSubmit} id="form">
                <div className="flex-wrapper">
                  <div style={{ flex: 6 }}>
                    <input onChange={this.handleChange} className="form-control" id="title" value={this.state.activeItem.title} type="text" name="title" placeholder="Add your news tasks..." />
                  </div>

                  <div style={{ flex: 1 }}>
                    <input id="submit" className="btn btn-warning" type="submit" value="Add a new task" />
                  </div>
                </div>
              </form>
            </div>

            <div id="list-wrapper">
              {tasks.map(function (task, index) {
                return (
                  <div key={index} className="task-wrapper flex-wrapper">
                    <div onClick={() => self.strikeUnstrike(task)} style={{ flex: 7 }}>

                      {task.completed === false ?
                        (<span>{task.title}</span>) :
                        (<strike>{task.title}</strike>)
                      }
                    </div>

                    <div style={{ flex: 1 }}>
                      <button onClick={() => self.todoEdit(task)} className="btn btn-sm btn-outline-info">Edit</button>
                    </div>

                    <div style={{ flex: 1 }}>
                      <button onClick={() => self.todoDelete(task)} className="btn btn-sm btn-outline-danger delete">x</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default App;
import React, { Component } from 'react';
import './App.scss';
import firebase, { auth, provider } from './firebase.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      firstname: '',
      lastname: '',
      age:'',
      height:'',
      users: [],
      user: null //Hold the user state
    }
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.login = this.login.bind(this);
      this.logout = this.logout.bind(this);
  }

//Handle Change in input
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

//Handle Submit section
  handleSubmit(e) { 
    e.preventDefault();
    const itemsRef = firebase.database().ref('users');
    const user = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      age: this.state.age,
      height:this.state.height
    }
    itemsRef.push(user);
    this.setState({
      firstname: '',
      lastname: '',
      age: '',
      height: ''
    });
    itemsRef.on('value', (snapshot) => {
      console.log(snapshot.val()); //Displays the Firebase API Data in Console
    });
    
  }

  logout() {
    auth.signOut()
    .then(() => {
      this.setState({
        user: null
      });
    });
  }

  login() {
    auth.signInWithPopup(provider) 
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }

  // Firebase API to get the data
  
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } 
    });

    const itemsRef = firebase.database().ref('users');
    itemsRef.on('value', (snapshot) => {
      let users = snapshot.val();
      let newState = [];
      for (let user in users) {
        newState.push({
          id: user,
          firstname: users[user].firstname,
          lastname: users[user].lastname,
          age: users[user].age,
          height: users[user].height
        });
      }
      this.setState({
        users: newState
      });
    });
  }

//Remove user

removeItem(UserID) {
  const itemRef = firebase.database().ref(`/users/${UserID}`);
  itemRef.remove();
}

  render() {
    return (
      <div className='app'>
        <header>
            <div className='wrapper'>
              <h1>User Data</h1>
              {this.state.user ?
                <button className="SignIn-OutButton" onClick={this.logout}>Log Out</button>                
                :
                <button className="SignIn-OutButton" onClick={this.login}>Log In</button>              
              }
            </div>
        </header>
        {
          this.state.user ?
            <div>
              <div className='user-profile'>
              <img src={this.state.user.photoURL} />
              </div>
            </div>
            :
            <div className='wrapper'>
              <p></p>
            </div>
        }
        {
          this.state.user ?
            <div className='container' >
              <div class="row">
                <div class="col-md-6">
                  <section className='add-user'>
                    <form onSubmit={this.handleSubmit}>
                      <input type="text" name="firstname" placeholder="What's your first name?" onChange={this.handleChange} value={this.state.user.displayName || this.state.user.email} required/>
                      <input type="text" name="lastname" placeholder="What's your surname?" onChange={this.handleChange} value={this.state.lastname} required/>
                      <input type="text" name="age" placeholder="What's your age?" onChange={this.handleChange} value={this.state.age} required/>
                      <input type="text" name="height" placeholder="What's your height?" onChange={this.handleChange} value={this.state.height} required/>
                      <button>Add user</button>
                    </form>         
                  </section>
              </div>
          <div class="col-md-6">
            <section className='display-user'>
              <div className='wrapper'>
              { 
                <ul>
                {
                  this.state.users.map((user) => 
                  {
                  return (
                    <li key={user.id}>
                      <p>{user.firstname}</p>
                      <p>{user.lastname}</p>
                      <p>{user.age}</p>
                      <p>{user.height}</p>
                      <button onClick={() => this.removeItem(user.id)}>Remove User</button>
                    </li>
                    )
                  })
                }
                </ul> 
              }
              </div>           
            </section>
          </div>
        </div>
      </div>
      :
      <div className='wrapper'>
        <p>You must be logged in to see the potluck list and submit to it.</p>
        </div>
          }
    </div>
    );
  }
}
export default App;
import React, { Component } from 'react';
import firebase from './firebase';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      fullname: null,
      email: null,
      photo: null,
      isLoading: true,
    }
  }

  componentDidMount() {
    firebase.database()
      .ref('/user')
      .on('value', snapshot => {
        const data = snapshot.val();
        this.setState({ data: data, isLoading: false });
      });
  }

  createData = (val) => {
    val.preventDefault();
    const { fullname, email, photo } = this.state;
    firebase.database()
      .ref('/user')
      .push()
      .set({ fullname, email, photo })
      .then(() => console.log('Data set.'));
  }

  editData = (id) => {
    const data = {
      email: 'yuisenpai@gmail.com',
      fullname: 'Yui Hirasawa Senpai',
      photo: 'https://cdn.myanimelist.net/images/characters/11/48547.jpg',
    }

    firebase.database()
      .ref(`/user/${id}`)
      .update(data);
  }

  deleteData = (id) => {
    firebase.database()
      .ref(`/user/${id}`)
      .remove();
  }

  render() {
    const { data, isLoading } = this.state;
    return (
      <div>
        <center>
          <br /><br /><br />
          <h3>Tambah Data</h3>
          <form onSubmit={this.createData}>
            <label htmlFor="fullname">Fullname</label><br />
            <input
              id="fullname"
              type="text"
              name="fullname"
              required
              onChange={(e) => {
                this.setState({ fullname: e.target.value })
              }}
            /><br /><br />

            <label htmlFor="email">Email</label><br />
            <input
              id="email"
              type="email"
              name="email"
              required
              onChange={(e) => {
                this.setState({ email: e.target.value })
              }}
            /><br /><br />

            <label htmlFor="image">Link Photo</label><br />
            <input
              id="image"
              type="text"
              name="image"
              required
              onChange={(e) => {
                this.setState({ photo: e.target.value })
              }}
            /><br /><br />
            <button type="submit">Tambah</button>
          </form>

          <br /><br /><br />
          <h3>List Member</h3>
          <table border="1">
            <thead>
              <tr>
                <th>Image</th>
                <th>Fullname</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && data !== null && (
                Object.keys(data).map((val, key) => (
                  <tr key={key}>
                    {console.log(val)}
                    <td>
                      <img src={data[val].photo} alt={data[val].fullname} width="100" />
                    </td>
                    <td>{data[val].fullname}</td>
                    <td>{data[val].email}</td>
                    <td>
                      <button onClick={() => this.editData(val)}>Edit</button>
                      <button onClick={() => this.deleteData(val)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </center>
      </div>
    )
  }
}

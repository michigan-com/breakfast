
import React, { Component } from 'react';
import xr from 'xr';
import { connect } from 'react-redux';

import DataTable from '../components/data-table';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      usersByPhotoCount: [],
    };
  }

  componentWillMount() {
    xr.get('/admin/photos/all')
      .then((resp) => {
        const { photos } = resp.data;
        const users = {};
        const markets = {};
        for (const photo of photos) {
          const { email } = photo;
          const domain = /(.+)@(.+)/.exec(email)[2];
          if (!(email in users)) users[email] = 0;
          if (!(domain in markets)) markets[domain] = 0;
          users[email] += 1;
          markets[domain] += 1;
        }
        const usersByPhotoCount = Object.keys(users)
          .reduce((a, email) => {
            a.push([email, users[email]]);
            return a;
          }, [])
          .sort((a, b) => (b[1] - a[1]));
        const marketsByPhotoCount = Object.keys(markets)
          .reduce((a, domain) => {
            a.push([domain, markets[domain]]);
            return a;
          }, [])
          .sort((a, b) => (b[1] - a[1]));


        this.setState({ usersByPhotoCount, marketsByPhotoCount });
      });
  }

  render() {
    return (
      <div className="admin-container">
        <DataTable
          name="Top Users by Photos"
          subtitle="These users produce the most photos"
          columns={['email', 'photo count']}
          sortColIndex={1}
          data={this.state.usersByPhotoCount}
        />
        <DataTable
          name="Top Markets By Photos"
          subtitle="These publications produce the most photos"
          columns={['market', 'photo count']}
          sortColIndex={1}
          data={this.state.marketsByPhotoCount}
        />
        <DataTable
          name="All Users"
          ajaxUrl="/admin/users/all/"
          columns={['email', 'admin']}
          formatData={
              (resp) => {
                const { users } = resp;
                return users.reduce((a, u) => {
                  a.push([u.email, u.admin ? 'yes' : ' ']);
                  return a;
                }, []);
              }
            }
        />
      </div>
    );
  }
}

// export default connect()(App);

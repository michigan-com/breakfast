
import React, { Component } from 'react';
import { connect } from 'react-redux';

import DataTable from '../components/data-table';

export default class App extends Component {


  render() {
    return (
      <div className="admin-container">
        <DataTable
          name="Top Users by Photos"
          subtitle="These users produce the most photos"
          ajaxUrl="/admin/photos/all/"
          columns={['email', 'photo count']}
          formatData={
            (resp) => {
              const { photos } = resp;
              const usersByPhotoCount = {};
              for (const photo of photos) {
                const { email } = photo;
                if (!(email in usersByPhotoCount)) usersByPhotoCount[email] = 0;
                usersByPhotoCount[email] += 1;
              }
              return Object.keys(usersByPhotoCount)
                .reduce((a, email) => {
                  a.push([email, usersByPhotoCount[email]]);
                  return a;
                }, [])
                .sort((a, b) => (b[1] - a[1]));
            }
          }
        />
      </div>
    );
  }
}

// export default connect()(App);


import React, { Component } from 'react';
import xr from 'xr';

import DataTable from '../components/data-table';

export default class UsersAdmin extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fetchingUsers: false,
      searchValue: '',
      searchValueError: '',

      userSearchResults: [],
    };

    this.removeAdmin = this.removeAdmin.bind(this);
    this.addAdmin = this.addAdmin.bind(this);
    this.fetchUsers = this.fetchUsers.bind(this);
    this.searchValueChange = this.searchValueChange.bind(this);
  }

  removeAdmin(email) {
    return () => {
      this.setState({ fetchingUsers: true });
      xr.post('/admin/users/remove-admin/', { email })
        .then(() => { this.fetchUsers(); });
    };
  }

  addAdmin(email) {
    return () => {
      this.setState({ fetchingUsers: true });
      xr.post('/admin/users/make-admin/', { email })
        .then(() => { this.fetchUsers(); });
    };
  }

  fetchUsers(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const { searchValue } = this.state;
    if (!searchValue) {
      this.setState({ searchValue: 'Please specify a username' });
      return;
    }

    if (!this.state.fetchingUsers) this.setState({ fetchingUsers: true });

    xr.get('/admin/user/', { email: searchValue })
      .then((resp) => {
        const { users } = resp;
        this.setState({ userSearchResults: users, fetchingUsers: false });
      }, (err) => {
        this.setState({ fetchingUsers: false, earchValueError: err });
      });
  }

  searchValueChange(e) {
    const searchValue = e.target.value;
    this.setState({ searchValue });
  }

  renderSearchResults() {
    const { userSearchResults, fetchingUsers } = this.state;

    if (fetchingUsers) {
      return <h2>Fetching users...</h2>;
    } else if (!userSearchResults.length) {
      return <h2>No results loaded</h2>;
    }

    return (
      <div className="search-results">
        {userSearchResults.map((user, index) => {
          const toggleClassName = ['admin-toggle'];
          if (user.admin) toggleClassName.push('remove');
          else toggleClassName.push('add');
          return (
            <div className="search-result" key={`search-result-${index}`}>
              <div className="email">{user.email}</div>
              <div
                className={toggleClassName.join(' ')}
                onClick={user.admin ? this.removeAdmin(user.email) : this.addAdmin(user.email)}
              >
                {user.admin ? 'Remove' : 'Add'}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  renderPermissionsPicker() {
    const { searchValue, fetchingUsers } = this.state;
    const searchButtonClass = ['search-button'];
    if (!searchValue || fetchingUsers) searchButtonClass.push('disabled');

    const onSearchClick = searchValue && !fetchingUsers ? this.fetchUsers : () => (false);

    return (
      <div className="user-permission-picker">
        <form className="search-container" onSubmit={onSearchClick}>
          <input
            type="text"
            onChange={this.searchValueChange}
            placeholder="Search a user..."
            value={searchValue}
          />
          <input
            type="submit"
            className={searchButtonClass.join(' ')}
            value="Search"
            disabled={!searchValue}
          />
        </form>
        <div className="search-results-container">
          {this.renderSearchResults()}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="user-admin">
        <div className="user-permission-picker-container">
          {this.renderPermissionsPicker()}
        </div>

        <div className="table-container">
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
      </div>
    );
  }
}

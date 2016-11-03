
import { createSelector } from 'reselect';

const photoSelector = state => state.Photos;

export const getPhotoCounts = createSelector(
  photoSelector,
  (Photos) => {
    const { photos } = Photos;

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
    return { marketsByPhotoCount, usersByPhotoCount };
  }
);

export const getPhotoTimeSeries = createSelector(
  photoSelector,
  (Photos) => {
    const { photos } = Photos;

    for (const photo of photos) {

    }
  }
);

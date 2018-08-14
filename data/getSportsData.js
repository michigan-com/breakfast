
import fetch from 'node-fetch';
import fs from 'fs';

const sports = [
  'mlb',
  'mls',
  'nba',
  'ncaab',
  'ncaaf',
  'nfl',
  'nhl',
  'wnba',
]

function fetchSport(sport) {
  var fetchURL = `https://sports-presenter.production.gannettdigital.com/SportsData/Mobile.svc/team/${sport}`;
  fetch(fetchURL)
    .then((resp) => (resp.json()))
    .then((data) => {
      fs.writeFile(`./data/sports/${sport}.json`, JSON.stringify(data), (err) => {
        if (err) console.log(`Failed to save ${sports}: ${err}`)
        else console.log(`${sports} is saved!`)
      });
    })
    .catch((e) => {
      console.error(`Failed to fetch ${sport}: ${e}`)
    })

}

for (var i = 0; i < sports.length; i++) {
  var sport = sports[i];
  fetchSport(sport);
}

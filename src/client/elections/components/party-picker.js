'use strict';

import React, { PropTypes } from 'react';

export default function PartyPicker(props) {
  const { partyOptions, currentParty, onPartyPick } = props;

  return (
    <div className='party-picker-container'>
      {
        partyOptions.map((party, i) => {
          const isActive = party.abbr === currentParty.abbr;
          const style = { backgroundColor: party.color };
          const onClick = isActive ?  () => {} : onPartyPick(party);
          return (
            <div
              className={`party-option-container ${isActive ? 'active' : ''}`}
              key={`party-${i}`}
              onClick={onClick}
              style={style}
              >
              <div className={`party-option ${party.abbr}`}>
                {party.abbr}
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

PartyPicker.propTypes = {
  partyOptions: PropTypes.array,
  currentParty: PropTypes.object,
  onPartyPick: PropTypes.func,
}

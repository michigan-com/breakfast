'use strict';

import React, { PropTypes } from 'react';

export default function PartyPicker(props) {
  const { partyOptions, currentParty, onPartyPick, onRemoveParty } = props;

  return (
    <div className='party-picker-container'>
      <div className='party-picker'>
        {
          partyOptions.map((party, i) => {
            if (party.abbr === 'neutral') return null;
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
      <div className='add-neutral-party' onClick={onRemoveParty}>
        Remove party
      </div>
    </div>
  )
}

PartyPicker.propTypes = {
  partyOptions: PropTypes.array,
  currentParty: PropTypes.object,
  onPartyPick: PropTypes.func,
  onRemoveParty: PropTypes.func,
}

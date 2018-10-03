'use strict';

import React, { PropTypes, Component } from 'react';

export default class PartyPicker extends Component {
  static propTypes = {
    partyOptions: PropTypes.array,
    currentParty: PropTypes.object,
    onPartyPick: PropTypes.func,
    onRemoveParty: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      showName: '',
    }

    this.showName = this.showName.bind(this);
    this.hideName = this.hideName.bind(this);
  }

  showName(abbr) {
    return () => {
      this.setState({ showName: abbr });
    }
  }

  hideName() { this.setState({ showName: '' }); }


  render() {
    const { partyOptions, currentParty, onPartyPick, onRemoveParty } = this.props;

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
                  onMouseEnter={this.showName(party.abbr)}
                  onMouseLeave={this.hideName}
                  >
                  <div className={`party-option ${party.abbr} ${this.state.showName === party.abbr ? 'show-full-name' : ''}`}>
                    {party.abbr}
                    <span className='full-party-name-container'>
                      <span className='full-party-name' style={style}>{party.name}</span>
                    </span>
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className='add-neutral-party' onClick={onRemoveParty}>
          Remove party / Independent
        </div>
      </div>
    )
  }
}

'use strict';

import React from 'react';

export default class CornerPicker extends React.Component {
  static cornerOptions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

  renderCorner = (corner, index) => {
    let cornerClassName = 'corner';
    if (corner === this.props.activeCorner) cornerClassName += ' active';

    return (<div
      className={cornerClassName}
      key={`corner-${this.props.name}-${index}`}
      onClick={() => { this.props.callback(corner); }}
    ></div>);
  }

  render() {
    return (
      <div className="corner-picker">
        {CornerPicker.cornerOptions.map(this.renderCorner)}
      </div>
    );
  }
}

CornerPicker.propTypes = {
  activeCorner: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  callback: React.PropTypes.func,
};

CornerPicker.defaultProps = {
  callback: () => { },
};

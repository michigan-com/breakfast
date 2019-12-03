
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getLinesOfText } from '../helpers/svg-text-line';
import { stateFaceOptions } from '../../../actions/states';

export default class Results02 extends Component {
    static propTypes = {
        imageMetrics: PropTypes.object,
        text: PropTypes.array,
        candidates: PropTypes.array,
        logo: PropTypes.object,
        activeTemplate: PropTypes.object,
    }

    renderText() {
        const { candidates, text } = this.props;
        const { totalHeight, width, fontSize, lineHeight } = this.props.imageMetrics;
        const { selectedStateIndex } = this.props.activeTemplate;

        const candidate = candidates[0];

        const candidateTop = totalHeight * 0.25;

        const textWidth = width * 0.7;
        const textLeft = (width / 2 ) - (textWidth / 2);
        const lines = getLinesOfText(text[0], fontSize, lineHeight, textWidth * 1.2);
        const textTop = candidateTop + (fontSize * lineHeight);

        const stateIconTop = textTop + (fontSize * lineHeight * (lines.length + 2));

        return (
            <g>
                <text className='candidate-text' y={candidateTop} x={textLeft}>
                    {`${candidate.name}`}
                    <tspan style={{fontFamily: 'Unify Sans'}}>{` (${candidate.party.abbr})`}</tspan>
                </text>
                {
                    lines.map((line, i) => (
                        <text x={textLeft} y={textTop + (fontSize * lineHeight * i)} key={`results-02-text-${i}`}>
                            {line}
                        </text>
                    ))
                }
                <text className='state-icon' y={stateIconTop} x={'50%'}>
                    {stateFaceOptions[selectedStateIndex].displayValue}
                </text>
            </g>
        )
    }

    renderBackground() {
        const { width } = this.props.imageMetrics;

        return (
            <image x='0' y='0' width={width} xlinkHref='/img/elections/graphics/2020/2020-full-gradient-background.png'></image>
        )
    }

    render() {
        return (
            <g>
                <style>
                    {`
                    text {
                        fill: white;
                    }

                    .candidate-text {
                        font-family: 'Unify Sans SemiBold';
                        text-transform: uppercase;
                        font-weight: bold;
                    }

                    .state-icon {
                        font-family: 'StateFaceRegular';
                        font-size: 500px;
                        dominant-baseline: hanging;
                        text-anchor: middle;
                    }
                    `}
                </style>
                {this.renderBackground()}
                {this.renderText()}
            </g>
        )
    }
}
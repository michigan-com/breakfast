
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getLinesOfText } from '../helpers/svg-text-line';

const topperImageAspectRatio = 432 / 100.4;

export default class FactCheck01 extends Component {
    static propTypes = {
        imageMetrics: PropTypes.object,
        text: PropTypes.array,
        candidates: PropTypes.array,
        toggle: PropTypes.bool,
        logo: PropTypes.object,
        variation: PropTypes.object,
        activeTemplate: PropTypes.object,
    }

    textLeft = (width) => width * 0.05
    topperHeight = (width) => width  / topperImageAspectRatio;
    factCheckValueFontSize = (fontSize) => fontSize * 1.5;

    renderCandidate() {
        const { candidates } = this.props;
        const { width, fontSize, lineHeight } = this.props.imageMetrics;

        const candidate = candidates[0];
        const candidateFontSize = fontSize * 1.5;

        const left = this.textLeft(width);
        const topperHeight = this.topperHeight(width);
        const candidateNameTop = topperHeight - candidateFontSize;
        const factCheckTop = candidateNameTop - (fontSize * lineHeight);

        return (
            <g>
                <image x='0' y='0' width={width} xlinkHref='/img/elections/graphics/2020/2020-attribution-background-large.png'></image>

                <text className='topper-text' x={left} y={factCheckTop} style={{fontSize: fontSize * 0.9}}>Fact Check</text>
                <text className='topper-text' x={left} y={candidateNameTop} style={{fontSize: candidateFontSize}}>
                    <tspan style={{fontFamily: 'Unify Sans SemiBold'}}>{candidate.name}</tspan>
                    <tspan dx="10">{`(${candidate.party.abbr})`}</tspan>
                </text>
            </g>
        )
    }

    renderText() {
        const { text, toggle } = this.props;
        const { width, fontSize, lineHeight } = this.props.imageMetrics;

        const left = this.textLeft(width);
        const topperHeight = this.topperHeight(width);
        const textWidth = width - (left * 2);

        const lines = getLinesOfText(text[0], fontSize, lineHeight, textWidth);
        const top = topperHeight + (fontSize * 3);
        const textBottom = top + (lines.length * fontSize * lineHeight);

        const trueFalseTop = textBottom; //+ (fontSize * 0.7);
        const rectHeight = this.factCheckValueFontSize(fontSize);
        const falseLeft = width * 0.4;

        const iconHeight = rectHeight * 1.2;
        const iconOffset = (iconHeight - rectHeight) / 2;

        return (
            <g>
                {
                    lines.map((line, i) => (
                        <text 
                            x={left}
                            y={top + (fontSize * lineHeight * i)}
                            style={{fontWeight: 'bold'}}
                            key={`fact-check-line-${i}`}
                            >
                                {line}
                        </text>
                    ))
                }
                <rect className={`fact-check-value-rect true ${toggle ? '' : 'disabled'}`} height={rectHeight} width={rectHeight} x={left} y={trueFalseTop}></rect>
                { 
                    toggle ? <image xlinkHref='/img/elections/icons/2020/check.svg' x={left - iconOffset} y={trueFalseTop - iconOffset} width={iconHeight}></image> : null
                }
                <text 
                    x={left + (rectHeight * 1.4)}
                    y={trueFalseTop}
                    className={`fact-check-value-text true ${toggle ? '': 'disabled'}`}>

                    True
                </text>

                <rect className={`fact-check-value-rect false ${toggle ? 'disabled' : ''}`} height={rectHeight} width={rectHeight} x={falseLeft} y={trueFalseTop}></rect>
                { 
                    !toggle ? <image xlinkHref='/img/elections/icons/2020/x.svg' x={falseLeft - iconOffset} y={trueFalseTop - iconOffset} width={iconHeight}></image> : null
                }
                <text 
                    y={trueFalseTop}
                    x={falseLeft + (rectHeight * 1.4)}
                    className={`fact-check-value-text false ${toggle ? 'disabled': ''}`}>
                    False
                </text>
            </g>
        )
    }

    render() {
        const { fontSize } = this.props.imageMetrics;
        return (
            <g>
                <style>
                    {`
                    svg {
                        background: white;
                    }
                    .topper-text {
                        fill: white;
                    }
                    .fact-check-value-text {
                        text-transform: uppercase;
                        font-weight: bold;
                        font-size: ${this.factCheckValueFontSize(fontSize)}px;
                        dominant-baseline: hanging;
                    }

                    .fact-check-value-text.disabled, .fact-check-value-rect.disabled {
                        fill: #eee;
                    }

                    .fact-check-value-rect {
                        fill: #eee;
                    }
                    `}
                </style>
                {this.renderCandidate()}
                {this.renderText()}
            </g>
        )
    }
}
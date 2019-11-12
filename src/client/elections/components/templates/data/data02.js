
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getLinesOfText } from '../helpers/svg-text-line';
import { updateNumberValue } from '../../../actions/templates';
import { DEMOCRATIC_PARTY, REPUBLICAN_PARTY } from '../../../actions/candidates';

const TOTAL_HOUSE_REP_COUNT = 435;
const TO_WIN_HOUSE_REP_COUNT = 218;

export default class Data02  extends Component {
    static propTypes = {
        imageMetrics: PropTypes.object,
        text: PropTypes.array,
        numbers: PropTypes.array,
        candidates: PropTypes.array,
        logo: PropTypes.object,
    }
    
    containerLeft = (width) => (width - this.containerWidth(width)) / 2
    containerWidth = (width) => width * 0.9
    dataStartTop = (totalHeight) => totalHeight * 0.42;

    renderText() {
        const { text } = this.props;
        const { width, fontSize, lineHeight, totalHeight } = this.props.imageMetrics;

        const textWidth = this.containerWidth(width);
        const lines = getLinesOfText(text[0], fontSize, lineHeight, textWidth);
        const textHeight = lines.length * fontSize * lineHeight;
        const textBottom = this.dataStartTop(totalHeight) * 0.9;
        const textTop = textBottom - textHeight;
        const textLeft = this.containerLeft(width);

        return (
            <g>
                {
                    lines.map((line, i) => (
                        <text x={'50%'} y={textTop + (i * fontSize * lineHeight)} key={`data-02-line-${i}`} style={{textAnchor: 'middle', fontWeight: 'bold'}}>
                            {line}
                        </text>
                    ))
                }
            </g>
        )
    }

    renderData() {
        const { numbers } = this.props;
        const { width, totalHeight } = this.props.imageMetrics;

        const demCount = parseInt(numbers[0] || '0');
        const gopCount = parseInt(numbers[1] || '0');

        const dataWidth = this.containerWidth(width);
        const left = this.containerLeft(width);
        const iconTop = this.dataStartTop(totalHeight);
        const iconWidth = width * 0.16;

        const demWidthPercent = Math.min((demCount / TOTAL_HOUSE_REP_COUNT), 1);
        const gopWidthPercent = Math.min((gopCount / TOTAL_HOUSE_REP_COUNT), 1);
        const barHeight = totalHeight * 0.1;
        const barTop = iconTop + (totalHeight * 0.125);
        const gopBarLeft = dataWidth - (dataWidth * (gopWidthPercent)) + left;

        const middleBarWidth = 10;
        const middleBarLeft = (width / 2) - (middleBarWidth / 2);
        const middleBarTop = totalHeight * 0.5;
        const middleBarHeight = barHeight * 2;
        const triagleWidth = 30;

        const numberFontSize = barHeight * 0.7;
        const numberTop = barTop;
        const numberLeft = left * 1.75;

        const numberStyle = {
            fontSize: `${numberFontSize}px`, 
            fill: 'white',
            dominantBaseline: 'text-before-edge',
        }

        return (
            <g>
                <image x={left} y={iconTop} xlinkHref='/img/elections/icons/2020/dem-donkey.svg' width={iconWidth}></image>
                <image x={left + dataWidth - iconWidth} y={iconTop} xlinkHref='/img/elections/icons/2020/rep-elephant.svg' width={iconWidth}></image>

                <rect x={left} y={barTop} height={barHeight} width={dataWidth} fill='white'></rect>
                <rect x={left} y={barTop} fill={DEMOCRATIC_PARTY.color} width={`${demWidthPercent * dataWidth }`} height={barHeight}></rect>
                <rect x={gopBarLeft} y={barTop} fill={REPUBLICAN_PARTY.color} width={`${gopWidthPercent * dataWidth}`} height={barHeight}></rect>

                <image x={(width * 0.5) - (triagleWidth / 2)} y={middleBarTop - (triagleWidth * 1.5)} width={triagleWidth} xlinkHref='/img/elections/icons/2020/triangle.svg'></image>
                <rect x={middleBarLeft} y={middleBarTop} width={middleBarWidth} height={middleBarHeight} fill='#404040'></rect>
                <text x='50%' y={middleBarTop + middleBarHeight + 34} style={{fontSize: '27px', textAnchor: 'middle', fontWeight: 'bold'}}>{`${TO_WIN_HOUSE_REP_COUNT} to win majority`}</text>

                <text x={numberLeft} y={numberTop} style={numberStyle}>
                    {demCount}
                </text>

                <text x={width - numberLeft} y={numberTop} style={{ ...numberStyle, textAnchor: 'end' }}>
                    {gopCount}
                </text>
            </g>
        )
    }

    renderBackground() {
        const { totalHeight, width } = this.props.imageMetrics;

        return (
            <g>
                <image x={0} y={0} width={width} height={totalHeight} xlinkHref='/img/elections/graphics/2020/2020-grey-background.png'></image>
            </g>
        )
    }

    render() {
       return (
           <g>
               {this.renderBackground()}
               {this.renderData()}
               {this.renderText()}
           </g>
       ) 
    }
}
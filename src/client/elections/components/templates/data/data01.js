
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getLinesOfText } from '../helpers/svg-text-line';
import { updateNumberValue } from '../../../actions/templates';

export default class Data01  extends Component {
    static propTypes = {
        imageMetrics: PropTypes.object,
        text: PropTypes.array,
        numbers: PropTypes.array,
        candidates: PropTypes.array,
        logo: PropTypes.object,
    }

    containerWidth = (width) => width * 0.9;

    renderNumbers() {
        const { totalHeight, width } = this.props.imageMetrics;
        const { numbers } = this.props;
    
        const numberFontSize = totalHeight * 0.175;
        const numberLeft = width * 0.1;
        const numberTop = totalHeight * 0.2;

        const numberElements = numbers.map((numValue, i) => {
            const numberStyle = {
                fontSize: `${numberFontSize}px`,
                textAnchor: i === 0 ? '' : 'end'
            };

            // its annoying to right justify text in svg
            let left = numberLeft + (i * width / 2);
            if (i !== 0) left = width - numberLeft; 

            return (
            <text x={left} y={numberTop} className='seat-number' style={numberStyle} key={`data-01-number-value-${i}`}>
                <tspan>{numValue}</tspan>
                <tspan x={left} y={numberTop + (numberFontSize * 0.75)} style={{fontSize: numberFontSize * 0.4 }}>Seats</tspan>
            </text>)
        })

        return (
            <g width={this.containerWidth(width)}>
                {numberElements}
            </g>
        )
    }

    renderText() {
        const { text } = this.props;
        const { fontSize, lineHeight, width, totalHeight }  = this.props.imageMetrics;

        const textBoxWidth = this.containerWidth(width);
        const textWidth = textBoxWidth * 0.85;
        const textBoxLeft = (width - textBoxWidth) / 2;
        const textBoxTop = totalHeight * 0.7;
        const lines = getLinesOfText(text[0], fontSize, lineHeight, textWidth);

        const textBoxHeight = (lines.length + 1) * fontSize * lineHeight;
        const textLeft = textBoxLeft + ((textBoxWidth - textWidth) / 2);
        const textTop = textBoxTop + (fontSize * lineHeight * 1);

        return (
            <g>
                <rect x={textBoxLeft} y={textBoxTop} width={textBoxWidth} height={textBoxHeight} fill='white'></rect>
                <text fontWeight='bold'>
                    {
                        lines.map((line, index) => (
                           <tspan
                            x="50%"
                            textAnchor='middle'
                            y={textTop + (index * fontSize * lineHeight)}
                            key={`data-01-line-${index}`}
                           >{line}
                           </tspan> 
                        ))
                    }
                </text>
            </g>
        )
    }

    renderBackground() {
        const { totalHeight, width } = this.props.imageMetrics;

        const iconWidth = width * 0.6;
        const iconLeft = ((width - iconWidth) / 2) + 3; // the + 3 is to account for some ill-added padding on the SVG
        const iconTop = totalHeight * 0.25;

        return (
            <g>
                <image x={0} y={0} width={width} height={totalHeight} xlinkHref='/img/elections/graphics/2020/2020-two-color-background.png'></image>
                <image x={iconLeft} y={iconTop} width={iconWidth} xlinkHref="/img/elections/icons/2020/congress-white.svg"></image>
            </g>
        )
    }

    render() {
       return (
           <g>
                <style>
                    {
                        `.seat-number {
                            fill: white;
                            font-weight: bold;
                            letter-spacing: 3px;
                        }`
                    }

                </style>
               {this.renderBackground()}
               {this.renderNumbers()}
               {this.renderText()}
           </g>
       ) 
    }
}
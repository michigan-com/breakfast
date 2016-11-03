
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

import DataTable from '../components/data-table';
import { getPhotoCounts } from '../selectors/photos';

class PhotoAdmin extends Component {
  static propTypes = {
    usersByPhotoCount: PropTypes.array,
    marketsByPhotoCount: PropTypes.array,
    allPhotos: PropTypes.array,
  }

  componentDidMount() { this.renderPhotoTimeSeries(); }
  componentDidUpdate() { this.renderPhotoTimeSeries(); }

  renderPhotoTimeSeries() {
    // https://bl.ocks.org/mbostock/3883245
    const photos = this.props.allPhotos;
    if (!photos.length) return;

    const svg = d3.select('svg');
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
    const parseTime = d3.timeParse('%Y-%m-%d');
    const x = d3.scaleTime()
        .rangeRound([0, width]);
    const y = d3.scaleLinear()
        .rangeRound([height, 0]);
    const line = d3.line()
        .x((d) => (x(d.date)))
        .y((d) => (y(d.value) || 0))
        .curve(d3.curveCatmullRom.alpha(0.5));

    const photoCountByDate = photos
      .filter((p) => (!!p.createdAt))
      .reduce((a, p) => {
        const jsDate = new Date(p.createdAt);
        const dateString = `${jsDate.getFullYear()}-${jsDate.getMonth() + 1}-${jsDate.getDate()}`;
        if (!(dateString in a)) a[dateString] = 0;
        a[dateString] += 1;
        return a;
      }, {});

    const photoTimeSeries = Object.keys(photoCountByDate).map((date) => ({
      date: parseTime(date),
      value: photoCountByDate[date],
    })).sort((a, b) => (a.date - b.date));

    x.domain(d3.extent(photoTimeSeries, (d) => (d.date))).ticks(d3.timeDay);
    y.domain(d3.extent(photoTimeSeries, (d) => (d.value)));

    g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    g.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(y))
      .append('text')
        .attr('fill', '#000')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .style('text-anchor', 'end')
        .text('Photo Count');

    const path = g.append('path')
        .datum(photoTimeSeries)
        .attr('class', 'line')
        .attr('d', line);
    const pathLength = path.node().getTotalLength();
    path
      .attr('stroke-dasharray', `${pathLength} ${pathLength}`)
      .attr('stroke-dashoffset', pathLength)
      .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);
  }

  render() {
    const svgWidth = window.innerWidth * 0.8;
    const svgHeight = svgWidth * 0.5;
    return (
      <div className="photo-admin-container">
        <div className="table-container">
          <DataTable
            name="Top Users by Photos"
            subtitle="These users produce the most photos"
            columns={['email', 'photo count']}
            sortColIndex={1}
            data={this.props.usersByPhotoCount}
          />
        </div>
        <div className="table-container">
          <DataTable
            name="Top Markets By Photos"
            subtitle="These publications produce the most photos"
            columns={['market', 'photo count']}
            sortColIndex={1}
            data={this.props.marketsByPhotoCount}
          />
        </div>
        <svg height={svgHeight} width={svgWidth} id="photo-time-series"></svg>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { ...getPhotoCounts(state), allPhotos: state.Photos.photos };
}

export default connect(mapStateToProps)(PhotoAdmin);

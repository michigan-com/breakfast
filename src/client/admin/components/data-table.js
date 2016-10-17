'use strict';

import React, { Component, PropTypes } from 'react';
import xr from 'xr';

const DEFAULT_PAGE_SIZE = 10;

const ASC = 'asc';
const DESC = 'desc';

/**
 * Data table
 *
 */
export default class DataTable extends Component {
  constructor(props) {
    super(props);

    this.searchTimeout = null;

    this.state = {
      data: [],

      filter: '',
      currentPage: 1,

      sortDir: DESC,
      sortColIndex: this.props.sortColIndex,

      totalCount: this.props.data.length,

      fetchingData: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.processData = this.processData.bind(this);
    this.filterChange = this.filterChange.bind(this);
    this.decrementPage = this.decrementPage.bind(this);
    this.incrementPage = this.incrementPage.bind(this);
    this.headerColClick = this.headerColClick.bind(this);
  }

  componentWillMount() {
    this.processData();
  }

  componentDidUpdate(nextProps, nextState) {
    if (
      (this.state.currentPage !== nextState.currentPage
          && this.state.totalCount === nextState.totalCount) ||
      this.state.sortDir !== nextState.sortDir ||
      this.state.sortColIndex !== nextState.sortColIndex ||
      this.state.filter !== nextState.filter ||
      this.props.data.length !== nextProps.data.length
    ) {
      this.processData();
    }
  }

  processData() {
    if (this.props.ajaxUrl) {
      this.fetchData();
    } else {
      const { data, pageSize } = this.props;
      const { sortColIndex, sortDir, currentPage, filter } = this.state;
      const offset = pageSize * (currentPage - 1);

      const stateData = data
        .sort((a, b) => {
          if (typeof a[sortColIndex] === 'string') {
            return sortDir === ASC ?
              b[sortColIndex].localeCompare(a[sortColIndex]) :
              a[sortColIndex].localeCompare(b[sortColIndex]);
          }
          return sortDir === ASC ?
            a[sortColIndex] - b[sortColIndex] :
            b[sortColIndex] - a[sortColIndex];
        })
        .filter((a) => {
          if (!filter) return true;
          for (const v of a) {
            if (typeof v === 'string' && v.indexOf(filter) >= 0) return true;
          }
          return false;
        })
        .slice(offset, offset + pageSize);

      this.setState({ data: stateData, totalCount: data.length });
    }
  }

  fetchData() {
    if (!this.props.ajaxUrl) return;

    this.setState({ fetchingData: true });

    const getParams = {
      pageSize: this.props.pageSize,
      page: this.state.currentPage,
    };
    if (this.state.filter) getParams.filter = this.state.filter;

    if (this.props.columns.length && this.state.sortColIndex >= 0 &&
        this.state.sortColIndex < this.props.columns.length) {
      const column = this.props.columns[this.state.sortColIndex];
      getParams.sortCol = typeof column === 'string' ? column : column.queryName;
      getParams.sortDir = this.state.sortDir;
    }

    xr.get(this.props.ajaxUrl, getParams)
      .then((resp) => {
        const data = this.props.formatData(resp.data);
        const totalCount = resp.data.totalCount || this.state.totalCount;

        const totalPages = Math.ceil(totalCount / this.props.pageSize);
        let currentPage = this.state.currentPage;
        if (currentPage > totalPages) currentPage = totalPages;
        this.setState({ data, totalCount, currentPage, totalPages });
      }, (e) => {
        console.error(`Failed to fetch ajax url: ${e}`);
      });
  }

  filterChange(e) {
    const filter = e.target.value;
    this.setState({ filter });

    if (this.searchTimeout != null) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.processData();
    }, 500);
  }

  decrementPage() {
    if (this.state.currentPage === 1) return;
    const currentPage = this.state.currentPage - 1;
    this.setState({ currentPage });
  }

  incrementPage() {
    if (
      this.state.currentPage === (this.state.totalPages) ||
      this.state.data.length !== this.props.pageSize
    ) {
      return;
    }
    const currentPage = this.state.currentPage + 1;
    this.setState({ currentPage });
  }

  headerColClick(colIndex) {
    return () => {
      if (colIndex < 0 || colIndex >= this.props.columns.length) return;

      let sortDir = DESC;
      const sortColIndex = colIndex;
      if (sortColIndex === this.state.sortColIndex && this.state.sortDir === DESC) sortDir = ASC;

      this.setState({ sortDir, sortColIndex });
    };
  }

  /**
   * Render Stuff
   */
  renderTableControls() {
    if (this.state.data === null || !this.props.columns.length) return null;
    const currentPage = this.state.currentPage;

    const totalPages = this.state.totalPages;

    const nextPageClass = ['page-control', 'next'];
    const prevPageClass = ['page-control', 'prev'];
    if (currentPage === 0) prevPageClass.push('disabled');
    if (currentPage === (totalPages - 1) || this.state.data.length !== this.props.pageSize) nextPageClass.push('disabled');

    let pageCountText = `Page ${currentPage}`;
    if (totalPages > 0) pageCountText = `${pageCountText} of ${totalPages}`;

    return (
      <div className="data-table-controls">
        <div className="filter-container">
          <input placeholder="Filter" type="text" onChange={this.filterChange} />
        </div>
        <div className="page-container">
          <div className={prevPageClass.join(' ')} onClick={this.decrementPage}>
            <i className="fa fa-chevron-left"></i>Prev
          </div>
          <div className="page-count">{pageCountText}</div>
          <div className={nextPageClass.join(' ')} onClick={this.incrementPage}>
            Next<i className="fa fa-chevron-right"></i>
          </div>
        </div>
      </div>
    );
  }

  renderTableHeaders() {
    const columns = this.props.columns;

    const ths = [];
    for (const column of columns) {
      let columnName = typeof column === 'string' ? column : column.displayName;
      const thClass = ['data-table-header'];
      let countDirObj = null;
      if (ths.length === this.state.sortColIndex) {
        thClass.push('sort');
        if (this.state.sortDir === ASC) countDirObj = <i className="fa fa-caret-up"></i>;
        else countDirObj = <i className=" fa fa-caret-down"></i>;
      }
      ths.push(
        <th key={`table-header-${ths.length}`} onClick={this.headerColClick(ths.length)}>
          {columnName} {countDirObj}
        </th>
      );
    }
    return ths;
  }

  /**
   * override if you wish to have custom <td> elements
   *
   * @param {Array} row - row of data
   * @returns {Object} Complete <tr> React component. MUST return <tr>
   */
  renderDataRow(row, rowIndex = 0) {
    let tds = [];
    for (let datum of row) {
      tds.push(
        <td key={`table-data-${rowIndex}-${tds.length}`}>{datum}</td>
      );
    }

    return (
      <tr key={`data-table-row-${rowIndex}`}>
        {tds}
      </tr>
    );
  }

  renderTableData() {
    const { data } = this.state;


    if (!data.length) return <h3>No results found</h3>;

    const trs = [];
    for (const dataRow of data) {
      trs.push(this.renderDataRow(dataRow, trs.length));
    }
    return trs;
  }

  renderCount() {
    if (this.state.totalCount < 0) return null;

    return (
      <div className="total-count">
        {`Total count: ${this.state.totalCount}`}
      </div>
    );
  }

  render() {
    return (
      <div className="data-table">
        <div className="data-table-table-header">
          <h2 className="data-table-table-name">{this.props.name}</h2>
          <p className="data-table-table-subtitle">{this.props.subtitle}</p>
          {this.renderTableControls()}
        </div>
        <div className="data-table-table-container">
          <table className="data-table-table">
            <thead className="data-table-thead">
              <tr className="data-table-header-row">
                {this.renderTableHeaders()}
              </tr>
            </thead>
            <tbody className="data-table-tbody">
              {this.renderTableData()}
            </tbody>
          </table>
        </div>
        <div className="data-table-count">
          {this.renderCount()}
        </div>
      </div>
    );
  }
}

DataTable.propTypes = {
  name: PropTypes.string,
  subtitle: PropTypes.string,

  /**
   * Ajax settings
   *
   * @param {String} ajaxUrl - url that will provide data for the table. MUST
   *    return JSON, with the following parameters:
   *  {
   *    data: [], // REQUIRED array of arrays
   *    rowCountTotal: -1, // OPTIONAL total number of rows, so we can paginate
   *  }
   *
   * If you want to enable filtering/pagination/etc, the url can take the following
   * GET params:
   * {
   *    filter: '', // String typed into the filter <input>
   *    sortCol: '', // Column that sorting is applied to
   *    sortDir: '', // either 'asc' or 'desc'
   *    pageSize: 0, // Number of records to return, specify using this.props.pageSize
   *    page: 0, // Page number
   * }
   *
   */
  ajaxUrl: PropTypes.string,

  /**
   * Filter the returned Ajax data. Returns an array of arrays that represents the
   * table data. Perform JSX formatting for the rows here
   *
   * @param {Object} jsonResp - JSON returned from ajaxUrl. Iterate over the Object
   * in whatever way you want, returning the array of data you want displayed on the
   * table.
   * @return {Array} array of arrays, representing the arrays to display
   */
  formatData: PropTypes.func,
  /**
   * Data to be renderd. Array of arrays
   * e.g. [[1, 2, 3], [4, 5, 6]]
   */
  data: PropTypes.array, // If ajaxUrl is used, this param will be ignored

  /**
   * Name of the columns. Can be an object with two values: displayName and queryName.
   *  {
   *    displayName: '', // Name that will be rendered to the DOM
   *    queryName: '', // Name of the column returned in SQL, so we can send as a sortCol param
   *  }
   *
   * Can also be an array of strings, but cannot guarantee ajax performance in this case
   */
  columns: PropTypes.array,
  sortColIndex: PropTypes.number,
  pageSize: PropTypes.number,
};

DataTable.defaultProps = {
  name: 'Data Table',
  subtitle: '',

  /**
   * Ajax settings
   *
   * @param {String} ajaxUrl - url that will provide data for the table. MUST
   *    return JSON, with the following parameters:
   *  {
   *    data: [], // REQUIRED array of arrays
   *    rowCountTotal: -1, // OPTIONAL total number of rows, so we can paginate
   *  }
   *
   * If you want to enable filtering/pagination/etc, the url can take the following
   * GET params:
   * {
   *    filter: '', // String typed into the filter <input>
   *    sortCol: '', // Column that sorting is applied to
   *    sortDir: '', // either 'asc' or 'desc'
   *    pageSize: 0, // Number of records to return, specify using this.props.pageSize
   *    page: 0, // Page number
   * }
   *
   */
  ajaxUrl: '',

  /**
   * Filter the returned Ajax data. Returns an array of arrays that represents the
   * table data. Perform JSX formatting for the rows here
   *
   * @param {Object} jsonResp - JSON returned from ajaxUrl. Iterate over the Object
   * in whatever way you want, returning the array of data you want displayed on the
   * table.
   * @return {Array} array of arrays, representing the arrays to display
   */
  formatData: (jsonResp) => {
    if (!('data' in jsonResp)) {
      throw new Error('Param \'ajaxUrl\' needs to return a JSON object with a \'data\' param');
    }
    return jsonResp.data;
  },

  /**
   * Data to be renderd. Array of arrays
   * e.g. [[1, 2, 3], [4, 5, 6]]
   */
  data: [], // If ajaxUrl is used, this param will be ignored

  /**
   * Name of the columns. Can be an object with two values: displayName and queryName.
   *  {
   *    displayName: '', // Name that will be rendered to the DOM
   *    queryName: '', // Name of the column returned in SQL, so we can send as a sortCol param
   *  }
   *
   * Can also be an array of strings, but cannot guarantee ajax performance in this case
   */
  columns: [],
  sortColIndex: 0,
  pageSize: DEFAULT_PAGE_SIZE,
};

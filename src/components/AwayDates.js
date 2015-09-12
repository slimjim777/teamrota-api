'use strict';
var React = require('react');
var Person = require('../models/person');
var moment = require('moment');


var AwayDates = React.createClass({

    renderSpinner: function() {
        if (this.props.isLoading) {
            return (
                <label id="person-rota-spinner" className="spinner">&nbsp;</label>
            );
        }
    },

    renderTable: function() {
        if (this.props.awayDates.length > 0) {
            return (
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th></th><th>From Date</th><th>To Date</th><th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.awayDates.map(function(away) {
                        return (
                            <tr key={away.id}>
                                <td><button className="btn btn-default">Edit</button></td>
                                <td>{moment(away.fromDate).format('DD/MM/YYYY')}</td>
                                <td>{moment(away.toDate).format('DD/MM/YYYY')}</td>
                                <td><button className="btn btn-link"><span className="glyphicon glyphicon-remove-circle"></span></button></td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            );
        } else {
            return <p>No away dates found.</p>;
        }
    },

    render: function () {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">
                        {this.renderSpinner()}Away Dates&nbsp;
                        <button className="btn" title="Previous weeks" onClick={this.props.rangeMinus}>
                            <span className="glyphicon glyphicon-arrow-left"></span>
                        </button>
                        <button className="btn" title="Next weeks" onClick={this.props.rangePlus}>
                            <span className="glyphicon glyphicon-arrow-right"></span>
                        </button>
                        <button className="btn" title="Refresh Rota" onClick={this.props.awayRefreshClick}>
                            <span className="glyphicon glyphicon-refresh"></span>
                        </button>
                    </h3>
                </div>
                <div className="panel-body table-responsive" id="person-rota">
                    <em>{this.props.rangeMessage}</em>
                    {this.renderTable()}
                </div>
            </div>
        );
    }
});

module.exports = AwayDates;
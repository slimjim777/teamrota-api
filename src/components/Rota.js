var React = require('react');
var Person = require('../models/person');
var moment = require('moment');

var MESSAGES = [
    'Nada, zilch, nothing to display.',
    "Dude, you've got nothing to do!",
    "So, your diary is free - want to meet for coffee?"];


var Rota = React.createClass({

    renderSpinner: function() {
        if (this.props.isLoading) {
            return (
                <label id="person-rota-spinner" className="spinner">&nbsp;</label>
            );
        }
    },

    renderTable: function() {
        var index = 0;
        var indexRole = 0;
        if (this.props.rota.length > 0) {
            return (
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Date</th><th>Event</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.rota.map(function(rota) {
                        index += 1;
                        return (
                            <tr key={index}>
                                <td>{moment(rota.eventDate).format('DD/MM/YYYY')}</td>
                                <td>
                                    <a href="#">{rota.eventName}</a>
                                    <div>
                                        {rota.roles.map(function(role) {
                                            indexRole += 1;
                                            return (<span className="label label-default" key={indexRole}>{role}</span>);
                                        })}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            );
        } else {
            return <p>{MESSAGES[Math.floor(Math.random() * MESSAGES.length)]}</p>;
        }
    },

    render: function () {

        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">
                        {this.renderSpinner()}Rota&nbsp;
                        <button className="btn" title="Previous weeks" onClick={this.props.rangeMinus}>
                            <span className="glyphicon glyphicon-arrow-left"></span>
                        </button>
                        <button className="btn" title="Next weeks" onClick={this.props.rangePlus}>
                            <span className="glyphicon glyphicon-arrow-right"></span>
                        </button>
                        <button className="btn" title="Refresh Rota" onClick={this.props.rotaRefreshClick}>
                            <span className="glyphicon glyphicon-refresh"></span>
                        </button>
                    </h3>
                </div>
                <div className="panel-body table-responsive" id="person-rota">
                    {this.renderTable()}
                </div>
            </div>
        );
    }

});

module.exports = Rota;
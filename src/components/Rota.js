var React = require('react');
var Person = require('../models/person');
var moment = require('moment');


var Rota = React.createClass({

    renderSpinner: function() {
        if (this.props.isLoading) {
            return (
                <label id="person-rota-spinner" className="spinner">&nbsp;</label>
            );
        }
    },

    renderTable: function() {
        var self = this;
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
                        return (
                            <tr>
                                <td>{moment(rota.eventDate).format('DD/MM/YYYY')}</td>
                                <td>
                                    <a href="#">{rota.eventName}</a>
                                    <div>
                                        {rota.roles.map(function(role) {
                                            return (<span className="label label-default">{role}</span>);
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
            return <p>Nada, zilch, nothing to display.</p>;
        }
    },

    render: function () {

        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">
                        {this.renderSpinner()}Rota&nbsp;
                        <button className="btn" onClick={this.props.rangeMinus}><span className="glyphicon glyphicon-arrow-left"></span></button>
                        <button className="btn" onClick={this.props.rangePlus}><span className="glyphicon glyphicon-arrow-right"></span></button>
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
'use strict';
var React = require('react');
var moment = require('moment');


var EventDetailRota = React.createClass({

    renderActions: function() {
        if (this.props.canAdministrate) {
            return (
                <span>
                    <button className="btn btn-primary" onClick={this.props.toggleEdit}>Edit</button>&nbsp;
                    <button className="btn btn-default" title = "Delete" ><span className="glyphicon glyphicon-remove"></span></button>
                </span>
            );
        }
    },

    render: function () {
        var summary = this.props.summary;
        var rota = this.props.rota;

        if (!this.props.dateId) {
            return (
                <div>Select a date to display the rota.</div>
            );
        }

        return (
            <div className="col-md-8 col-sm-8 col-xs-12">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h4 className="sub-heading">
                            {this.renderActions()}
                            On {moment(summary.on_date).format('DD/MM/YYYY')}</h4>
                    </div>
                    <div className="panel-body">
                        <div>
                            <label>Focus</label>
                            <div>{summary.focus}</div>
                        </div>
                        <div>
                            <label>Notes</label>
                            <div>{summary.notes}</div>
                        </div>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Role</th><th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                            {rota.map(function(r) {
                                return (
                                    <tr key={r.role_name}>
                                        <td>{r.role_name}</td>
                                        <td>
                                            <a href="#/people/">{r.firstname} {r.lastname}</a>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = EventDetailRota;
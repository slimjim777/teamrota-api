var React = require('react');
var Event = require('../models/event');
var moment = require('moment');


var EventDetailPanel = React.createClass({

    renderActive: function() {
        if (this.props.model.active) {
            return (
                <span className="glyphicon glyphicon-ok"></span>
            );
        }
    },

    renderDay: function(day, name) {
        if (day) {
            return <b>{name}</b>;
        } else {
            return <span>{name}</span>;
        }
    },

    renderDays: function() {
        return (
            <span className="panel-cell panel-repeats">
                {this.renderDay(this.props.model.day_mon, 'M')}
                {this.renderDay(this.props.model.day_tue, 'T')}
                {this.renderDay(this.props.model.day_wed, 'W')}
                {this.renderDay(this.props.model.day_thu, 'T')}
                {this.renderDay(this.props.model.day_fri, 'F')}
                {this.renderDay(this.props.model.day_sat, 'S')}
                {this.renderDay(this.props.model.day_sun, 'S')}
            </span>
        );
    },

    render: function() {
        var model = this.props.model;

        return (
            <div className="panel panel-default hidden-sm hidden-xs">
                <div className="panel-heading">
                    <h3 className="panel-title">Details</h3>
                </div>
                <div className="panel-body">
                    <table className="panel-form">
                        <tbody>
                        <tr>
                            <td>
                                <label>Name</label><span className="panel-cell">{model.name}</span>
                            </td>
                            <td>
                                <label>Active</label>
                            <span className="panel-cell">
                                {this.renderActive()}
                            </span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Frequency</label><span className="panel-cell">{model.frequency}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Created</label><span className="panel-cell">{moment(model.created).format('DD/MM/YYYY')}</span>
                            </td>
                            <td>
                                <label>Repeats On</label>
                                {this.renderDays()}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});

module.exports = EventDetailPanel;
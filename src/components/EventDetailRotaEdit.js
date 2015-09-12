'use strict';
var React = require('react');
var moment = require('moment');
var EventDate = require('../models/eventdate');


var EventDetailRotaEdit = React.createClass({

    getInitialState: function() {
        var summary = this.props.summary;
        return {focus: summary.focus, notes: summary.notes, rota: {}};
    },

    handleChangeFocus: function(e) {
        e.preventDefault();
        this.setState({focus: event.target.value});
    },
    handleChangeNotes: function(e) {
        e.preventDefault();
        this.setState({focus: event.target.value});
    },
    handleChangeRota: function(e) {
        e.preventDefault();
        // Get the role id and value
        var roleId = event.target.name.replace('role-','');
        var rota = this.state.rota;
        rota[roleId] = event.target.value;
        this.setState({rota: rota});
    },

    handleSave: function(e) {
        e.preventDefault();
        var self = this;

        var result = EventDate.updateRota(this.props.dateId, this.state.rota);
        result.done(function(data) {
            self.props.refreshData();
        });
    },

    renderRoleSelect: function(rota) {
        return (
            <tr key={rota.roleName}>
                <td>{rota.roleName}</td>
                <td>
                    <select name={"role-".concat(rota.roleId)} defaultValue={rota.personId} className="form-control"
                            onChange={this.handleChangeRota}>
                        <option value="0">&nbsp;</option>
                        {rota.roles.map(function(r) {
                            return (
                                <option key={'role'.concat(r.role_id, '-', r.person_id)} value={r.person_id}>
                                    {r.firstname} {r.lastname} {r.is_away ? '(Away)' : ''}
                                </option>
                            );
                        })}
                    </select>
                </td>
            </tr>
        );
    },

    render: function () {
        var summary = this.props.summary;
        var roles = this.props.roles;
        var self = this;

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
                            <button className="btn btn-primary" onClick={this.handleSave}>Save</button> &nbsp;
                            <button className="btn btn-default" onClick={this.props.toggleEdit}>Cancel</button>
                            On {moment(summary.on_date).format('DD/MM/YYYY')}</h4>
                    </div>
                    <div className="panel-body">
                        <div>
                            <label>Focus</label>
                            <div><textarea name="focus" className="form-control" value={this.state.focus}
                                           onChange={this.handleChangeFocus} /></div>
                        </div>
                        <div>
                            <label>Notes</label>
                            <div><textarea name="notes" className="form-control" value={this.state.notes}
                                           onChange={this.handleChangeNotes} /></div>
                        </div>
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th>Role</th><th>Name</th>
                            </tr>
                            </thead>
                            <tbody>
                            {roles.map(function(r) {
                                return self.renderRoleSelect(r);
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = EventDetailRotaEdit;
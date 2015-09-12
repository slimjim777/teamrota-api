'use strict';
var React = require('react');
var moment = require('moment');


var PeopleList = React.createClass({

    renderActive: function(active) {
        if (active) {
            return (
                <span className="glyphicon glyphicon-ok"></span>
            );
        }
    },

    render: function() {
        var self = this;

        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">People</h3>
                </div>
                <div className="panel-body table-responsive">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>Name</th><th>Active</th><th>Guest</th><th>Last Login</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.people.map(function(p) {
                            return (
                                <tr key={p.id}>
                                    <td><a href={'#/person/' + p.id}>{p.firstname} {p.lastname}</a></td>
                                    <td>{self.renderActive(p.active)}</td>
                                    <td>{self.renderActive(p.guest)}</td>
                                    <td>{p.last_login ? moment(p.last_login).format('DD/MM/YYYY HH:mm') : ''}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});

module.exports = PeopleList;
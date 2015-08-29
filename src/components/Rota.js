var React = require('react');
var Person = require('../models/person');


var Rota = React.createClass({

    renderSpinner: function() {
        if (this.props.isLoading) {
            return (
                <label id="person-rota-spinner" className="spinner">&nbsp;</label>
            );
        }
    },

    render: function () {

        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">
                        {this.renderSpinner()}Rota&nbsp;
                        <button className="btn" title="Refresh Rota" onClick={this.props.rotaRefreshClick}>
                            <span className="glyphicon glyphicon-refresh"></span>
                        </button>
                    </h3>
                </div>
                <div className="panel-body table-responsive" id="person-rota">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Date</th><th>Event</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.props.rota.map(function(rota) {
                            return (
                                <tr key={rota.id}>
                                    <td>{rota.date}</td><td>{rota.name}</td>
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

module.exports = Rota;
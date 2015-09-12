'use strict';
var React = require('react');
var STATUSES = [{name:'Active', value:'active'}, {name:'Inactive', value:'inactive'}, {name:'Both', value:'both'}];

var PeopleFilter = React.createClass({

    getInitialState: function() {

        return ({findFirstname: null, findLastname:null, findStatus: 'active'});
    },

    handleSubmit: function(e) {
        e.preventDefault();
        // Raise an event to trigger the filter change
        $(document).trigger('filterChange', [this.state.findFirstname, this.state.findLastname, this.state.findStatus]);
    },

    handleChangeStatus: function(e) {
        e.preventDefault();
        this.setState({findStatus: event.target.value});
        $(document).trigger('filterChange', [this.state.findFirstname, this.state.findLastname, event.target.value]);
    },
    handleChangeFirstname: function(e) {
        e.preventDefault();
        this.setState({findFirstname: event.target.value});
        $(document).trigger('filterChange', [event.target.value, this.state.findLastname, this.state.findStatus]);
    },
    handleChangeLastname: function(e) {
        e.preventDefault();
        this.setState({findLastname: event.target.value});
        $(document).trigger('filterChange', [this.state.findFirstname, event.target.value, this.state.findStatus]);
    },

    render: function() {
        var self = this;

        return (
            <div className="form-group info">
                <p>Find</p>
                <form role="form" onSubmit={this.handleSubmit}>
                    <div className="col-xs-6 col-md-6 col-lg-3">
                        <input text="search" value={this.state.findFirstname} onChange={this.handleChangeFirstname}
                               placeholder="firstname" className="form-control" />
                    </div>
                    <div className="col-xs-6 col-md-6 col-lg-3">
                        <input text="search" value={this.state.findLastname} onChange={this.handleChangeLastname}
                               placeholder="lastname" className="form-control"/>
                    </div>
                    <div className="col-xs-6 col-md-6 col-lg-3">
                        <select name="status" className="form-control" onChange={this.handleChangeStatus}>
                            {STATUSES.map(function(st) {
                                return (
                                    <option key={st.value} value={st.value}
                                            defaultValue={self.state.findStatus}>{st.name}</option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="col-xs-6 col-md-6 col-lg-3">
                        <button className="btn btn-primary" title="Find"><span className="glyphicon glyphicon-search"></span></button>
                    </div>
                </form>
            </div>
        );
    }
});

module.exports = PeopleFilter;
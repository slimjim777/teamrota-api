'use strict';
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var MyRota = require('./components/MyRota');
var People = require('./components/People');
var Events = require('./components/Events');
var EventDetail = require('./components/EventDetail');

var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var CollapsibleNav = require('react-bootstrap').CollapsibleNav;
var NavItem = require('react-bootstrap').NavItem;
var Token = require('./models/Token');

// Get the API token and store in the browser session storage
Token.get();

var App = React.createClass({
    render: function() {
        return (
            <div>
                <Navbar brand='Team Rota' inverse toggleNavKey={0}>
                    <CollapsibleNav eventKey={0}>
                        <Nav navbar>
                            <NavItem eventKey={1} href="#/me">My Rota</NavItem>
                            <NavItem eventKey={2} href="#/people">People</NavItem>
                            <NavItem eventKey={3} href="#/events">Events</NavItem>
                        </Nav>
                    </CollapsibleNav>
                </Navbar>
                <RouteHandler/>
            </div>
        );
    }
});


// Declare our routes and their hierarchy
var routes = (
    <Route handler={App}>
        <DefaultRoute handler={MyRota} />
        <Route path="me" handler={MyRota}/>
        <Route path="person/:id" handler={MyRota}/>
        <Route path="people" handler={People}/>
        <Route path="events" handler={Events} />
        <Route path="events/:id" handler={EventDetail} />
        <Route path="events/:id/:dateId" handler={EventDetail} />
    </Route>
);


Router.run(routes, function(Root) {
    React.render(<Root/>, document.getElementById('app'));
});

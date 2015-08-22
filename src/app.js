var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var MyRota = require('./components/MyRota');
var People = require('./components/People');
var Events = require('./components/Events');

var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var NavItem = require('react-bootstrap').NavItem;


var App = React.createClass({
    render () {
        return (
            <div>
                <Navbar brand='Team Rota'>
                    <Nav>
                        <NavItem eventKey={1} href="#/me">My Rota</NavItem>
                        <NavItem eventKey={2} href="#/people">People</NavItem>
                        <NavItem eventKey={3} href="#/events">Events</NavItem>
                    </Nav>
                </Navbar>
                <div id="main" className="container-fluid" role="main">
                    <RouteHandler/>
                </div>
            </div>
        );
    }
});


// Declare our routes and their hierarchy
var routes = (
    <Route handler={App}>
        <Route path="me" handler={MyRota}/>
        <Route path="people" handler={People}/>
        <Route path="events" handler={Events}/>
    </Route>
);


Router.run(routes, function(Root) {
    React.render(<Root/>, document.getElementById('app'));
});

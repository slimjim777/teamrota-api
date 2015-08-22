var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var About = require('./components/About');


// TODO: Refactor to the components directory
var Inbox = React.createClass({
    render: function () {
        return <h2>Inbox</h2>;
    }
});

// TODO: Refactor to the components directory
var Home = React.createClass({
    render: function () {
        return <h2>Home</h2>;
    }
});



var App = React.createClass({
    render () {
        return (
            <div>
                <h1>App</h1>
                <RouteHandler/>
            </div>
        )
    }
});



// Declare our routes and their hierarchy
var routes = (
    <Route handler={App}>
        <Route path="home" handler={Home}/>
        <Route path="about" handler={About}/>
        <Route path="inbox" handler={Inbox}/>
    </Route>
);

Router.run(routes, function(Root) {
    React.render(<Root/>, document.getElementById('app'));
});

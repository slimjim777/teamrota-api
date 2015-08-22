jest.dontMock('../components/MyRota.js');


describe('About', function() {
    var React = require('react/addons');
    var MyRota = require('../components/MyRota');
    var Person = require('../models/person');
    var TestUtils = React.addons.TestUtils;

    var result = Person.findById('1')
    var name = result.person.firstname + ' ' + result.person.lastname;
    
    it('displays the title', function () {
        var about = TestUtils.renderIntoDocument(
            <MyRota params="1" />
        );
        expect(TestUtils.isCompositeComponent(about)).toBeTruthy();

        // Check the rendered heading is correct
        var heading = TestUtils.findRenderedDOMComponentWithTag(about, 'h2');
        expect(heading.getDOMNode().textContent).toEqual(name);

    });

});
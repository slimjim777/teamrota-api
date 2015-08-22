jest.dontMock('../components/About.js');


describe('About', function() {
    var React = require('react/addons');
    var About = require('../components/About.js');
    var TestUtils = React.addons.TestUtils;
    
    it('displays the title', function () {
        var about = TestUtils.renderIntoDocument(
            <About />
        );
        expect(TestUtils.isCompositeComponent(about)).toBeTruthy();

        // Check the rendered heading is correct
        var heading = TestUtils.findRenderedDOMComponentWithTag(about, 'h2');
        expect(heading.getDOMNode().textContent).toEqual('About');

    });

});
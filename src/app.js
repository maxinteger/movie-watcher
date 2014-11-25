const React = require('react');
import {Person} from './model/Person';

global.app = function () {
    var christoph = new Person('Christoph', 'Burgdorf');
    console.log(christoph.fullName);
};

(function(){

	var hello = React.createClass({
		render: function() {
			return React.DOM.div({}, 'hello ' + this.props.name);
		}
	});
	hello = React.createFactory(hello);

	React.render(hello({name: 'World'}), document.body);
})();

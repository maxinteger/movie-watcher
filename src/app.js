const Cycle = require('cyclejs');
const jQuery = require('jquery');

var log = console.log.bind(console);
var h = Cycle.h;

function getSuggestionsFromWikipedia(text) {
	return jQuery.ajax({
		url: 'http://en.wikipedia.org/w/api.php',
		dataType: 'jsonp',
		data: {
			action: 'opensearch',
			format: 'json',
			search: encodeURI(text)
		}
	}).promise();
}


var HelloModel = Cycle.createModel(['changeName$'], function (intent) {
	return {
		name$: intent.changeName$
			.debounce(400)
			.flatMap(getSuggestionsFromWikipedia)
			.map((res) => res[1])
			.startWith([])
	};
});


var HelloView = Cycle.createView(['name$'], function (model) {
	return {
		vtree$: model.name$
			.map(function (name) {
				return h('div', {}, [
					h('label', 'Name:'),
					h('input', {
						'attributes': {'type': 'text'},
						'ev-input': 'inputText$'
					}),
					h('hr'),
					h('ul', name.map(function(item){
						return h('li', item);
					}))
				]);
			}),
		events: ['inputText$']
	};
});
var HelloIntent = Cycle.createIntent(['inputText$'], function (view) {
	return {
		changeName$: view.inputText$
			.map(function (ev) { return ev.target.value; })
	};
});

Cycle.createRenderer('body').inject(HelloView);
Cycle.circularInject(HelloModel, HelloView, HelloIntent);

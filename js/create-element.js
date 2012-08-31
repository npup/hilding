/*@req [host-test]
	@id create-element
	@descr DOM element creation
	@author petter.envall@gmail.com
	@version 1.0
*/
var npup;

if (npup && typeof npup=="object" && typeof npup.isHostMethod=="function") {
	(function (module) {

		var createElement;
		if (npup.isHostMethod(document, "createElement")) {
			createElement = function (nodeName) {
				return document.createElement(nodeName);
			};
		}

		// add to module API
		createElement && (module.createElement = createElement);

	})(npup);
}

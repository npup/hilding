/*@req [host-test]
	@id get-computed-style
	@descr Value interpolation utility
	@author petter.envall@gmail.com
	@version 0.1
*/
var npup;

if (npup && typeof npup=="object") {
	(function (module) {
		console.log(this);
		var global=this, doc = global.document
			, getStyle;
		if (npup.isHostMethod(global, "getComputedStyle")) {
			getStyle = function (elem, style) {
				if (!elem) {throw new Error("getStyle did not get a proper element: "+elem);}
				return global.getComputedStyle(elem, null).getPropertyValue(style);
			};
		}
		else if (doc && doc.body && npup.isHostProp(doc.body, "currentStyle")) {
			getStyle = function (elem, style) {
				if (!elem) {throw new Error("getStyle did not get a proper element: "+elem);}
				return elem.currentStyle(style);
			};
		}
		
		module.getStyle = getStyle;

	})(npup);

}

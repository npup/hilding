/*@req []
	@id host-test
	@descr Host object tests, thanks to David Mark
	@author petter.envall@gmail.com
	@version 1.0
*/
var npup;
npup || (npup = {});

(function (module) {

	var typeExpr = /^(function|object)$/i;
	function isHostMethod(o, m) {
		var t = typeof o[m];
		return !!((typeExpr.test(t) && o[m]) || t == "unknown");
	}
	function isHostProp(o, p) {
		return !!(typeExpr.test(typeof o[p]) && o[p]);
	}

	// add to module API
	module.isHostMethod = isHostMethod;
	module.isHostProp = isHostProp;

})(npup);

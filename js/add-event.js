/*@req [host-test]
	@id add-event
	@descr event listener handling
	@author petter.envall@gmail.com
	@version 1.0
*/
var npup;

if (npup && typeof npup=="object" && typeof npup.isHostMethod=="function") {
	(function (module) {

		var addEventListener;
		if (npup.isHostMethod(document.body, "addEventListener")) {
			addEventListener = function (elem, eventName, handler) {
				return elem.addEventListener(eventName, handler, false);
			};
		}
		else if (npup.isHostMethod(document.body, "attachEvent")) {
			addEventListener = function (elem, eventName, handler) {
				return elem.attachEvent("on"+eventName, handler);
			};
		}

		var removeEventListener;
		if (npup.isHostMethod(document.body, "removeEventListener")) {
			removeEventListener = function (elem, eventName, handler) {
				return elem.removeEventListener(eventName, handler, false);
			};
		}
		else if (npup.isHostMethod(document.body, "detachEvent")) {
			removeEventListener = function (elem, eventName, handler) {
				return elem.detachEvent("on"+eventName, handler);
			};
		}

		var getEventTarget;
		if (addEventListener) {
			getEventTarget = function (e) {
				var target = e.target;
				if (target) {(target.nodeType==1) || (target = target.parentNode);}
				else {target = e.srcElement;}
				return target;
			};
		}

		// add to module API
		addEventListener && (module.addEventListener = addEventListener);
		removeEventListener && (module.removeEventListener = removeEventListener);	
		getEventTarget && (module.getEventTarget = getEventTarget);

	})(npup);
}

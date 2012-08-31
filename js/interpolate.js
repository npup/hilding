/*@req []
	@id interpolate
	@descr Value interpolation utility
	@author petter.envall@gmail.com
	@version 0.1
*/
var npup;

if (npup && typeof npup=="object") {
	(function (module) {

		module.interpolate = (function () {
			var defaultOptions = {
				"duration": 1000
				, "each": function (from, to, current) {}
				, "update": function (from, to, current) {}
				, "after": function (from, to, current) {}
				, "easing": function (pos) {return (-Math.cos(pos*Math.PI)/2) + 0.5;}
			};

			return function (from, to, options) {
				("object" == typeof options) || (options = {});
				for (var prop in defaultOptions) {
					(prop in options) || (options[prop]=defaultOptions[prop]);
				}
				var t0 = +new Date
					, t1 = t0 + options.duration
					, currVal = null
					, interval = setInterval(function () {
						var now = +new Date
							, pos = now > t1 ? 1 : (now-t0)/options.duration		
							, value = Math.floor(from + (to-from) * options.easing(pos));
							if (currVal != value) {
								currVal = value;
								options.update(from, to, value);
							}
							options.each(from, to, value);
							if (now>t1) {
								clearInterval(interval);
								options.after(from, to, value);
							}	
			  }, 10);
			};
		})();

	})(npup);

}
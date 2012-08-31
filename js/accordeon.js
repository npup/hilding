/*@req [add-event,create-element,get-computed-style]
	@id accordeon
	@descr silly accordeon widget
	@author petter.envall@gmail.com
	@version 1.0
*/
var npup;
if (npup && typeof npup=="object"
	&& typeof npup.addEventListener == "function"
	&& typeof npup.getEventTarget=="function"
	&& typeof npup.createElement == "function"
	&& typeof npup.interpolate == "function"
	&& typeof npup.getStyle == "function") {
	(function (module) {
		var win = window, doc = win.document
			, defaultOptions = {
				"defaultExpandedIdx": 0
				, "accordeonClass": "accordeon"
				, "captionClass": "accordeon-caption"
				, "contentClass": "accordeon-content"
				, "expandedClass": "expanded"
				, "slidingDuration": 350
				, "captionTag": "dt"
				, "contentTag": "dd"
				, "toggle": true
				, "allowMultiple": false
				, "contentHeight": null
				, "contentMaxHeight": 250
			}
			, supportsTransitions = (function () {
				var div = doc.createElement("div")
					, style = div.style
					, supportsTransitions = ("transition" in style) || ("WebkitTransition" in style) || ("MozTransition" in style) || ("OTransition" in style) || ("msTransition" in style);
				return supportsTransitions;
			})();

		// Accordeon constructor
		function Accordeon(elem, options) {
			var instance = this;
			instance.elem = obtainElem(elem);
			instance.options = {};
			for (var prop in defaultOptions) {
				if (prop in options) {
					instance.options[prop] = options[prop];
				}
				else {
					instance.options[prop] = defaultOptions[prop];
				}
			}
			instance.options.allowMultiple && (instance.options.toggle=true);
			addClassName(instance.elem, instance.options.accordeonClass);
			instance.items = getItemsForElem(this);
			setupListeners(instance);
			if (supportsTransitions) {
				setTimeout(function () {
					var transitionDuration = (instance.options.slidingDuration/1000).toFixed(2)+"s"
					, captionTransitionData = {"properties":"background-color", "duration": transitionDuration}
					, contentTransitionData = {"properties":"height, padding-top, padding-bottom", "duration": transitionDuration};
					eachEntry(instance, function (item, idx) {
						setTransitionStyles(item.caption, captionTransitionData);
						setTransitionStyles(item.content, contentTransitionData);
					});
				}, 0);
			}
		}
		// Accordeon instance API
		Accordeon.prototype = {
			"setExpandedIdx": function (idx) {
				var instance = this;
				eachEntry(instance, function (item, loopIdx) {
					idx===loopIdx ? expand(instance, item) : close(instance, item);
				});
			}
			, "setExpandedItem": function (caption) {
				var instance = this;
				instance.setExpandedIdx(getIdxForCaption(instance, caption));
			}
			, "expandIdx": function (idx) {
				var instance = this, item = instance.items[idx];
				item && setItemExpanded(instance, item, true);
			}
			, "expandItem": function (caption) {
				var instance = this;
				instance.expandIdx(getIdxForCaption(instance, caption));
			}
			, "closeIdx": function (idx) {
				var instance = this, item = instance.items[idx];
				item && setItemExpanded(instance, item, false);
			}
			, "closeItem": function (caption) {
				var instance = this;
				instance.closeIdx(getIdxForCaption(instance, caption));
			}

			, "toggleIdx": function (idx) {
				var instance = this
					, item = instance.items[idx];
				item && instance[item.expanded?"closeIdx":"expandIdx"](idx);
			}
			, "toggleItem": function (caption) {
				var instance = this;
				instance.toggleIdx(getIdxForCaption(instance, caption));
			}
			
			, "expandAll": function () {
				var instance = this;
				eachEntry(instance, function (item, loopIdx) {
					expand(instance, item);
				});
			}
			, "closeAll": function () {
				var instance = this;
				eachEntry(instance, function (item, loopIdx) {
					close(instance, item);
				});
			}
			
		};
		Accordeon.prototype.constructor = Accordeon;


		// Private utility functions
		function getIdxForCaption(instance, caption) {
			return parseInt(caption.getAttribute("data-"+instance.options.accordeonClass+"-idx"), 10);
		}

		function expand(instance, item) {
			addClassName(item.caption, instance.options.expandedClass);
			addClassName(item.content, instance.options.expandedClass);
			if (supportsTransitions) {
				item.content.style.height = item.contentHeight+"px";
				item.content.style.paddingTop = item.paddingTop+"px";
				item.content.style.paddingBottom = item.paddingBottom+"px";
			}
			else {
				npup.interpolate(parseInt(item.content.style.height, 10), item.contentHeight, {
					"update": function (from, to, current) {
						item.content.style.height = current+"px";
					}
					, "duration": instance.options.slidingDuration
				});
				npup.interpolate(0, item.paddingBottom, {
					"update": function (from, to, current) {
						item.content.style.paddingBottom = current+"px";
					}
					, "duration": instance.options.slidingDuration
				});
				npup.interpolate(0, item.paddingTop, {
					"update": function (from, to, current) {
						item.content.style.paddingTop = current+"px";
					}
					, "duration": instance.options.slidingDuration
				});
			}
			item.expanded = true;
		}
		
		function close(instance, item) {
			removeClassName(item.caption, instance.options.expandedClass);
			removeClassName(item.content, instance.options.expandedClass);
			if (supportsTransitions) {
				item.content.style.height = "0px";
				item.content.style.paddingTop = item.content.style.paddingBottom = "0px";
			}
			else {
				npup.interpolate(parseInt(item.content.style.height, 10), 0, {
					"update": function (from, to, current) {
						item.content.style.height = current+"px";
					}
					, "duration": instance.options.slidingDuration
				});
				npup.interpolate(parseInt(item.content.style.paddingBottom, 10), 0, {
					"update": function (from, to, current) {
						item.content.style.paddingBottom = current+"px";
					}
					, "duration": instance.options.slidingDuration
				});
				npup.interpolate(parseInt(item.content.style.paddingTop, 10), 0, {
					"update": function (from, to, current) {
						item.content.style.paddingTop = current+"px";
					}
					, "duration": instance.options.slidingDuration
				});
			}
			item.content.style.paddingTop = item.content.style.paddingBottom = "0px";
			item.expanded = false;
		}

		function setItemExpanded(instance, item, expanded) {
			expanded = (typeof expanded=="undefined" || !!expanded);
			if (expanded) {
				if (instance.options.allowMultiple) {
					expand(instance, item);
				}
				else {
					eachEntry(instance, function (loopItem, idx) {
						(item.idx===idx) ? expand(instance, loopItem) : close(instance, loopItem);
					});
				}
			}
			else {
				close(instance, item);
			}
		}
		
		function removeClassName(elem, className) {
			var expr = new RegExp("(^|\\s)*"+className+"(\\s|$)");
			if (expr.test(elem.className)) {
					elem.className = elem.className.replace(expr, "");
			}
		}
		function addClassName(elem, className) {
			var expr = new RegExp("(^|\\s)"+className+"(\\s|$)");
			var has = expr.test(elem.className);
			if (!has) {
				elem.className += " "+className;
			}
		}
		function eachEntry(instance, callback) {
			var entry;
			for (var idx=0, len=instance.itemsCount; idx<len; ++idx) {
				entry = instance.items[idx];
				callback.call(null, entry, idx, instance.items);
			}
		}
		function getItemsForElem(instance) {
			instance.itemsCount = 0;
			var items = {}
				, children = instance.elem.childNodes
				, node, nodeName
				, expandIdx = (typeof instance.options.defaultExpandedIdx==null) ? null : instance.options.defaultExpandedIdx
				, findNow = "caption"
				, expandThis, entry;
			for (var idx=0, len=children.length; idx<len; ++idx) {
				node = children[idx];
				if (!node || node.nodeType!=1) {continue;}
				nodeName = node.nodeName.toLowerCase();
				if (nodeName!=(findNow=="caption"?instance.options.captionTag:instance.options.contentTag)) {
					throw new Error("Unwanted element in list when searching for "+findNow+": "+nodeName);
				}
				
				findNow=="caption" && (entry = {});
				expandThis = (expandIdx===instance.itemsCount);				
				expandThis && addClassName(node, instance.options.expandedClass);
				entry[findNow] = node;
				
				if (findNow=="caption") {
					addClassName(node, instance.options.captionClass);
					entry.idx = instance.itemsCount;
					node.setAttribute("data-"+instance.options.accordeonClass+"-idx", instance.itemsCount);
					findNow = "content";
				}
				else if (findNow=="content") {
					addClassName(node, instance.options.contentClass);
					node.style.overflow = "auto";
					if (typeof instance.options.contentHeight=="number") {
						node.style.height = instance.options.contentHeight+"px";
					}
					if (typeof instance.options.contentMaxHeight=="number") {
						node.style.maxHeight = instance.options.contentMaxHeight+"px";
					}
					addClassName(node, instance.options.expandedClass);
					entry.contentHeight = node.clientHeight;
					entry.paddingTop = parseInt(npup.getStyle(node, "padding-top"), 10);
					entry.paddingBottom = parseInt(npup.getStyle(node, "padding-bottom"), 10);
					if (supportsTransitions) {
						if (!expandThis) {
							removeClassName(node, instance.options.expandedClass);
							node.style.height = "0px";
							node.style.paddingTop = "0px";
							node.style.paddingBottom = "0px";
						}
					}
					else {
						if (expandThis) {
							node.style.height = entry.contentHeight+"px";
							node.style.paddingBottom = entry.paddingBottom+"px";
							node.style.paddingTop = entry.paddingTop+"px";
						}
						else {
							removeClassName(node, instance.options.expandedClass);
							node.style.height = "0px";
							node.style.paddingTop = "0px";
							node.style.paddingBottom = "0px";
						}
					}
				}
				// finally built an entry?
				if (entry.caption && entry.content) {
					entry.expanded = expandThis;
					items[instance.itemsCount] = entry;
					instance.itemsCount += 1;
					findNow = "caption";
				}
			}
			return items;
		}	
		
		function setTransitionStyles(elem, transition) {
			elem.style.MozTransitionProperty = transition.properties;
			elem.style.WebkitTransitionProperty = transition.properties;
			elem.style.OTransitionProperty = transition.properties;
			elem.style.MsTransitionProperty = transition.properties;
			elem.style.transitionProperty = transition.properties;
			
			elem.style.MozTransitionDuration = transition.duration;
			elem.style.WebkitTransitionDuration = transition.duration;
			elem.style.OTransitionDuration = transition.duration;
			elem.style.msTransitionDuration = transition.duration;
			elem.style.transitionDuration = transition.duration;
		}
		function setupListeners(instance) {
			npup.addEventListener(instance.elem, "mouseover", function (e) {
				var caption = npup.getEventTarget(e), item;
				while (caption && caption.nodeName.toLowerCase()!=instance.options.captionTag) {
					caption = caption.parentNode;
				}
				if (!caption) {return;}
				item = instance.items[getIdxForCaption(instance, caption)];
				if (!item) {return;}
				if (item.expanded) {
					if (instance.options.toggle) {
						close(instance, item);
					}
				}
				else {
					if (instance.options.allowMultiple) {
						expand(instance, item);
					}
					else {
						instance.setExpandedIdx(item.idx);
					}
				}
			}, false);
		}
		function obtainElem(elemOrId) {
			if (typeof elemOrId=="string") {
				return doc.getElementById(elemOrId);
			}
			if (typeof elemOrId.nodeType=="number" && elemOrId.nodeType===1) {
				return elemOrId;
			}
		}

		// add to module API
		module.accordeon = {
			"create": function (elem, options) {
				(options && typeof options == "object") || (options = {});
				return new Accordeon(elem, options);
			}
		};

	})(npup);
}

(function($){

/**
 * Adds a simple filter input for views.
 *
 * $('head').append('<script src="http://localhost/_test/jenkins/nux-js/view-filter.js" />')
 *
 * @author Maciej "Nux" Jaros
 *
 * Licensed under (at ones choosing)
 * <li>MIT License: http://www.opensource.org/licenses/mit-license
 * <li>or CC-BY: http://creativecommons.org/licenses/by/3.0/
 *
 * @requires jQueryMini or Actual jQuery.
 * @returns {ViewFilter}
 */
function ViewFilter()
{
	/**
	 * @type ViewFilter
	 */
	var _self = this;

	var items = [];

	/**
	 * Initalize after doc.ready.
	 */
	this.init = function () {
		// init items
		items = $('#projectstatus [id^=job_]');
		
		// prepare input
		var input = document.createElement("input");
		input.setAttribute("type", "text");
		input.setAttribute("placeholder", document.getElementById("search-box").getAttribute("placeholder")); // i18n :-)
		$.on(input, 'keyup', function() {
			_self.filter(this.value);
		});
		document.getElementById("view-message").appendChild(input);
	};

	/**
	 * Filter views matching any given word.
	 *
	 * @param {String} phrase Filter string.
	 */
	this.filter = function (phrase) {
		// words to array
		var words = phrase
				.replace(/^\s+/, '')
				.replace(/\s+$/, '')
				.replace(/\s+/g, ' ')
				.split(' ')
		;

		var re = new ReArray(words, 'i');
		//var re = new RegExp('('+words+')', 'i');
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (re.test(item.textContent)) {
				item.style.display='';
			} else {
				item.style.display='none';
			}
		}
	};

	/**
	 * Helper class for testing match of an array of strings.
	 *
	 * @param {Array} strings Array of strings to be prepared and used in search.
	 * @param {String} regExpFlags Flags passed to RegExp (g/i/m).
	 * @returns {ViewFilter.ReArray}
	 */
	function ReArray(strings, regExpFlags) {
		this._reArray = [];

		for (var i=0; i<strings.length; i++) {
			this._reArray.push(new RegExp(this.escapeStr4RegExp(strings[i]), regExpFlags));
		}
	}

	/**
	 * Escape phrase pre-creating RegExp.
	 *
	 * @param {String} str
	 * @returns {String}
	 */
	ReArray.prototype.escapeStr4RegExp = function(str) {
		return str.replace(/([\[\]\{\}\|\.\*\?\(\)\$\^\\])/g, '\\$1');
	};

	/**
	 * Test RegExp array for the given string.
	 *
	 * @param {String} str String to match aginst array of RegExp.
	 * @param {Boolean} matchAny (default=false) If true then match any the RegExp, otherwise all must match.
	 * @returns {Boolean}
	 */
	ReArray.prototype.test = function(str, matchAny) {
		var numMatches = 0;
		for (var i=0; i<this._reArray.length; i++) {
			var re = this._reArray[i];
			if (re.test(str)) {
				if (matchAny) {
					return true;
				} else {
					numMatches++;
				}
			}
		}
		return (numMatches == this._reArray.length);
	};
}

ViewFilter = new ViewFilter();

$(function(){ViewFilter.init()});

})(jQueryMini);
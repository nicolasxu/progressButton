
  // Project: jQuery Progress Button Plugin
  // Description:	"value",  "value", "value", functionality is common and wea, the purpose is to practice standard pattern for
	// 							AMD module, jQuery plugin, Javascript OOP :)
  // Author: Shenxin(Nicolas) Xu
  // License: MIT
 
 var jQuery = jQuery || '';
(function($, factory) {
	'use strict';
	// Set up progress button appropriately for the environment. Start with AMD. 
	var define = define || ''; // this line is added to avoid linting warning from jsHint
	if (typeof define == 'function' && define.amd) {
		// Export to $ namesapece in AMD case 
		console.log('AMD case');
		define(['jquery'], function($){
				factory($);
			} // end of function($)
		); // end of define
	} else if (typeof exports !== 'undefined') {
		console.log('back-end unsupported case');
		// then this scripted is running at server end, where it is not intended to
		return new Error('progressBtn can only work in browser, not at server end');
		// Error is standard object in Nodejs. 
		// if a module is designed to work at both server-end and front-end, you can do this:
		// factory(jQuery);
	// Finally, as a plugin in jQuery namespace. 
	} else {
		console.log('not AMD browser case');
		factory($);
	}
})(jQuery, function($){
		// real code goes here...
		'use strict';
		var pluginName = 'progressBtn';
		// PUBLIC CLASS DEFINITION
		// ================================
		var ProgressBtn = function(element, options) {
			//if (!this) return;
			this.element = element;
			this.$element = $(element);
			this.options = $.extend({}, this.DEFAULT, options);
			this._name = 'progressBtn';
			this.init();
		};
		ProgressBtn.DEFAULT = {
			// can be expanded to support a wide range of default behaviors
			propertyName: 'value'
		};
		ProgressBtn.prototype.init = function() {
			this.Progress = 0;
			this.done = false;
			// console.log(this.element);
			var progressIndicator = '<span class="progress-bar"></span>';
			var progressText = '<span class="progress-text">0%</span>';
			this.$element.append(progressIndicator);
			this.$element.append(progressText);
			this.$progressIndicator = this.$element.children('.progress-bar');
			this.$progressText= this.$element.children('.progress-text');
			// console.log('the $progressIndicator.toString is:');
			// console.log(this.$progressIndicator.toString());;
		};
		ProgressBtn.prototype.setProgress = function(percent) {
			// progress is designed to be an integer from 0 to 100.
			this.progress = percent;

			if(this.progress) {
				this.$element.prop('disabled', true);
			}
			// drawing code goes here:
			this.$progressIndicator.css({width: this.progress + '%'});
			this.$progressText.css({display:'block'});
			this.$progressText.text('working...  '+this.progress + '%');

			// if progress > 100, then reset all status
			if(this.progress >= 100) {
				this.done = true;
				this.progress = 0;
				this.$element.prop('disabled', false);
				// restore button UI status in 1 second
				this.reset(1000);
			}
		};
		ProgressBtn.prototype.reset = function(ms) {
			var resetProgressBar = $.proxy( this.$progressIndicator.css,
																this.$progressIndicator,
																{'width': this.progress + '%'}
														 );
			var resetProgressText = $.proxy(this.$progressText.css,
																this.$progressText,
																{'display':'none'}
															);
			function resetAll() {
				resetProgressBar();
				resetProgressText();
			}
			setTimeout(resetAll, ms);
		};

		// PLUGIN FUNCTION FACTORY DEFINITON
		// =========================
		// var Plugin = function($) {
			var old = $.fn.progressBtn;
			$.fn.progressBtn = function(option) {
				return this.each(function() {
					var $this = $(this);
					var data = $this.data('plugin-' + pluginName);
					if (!data) {
						$this.data('plugin-' + pluginName,
							(data = new ProgressBtn(this, option)));
					}
					if (typeof option == 'string') {
						data[option].call($this); // or $this.data[option]();
					}
				}); // end of this.each()
			};
			$.fn.progressBtn.Constructor = ProgressBtn;
			// PLUGIN NO CONFLICT
			// ====================
			$.fn.progressBtn.noConflict = function() {
				$.fn.progressBtn = old;
				return this;
			};
			// PLUGIN DATA-API
			// =================
			$(document).ready(function() {
				$('[data-api=plugin-progressBtn]').progressBtn();
			}); // end of ready()
		// }; // end of Plugin

		// return Plugin;
	} // end of function factory
); // end of module
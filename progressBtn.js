/*
 *  Project: My Plugin
 *  Description:
 *  Author:
 *  License:
 */
(function($) {
	'use strict';
	var pluginName = 'progressBtn';
	// PUBLIC CLASS wu 
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
		propertyName: 'value'
	};
	ProgressBtn.prototype.init = function() {
		this.Progress = 0;
		this.done = false;
		// console.log(this.element);
		var progressIndicator = '<span class="progress-bar"></span>';
		var progressText = '<span class="progress-text">0%</span>'
		this.$element.append(progressIndicator);
		this.$element.append(progressText);
		this.$progressIndicator = this.$element.children('.progress-bar');
		this.$progressText= this.$element.children('.progress-text');
		// console.log('the $progressIndicator.toString is:');
		// console.log(this.$progressIndicator.toString());;
	};
	ProgressBtn.prototype.setProgress = function(percent) {
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
	}

	// PLUGIN DEFINITON
	// =========================
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
	// NO CONFLICT
	// ====================
	$.fn.progressBtn.noConflict = function() {
		$.fn.progressBtn = old;
		return this;
	};
	// GREENIFY DATA-API
	// =================
		function uploadPic(fileName, cb) {
		var percent = 0;
		var intervalID = setInterval(function(){
			percent = percent + 10;
			// console.log(percent);
			cb && cb(percent);
			if( percent >= 100) {
				clearInterval(intervalID); 
				percent = 0;
			}
		}, 400);
	}

	$(document).ready(function(e) {
		$('[data-api=plugin-progressBtn]')
		.progressBtn()
		.on('click', function(e){
			// uploadPic('kkk', )
			var progressBtnObj = $(this).data('plugin-' + 'progressBtn');
			var progressBtnFunc = progressBtnObj && progressBtnObj.setProgress;
			uploadPic('fileNamexxx', $.proxy( progressBtnFunc, progressBtnObj));
		});



	}); // end of $(document).on
})(jQuery);
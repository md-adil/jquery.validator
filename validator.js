(function($, w, d, u) {
	var Rules = {
		required: function(p) {
            if(this.val() == '' || this.val() == null) {
                return false;
            }
            return true;
        },
            
        min: function(p) {
            if(this.val().length < p) {
                return false;
            }
            return true;
        },
        
        max: function(p) {
            if(this.val().length > this.param) {
                return false;
            }
            return true;
        },
        
        email: function(p) {
            var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		    if (!this.val().match(mailformat)) {
		        return false;
		    }
		    return true;
        },
        
       letter: function(p) {
			var letters = /^[A-Za-z]+$/;
		    if (!this.val().match(letters)) {
		        return false;
		    }
            return true;
		},
            
		numeric: function(p) {
			var numbers = /^[0-9]+$/;
		    if (!this.val().match(numbers)) {
		        return false;
		    }
            return true;
		},
            
		alphanumeric: function(p) {
			var letters = /^[0-9a-zA-Z]+$/;
		    if (!this.val().match(letters)) {
		        return false;
		    }
            return true;
		},
		
		otherwise: function(rule) {
			console.log("Rule \"" + rule + "\" is not defined, by default this will pass the validation");
			return true;
		}
	}
	var Validate = {
		inputFields: 'input,textarea,select',
		init: function(form, elem, rules) {
			var self = this;
			self.form = form;
			self.elem = elem;
			self.validatRules = $.extend({}, Rules, rules);
			self.extractElem();
		},
		
		extractElem: function() {
			var self = this,
			    inputs = $(self.form).find(self.inputFields);
			inputs.blur(function() {
				self.checkError.call(self, $(this));
			})
			
			$(self.form).submit(function(e) {
				self.formSubmit.call(self, e);
			});
			
		},
		
		formSubmit: function(e) {
			var self = this,
				inputs = $(self.form).find(self.inputFields);
			$.each(inputs, function(){
				var input = $(this);
				if(self.checkError.call(self, input))
					e.preventDefault();
			});
			
		},
		
		checkError: function(inputElem) {
			var self = this,
				error = false,
				rule = '',
				param = '',
				rules = inputElem.data('rules');
			if(rules == u || rules == '')
				return error;
			ruleArr = rules.split('|');
			$.each(ruleArr, function() {
				param = '';
				rule = this;
				if(rule.indexOf(':') !== -1) {
					ruleParam = rule.split(':');
					rule = ruleParam[0];
					param = ruleParam[1];
				}
				if(self.validatRules[rule] !== u) {
					if(!self.validatRules[rule].call(inputElem, param)) {
						error = true;
						return false;
					}
				}else {
					self.validatRules['otherwise'](rule);
				}
			});
			self.elem(error, inputElem, rule, param);
			return error;
		}
	}
	
	$.fn.validator = function(elem, rules) {
		return $.each(this, function() {
			var validate = Object.create(Validate);
			validate.init(this, elem, rules);
		})
	}
})(jQuery, window, document);
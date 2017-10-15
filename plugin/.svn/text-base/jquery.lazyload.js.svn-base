/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2009 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.5.0
 *
 */
(function($) {

    $.fn.lazyload = function(options) {
        var settings = {
            cancelload   : true,
            placeholder  : "./img/back-logo.gif",
            threshold    : 0,
            failurelimit : 1,
            event        : "scroll",
            effect       : "fadeIn",
            container    : window,
            url          : "url",
            seturl       : function(o,v){
            	if(o.tagName.toLowerCase()=="img"){
            		return $(o).attr("src",v);
            	}else{
            		return $(o).css({
                        "background-image":"url("+v+")",
                        "background-color":"#f5f5f5",
                        "background-size":v==settings.placeholder?"initial":"cover",
                        "background-repeat":"no-repeat",
                        "background-position":"center center"
                    });
            	}
            },
            geturl       : function(o){
            	if(o.tagName.toLowerCase()=="img"){
            		return o.src;
            	}else{
            		var match=$(o).css("background-image").match(/url\("?(.*?)"?\)/);
            		return match&&match[1];
            	}
            },
            delurl       : function(o){
            	if(o.tagName.toLowerCase()=="img"){
            		return $(o).removeAttr("src");
            	}else{
            		return $(o).css("background-image","none");
            	}
            }
        };
        

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        var elements = this;
        if ("scroll" == settings.event) {
            $(settings.container).bind("scroll", function(event) {
                
                var counter = 0;
                elements.each(function() {
                    if ($.abovethetop(this, settings) ||
                        $.leftofbegin(this, settings)) {
                            /* Nothing. */
                    } else if (!$.belowthefold(this, settings) &&
                        !$.rightoffold(this, settings)) {
                            $(this).trigger("appear");
                    } else {
                        if (counter++ > settings.failurelimit) {
                            return false;
                        }
                    }
                });
                /* Remove image from array so it is not looped next time. */
                var temp = $.grep(elements, function(element) {
                    return !element.loaded;
                });
                elements = $(temp);
            });
        }
        
        this.each(function() {
            var self = this;
                /* Save url only if it is not defined in HTML. */
                if (undefined == $(self).attr(settings.url)) {
                    $(self).attr(settings.url, settings.geturl(self));
                }

            if ("scroll" != settings.event || 
                    undefined == settings.geturl(self) || 
                    settings.placeholder == settings.geturl(self) || 
                    $(self).attr(settings.url) != settings.geturl(self) ||
                    ($.abovethetop(self, settings) ||
                     $.leftofbegin(self, settings) || 
                     $.belowthefold(self, settings) || 
                     $.rightoffold(self, settings) )) {
                if(settings.cancelload==true) {     
                    if (settings.placeholder) {
                        settings.seturl(self, settings.placeholder);
                    } else {
                        settings.delurl(self);
                    }
                }
                self.loaded = false;
            } else {
                self.loaded = true;
            }
            
            /* When appear is triggered load url image. */
            $(self).one("appear", function() {
                if (!this.loaded) {
                    var dom=$("<img />")
                        .bind("load", function() {
                            $(self).hide();
                            settings.seturl(self, $(self).attr(settings.url))
                                [settings.effect](settings.effectspeed);
                            self.loaded = true;
                        });
                    dom.each(function(){
                        $(this).attr("src",$(self).attr(settings.url));
                    });
                };
            });

            /* When wanted event is triggered load url image */
            /* by triggering appear.                              */
            if ("scroll" != settings.event) {
                $(self).bind(settings.event, function(event) {
                    if (!self.loaded) {
                        $(self).trigger("appear");
                    }
                });
            }
        });
        
        /* Force initial check if images should appear. */
        $(settings.container).trigger(settings.event);
        
        return this;

    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        if (settings.container === undefined || settings.container === window) {
            var fold = $(window).height() + $(window).scrollTop();
        } else {
            var fold = $(settings.container).offset().top + $(settings.container).height();
        }
        return fold <= $(element).offset().top - settings.threshold;
    };
    
    $.rightoffold = function(element, settings) {
        if (settings.container === undefined || settings.container === window) {
            var fold = $(window).width() + $(window).scrollLeft();
        } else {
            var fold = $(settings.container).offset().left + $(settings.container).width();
        }
        return fold <= $(element).offset().left - settings.threshold;
    };
        
    $.abovethetop = function(element, settings) {
        if (settings.container === undefined || settings.container === window) {
            var fold = $(window).scrollTop();
        } else {
            var fold = $(settings.container).offset().top;
        }
        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };
    
    $.leftofbegin = function(element, settings) {
        if (settings.container === undefined || settings.container === window) {
            var fold = $(window).scrollLeft();
        } else {
            var fold = $(settings.container).offset().left;
        }
        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };
    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() */

    $.extend($.expr[':'], {
        "below-the-fold" : "$.belowthefold(a, {threshold : 0, container: window})",
        "above-the-fold" : "!$.belowthefold(a, {threshold : 0, container: window})",
        "right-of-fold"  : "$.rightoffold(a, {threshold : 0, container: window})",
        "left-of-fold"   : "!$.rightoffold(a, {threshold : 0, container: window})"
    });
    
})(jQuery);

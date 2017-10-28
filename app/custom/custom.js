/* 
 * Custom methods
 */
window.console = window.console || {}; 
window.console.log = window.console.log || function() {};

if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/gm, '');
	};
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
         for (var i = (start || 0), j = this.length; i < j; i++) {
             if (this[i] === obj) { return i; }
         }
         return -1;
    }
}

/**
 * Download/Export file
 * 
 * @version 1.0
 */
$.download = function(url, data, method, target) {
    // url and data options required
    if (url && data) {
        // data can be string of parameters or array/object
        data = typeof data == 'string' ? data : $.param(data);

        // split params into form inputs
        var inputs = '';

        $.each(data.split('&'), function() {
            var pair = this.split('=');
            inputs += '<input type="hidden" name="' + pair[0] + '" value="'
            + pair[1] + '" />';
        });

        // send request
        $('<form action="' + url + '" target="' + (target || '_blank')
        + '"' + '" method="' + (method || 'post') + '">'
        + inputs + '</form>').appendTo('body').submit()
        .remove();
    }
};

/**
 * Removing Modal elements
 */
function removeModal() {
  
    //koothara pani To remove the element from the DOM
    $('.modal, .modal-backdrop').remove();
    $('body').removeClass('modal-open'); 
}

/**
 * Convert meridian date string to 24 hour format date string
 */
function createDateTime(dateStr, timeStr)
{
    var meridian = timeStr.substr(timeStr.length-2).toLowerCase();
    var hours    = timeStr.substring(0, timeStr.indexOf(':'));
    var minutes  = timeStr.substring(timeStr.indexOf(':')+1, timeStr.indexOf(' '));
     if (meridian=='pm') {
        hours = (hours=='12') ? '12' : parseInt(hours, 10)+12 ;
    } else {
        hours = (hours=='12') ? '00' : parseInt(hours, 10) ;
    }
	
	if(hours.length<2) {
        hours = '0' + hours;
    }
	
    return getTimestamp(dateStr + ' ' + hours+':'+minutes+':00');
}

/**
 * Convert date string to timestamp
 */
function getTimestamp(str) {
  	var d = str.match(/\d+/g); // extract date parts
  	return +new Date(d[0], d[1] - 1, d[2], d[3], d[4], d[5]); // build Date object
}

$('document').ready(function() {
	
	/**
	 * Disable autocomplete for ie browser
	 */
	$('input').attr('autocomplete','off');
	
    $('#side-menu').metisMenu();
	
	//Loads the correct sidebar on window load
    $(function() {
        $(window).bind('load', function() {
            if ($(this).width() < 753) {
                $('div.sidebar-collapse').addClass('collapse')
            } else {
                $('div.sidebar-collapse').removeClass('collapse')
            }
        })
    })
	
	//Collapses the sidebar on window resize
    $(function() {
        $(window).bind('resize', function() {
            if (this.innerWidth < 768) {
                $('div.sidebar-collapse').addClass('collapse')
            } else {
                $('div.sidebar-collapse').removeClass('collapse')
            }
        })
    });
});
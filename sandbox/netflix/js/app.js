/*jslint white: true, browser: true, devel: true, laxbreak: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, maxerr: 50, indent: 4 */
/*
* Author: Kevin M. Ryan
*
*
*/
var NetFlix = (function () {
	
	/*
		* Use alias method ($, $$) to querySelector(All)(selector)
		* EXAMPLE: var $var = $(selector);
	*/
	function $(selector, el) {
		if (!el) {
			el = this.document;
		}
		return el.querySelector(selector);
	}
	
	/* 
		* Ajax method to load various types of data 
		* ajax (method, url, success) 
		* - method - "Get", "POST"
		* - url - path/to/data
		* - success - callback if eveything went ok
	*/
	function ajax(method, url, success) {
		var r = new XMLHttpRequest();
		r.onreadystatechange = function () {
			if (r.readyState === 4 && r.status === 200) {
				success(r.responseText);
			}
		};
		r.open(method, url, true);
		r.send(null);
	}
	
	/*
		* quick modal dialog
	*/
	function dialog(data) {
		var wrap = document.createElement('div'),
			body = document.getElementsByTagName("body")[0],
			modalBg = document.createElement('div');
		wrap.id = "dialog";
		modalBg.id = "modalBg";
		wrap.innerHTML = data;
		modalBg.appendChild(wrap);
		body.appendChild(modalBg);
	}
	
	/************************** MAIN APP ****************************/
	/* 
		* Setup vars local to this App and use out $ alias
		* $var is used to signify this var is carrying a HTML node
		* these are global to the NetFlix object and cached on App load
	*/
	var $nav = $('#page ul#nav'),
		$content = $('#page #content'),
		$navFirstOfType = $("li:first-of-type"),
		$lastOfType = $('li:last-of-type'),
		activeClassName = "active",
		currentClassName = "current",
		startUrl = 'pages/suggestions.html';
		
	/* 
		* Handles the response to keyEvents
		* based on keyCode, move up and down the DOM.
		* if in left nav, load page based on link url
	*/
	function handleEvents(e) {

		/* theres var are set on each keypress to figure out state */
		var $active = $('.' + activeClassName),
			$current = $('ul#nav li.' + currentClassName),
			$activeParent = ($('.' + activeClassName, $nav)) ? $nav : $content,
			$contentFirstOfType = $("#content ul li:first-of-type"),
			$contentLastOfType = $("#content ul li:last-of-type"),
			dialogVisible = $('#modalBg'),
			imgSrc = '',
			filename = '',
			action = '';

		/* clear the className from the current active element */	
		$active.className = " ";
		
		/* if the dialog is visible, on keystoke remove it */	
		if (dialogVisible) {
			document.body.removeChild(dialogVisible);
		}
		
		/* switch based on the key that is pressed */
		switch (e.keyCode) {
		// Up
		case 38: 
			/* set the action based on the section we are in (nav || content) */
			action = ($activeParent === $nav) ? $lastOfType : $contentLastOfType; 
			/* if their is a previous element move up, otherwise do action */
			$active = ($active.previousElementSibling) ? $active.previousElementSibling : action;
			break;
		// Down
		case 40:
			/* set the action based on the section we are in (nav || content) */
			action = ($activeParent === $nav) ? $navFirstOfType : $contentFirstOfType; 
			/* if their is a previous element move up, otherwise do action */
			$active = ($active.nextElementSibling) ? $active.nextElementSibling : action;
			break;
		 // Left	
		case 37:
			/* only if we are in the content section, left should do nothing when under nav section */
			if ($activeParent === $content) {
				if (e.keyCode === 39) { // Right
					$active = $active.nextElementSibling;
				} else if (e.keyCode === 37) { // Left
					if ($active.previousElementSibling !== null) {
						$active = $active.previousElementSibling;
					} else {
						$active = $current;
					}
				}
			}
			break;
		// Right
		case 39: 
			/* set the ".current" class on the nav element we just left */
			$active.className = currentClassName;
			/* Not under content... */
			if ($activeParent !== $content) {
				/* force us over to the first element in the content section */
				$activeParent = $content;
				$active = $contentFirstOfType;
			} else {
				/* now that we are under content, just navigate under content */
				if (e.keyCode === 39) { // Right
					$active = ($active.nextElementSibling) ? $active.nextElementSibling : $contentFirstOfType;
				} else if (e.keyCode === 37) { // Left
					$active = $active.previousElementSibling;
				}
			}
			break;
		/* Return */
		case 13: 
			if ($activeParent === $nav) {
				$active.className = currentClassName;
				$activeParent = $content;
				$active = $contentFirstOfType;
				e.preventDefault();
				e.stopPropagation();
			} else {
				imgSrc = $active.firstElementChild.firstElementChild.src;
				if (imgSrc) {
					filename = imgSrc.substring(imgSrc.lastIndexOf('/') + 1);
					dialog('<p>' + filename + '</p><img src="' + imgSrc + '" />');
				}
			}
			break;
		default:
			e.preventDefault();
			e.stopPropagation();
			break;
		}
		
		/* set the className and focus of the current element */
		$active.className = activeClassName;
		$active.firstElementChild.focus();
		
		/* if we are under the main nav and NOT the right arrow key... */
		if ($activeParent === $nav && e.keyCode !== 39) {
			/* load the data based on the URL  */
			ajax('GET', $active.firstElementChild.href, function (respo) {
				$content.innerHTML = respo;
			});
		}
	}
	
	/*
		* Setup the init() method to set the start state of the app
	*/
	function init(url) {
		/* Add active class and focus to first element in our nav */
		$navFirstOfType.className = activeClassName;
		$navFirstOfType.firstElementChild.focus();
		
		/* set a timeout on load to simulate a slow network */
		// setTimeout(function () {
		/* load our sub start page */
		ajax('GET', startUrl, function (respo) {
			$content.innerHTML = respo;
		});
		// }, 300);
		
		/* Attach an eventListener on the window to listen for keydown events */
		document.addEventListener('keydown', function (e) {
			handleEvents(e);
		}, false);
	}
	
	/* 
		* evenything above this is private - to expose private members to the public,
		* add them to the list... you can name them whatever.
		* "modal" maps to "dialog", NetFlix.modal("hello");
	*/
	return {
		init: init
		// ,modal: dialog
	};

}());

/* initiate our app */
NetFlix.init();
/* example of exposing private methods */
// NetFlix.modal("hello");
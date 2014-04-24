Learn Mode Client v1
================

A Learn Mode client built with HTML5, CSS3 and JavaScript, which focuses on performance, responsive design to provide good user experience.

Version
------
v1.34

Description
------
 1.  The JavaScript code is **not** using any JS framework. 
 2.  I'm using Windows to minify the code. If you want to minify the `lm.*`, simply execute `/res/js/!merge`.
 3.  Before modifying the JS, check the HTML page to make sure you are not using a minified version of JS.
 4.  Please note that **for the production ver., `proxy.php` and `userdata.php`(optional) are required.** The arguments and source code, however, is not exposed in case some request be forbidden by the offical Learn Mode API.

Run -- using XAMPP
------
To make it run in a browser with XAMPP installed, you should note the following points:
 1.  The application should be placed under the root directory by default.
 2.  cURL may be used as a proxy, but you need to modify `php.ini` in order to establish HTTPS connection with Learn Mode server. To do this, add this line to `php.ini`:

		curl.cainfo=path/to/cacert.pem

	The file can be found in `/tool/`.

Demo
------
Live demo: http://lm.twbbs.org.

Hope you have fun if you have a vaild MAC code to login.

Learn Mode Client v1
================

A Learn Mode client built with HTML5, CSS3 and JavaScript, which focuses on performance, responsive design to provide good user experience.

Version
------
v1.40

The project is used only as a repo to save and compare code, not a copy from the live demo.

Description
------
 1.  The JavaScript code is **not** using any JS framework. 
 2.  I minify the code under Windows. If you want to merge and minify the `lm.*.js`, simply execute `/res/js/!merge`. After uploading, you can clean the temp files by `/res/js/!clean`.
 3.  Before modifying the JS, check the HTML page to make sure you are not using a minified version of JS.
 4.  Please note that **for the production usage, `proxy.php`(to allow CORS and sending POST request) and `userdata.php`(allow to save user data in JSON) are required, and you must finish them on your own.** The arguments and source code, however, is not exposed in case some request be forbidden by the offical Learn Mode API.

Run -- using XAMPP
------
To make it run in a browser with XAMPP installed, you should note the following points:
 1.  The application should be placed under the root directory by default.
 2.  cURL may be used as a proxy, but you need to modify `php.ini` in order to establish HTTPS connection with Learn Mode server. To do this, add this line to `php.ini`:

		curl.cainfo=path/to/cacert.pem

	The related file can be found in `/tool/`.

Demo
------
Live demo: http://lm.twbbs.org.

Hope you have fun if you have a vaild MAC code to login.

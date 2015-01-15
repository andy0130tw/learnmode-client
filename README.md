Learn Mode Client v1
================

A Learn Mode client built with HTML5, CSS3 and JavaScript, which focuses on performance, responsive design to provide good user experience.

Version
------
v1.73

The project is used only as a repo to save and compare code, not a copy from the live demo.

Recent changes
------
###v1.64 to v1.73
* Add font weight 300 (aka "light")
* Update some shadows according to Google Material Design spec
* Overlay feature - show a small dot to indicate...
  * Someone blocks you or is blocked by you
  * Someone you are not following
  * Someone that is not following you
* Disable mfp's zoom cursor (name collision)
* Modals now have wider gaps on small viewports so that one can close a modal more easily.
* Update the server to *.learnmode.net (since it usually faster)
* Update badge description according to my analysis.
* Add experimental feature: Show user id instead of school
* Try to implement cache system but failed
* `LowLevelQuery` is made because the system leaks all of its data, allowing anyone to access.
  * but it is now patched, so the code is not working.
* Modify the logic because the server change its beheavior after update
  * LM 4.14.1040.1 or LMC v1.73
  * Moderated posts(`flagged=true`) no longer hides the data
  * New features DaDaTalk
  * username frozen
* Add word counters
  * correctly handling newlines(1 nl = 2 char)
  * the limit is 1024 characters
  * warning
* Update MAC autocomplete: if the MAC starts with `!`, then use the raw string without that `!`.
* Update information on name cards
* Add detection of future time in timestamps

###v1.43 to v1.64
* Modify custom code of Shadowbox
* Beautify login popup
* Add `placeholder` for some inputs
* Add more random tips(?)
* Update CSS properties like `line-break` in posts
* Add internal post links recognition
* Add tooltips on subjects. 
* Add option to list posts reversely
* Update appearance of voters, with simple substitutions like myself, questioner, or the user himself.
* Add dummy user as a fallback when the user is not in the database(be deleted... most of which are virtual accounts before.)
* Fix some issue caused by polyfilling `Array.prototype.indexOf`.
* Update searching users modal to preserve last searched result.
* Update some regex for marking up posts and rendering notifications from Books, Course, and Practice.
* Fix bug: name of the user on top of the screen overflows in mobile view.
* Fix bug: `console.log` may not exist.
* Add animation support detection. Provide fallback content if the loading ring is not supposed to be rendered properly.
* Always use JSON instead of JSONP when available.
* Add some (awesome / awful?) experimental features.
* Add progress bar in level page.
* Update user's cards.

###v1.40 to v1.43
* Voting up/down now integrates and improves.
* Remove panel and accordion in MetroUI(Replaced by Bootstrap components below).
* Rename Bootstrap `.popover` to `.component`, adding panel and collapsible into it.
* Rename some functions' names.
* Make loading ring only when in need(remove if hidden).
* Add ggt.tw copyright information and show it in minified js.
* New mechanism to show approperiate panel by category in posting modal.
* Update `!badge`'s switchNavByType.
* Improve storageObject, add method: clear, remove.
* Update notify.info when sending !emotion and !vote.
* Fix bug: improper logging out.
* Fix bug: userRelation will not be shown instead of string 'false' in name cards.
* Fix bug: badge's subjects are now persistent between different view button clicked (also optimized dom cache).
* Fix bug: data loses when clicking load more button in users' modal.

Description
------
 1.  I minify the code under Windows. If you want to merge and minify the `lm.*.js`, simply execute `/res/js/!merge`. After uploading, you can clean the temp files by `/res/js/!clean`.
 2.  Before modifying the JS, check the HTML page to make sure you are not using a minified version of JS.
 3.  Please note that **for the production usage, `proxy.php`(to allow CORS and sending POST request) and `userdata.php`(allow to save user data in JSON) are required, and you must finish them on your own.** The arguments and source code, however, is not exposed in case some request be forbidden by the offical Learn Mode API.

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

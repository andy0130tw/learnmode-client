//trim
//String.prototype.trim=String.prototype.trim||function(){return this.replace(/^\s+|\s+$/g, '');};}
//indexOf for array
if(!Array.prototype.indexOf)Array.prototype.indexOf=function(r,t){if(void 0===this||null===this)throw new TypeError('"this" is null or not defined');var i=this.length>>>0;for(t=+t||0,1/0===Math.abs(t)&&(t=0),0>t&&(t+=i,0>t&&(t=0));i>t;t++)if(this[t]===r)return t;return-1};

JSON=JSON||{};
// implement JSON.parse
if(typeof JSON.parse!=="function"){cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}};
// implement JSON.stringify serialization
JSON.stringify=JSON.stringify||function(e){var d=typeof(e);if(d!="object"||e===null){if(d=="string"){e='"'+e+'"'}return String(e)}else{var f,b,c=[],a=(e&&e.constructor==Array);for(f in e){b=e[f];d=typeof(b);if(d=="string"){b='"'+b+'"'}else{if(d=="object"&&b!==null){b=JSON.stringify(b)}}c.push((a?"":'"'+f+'":')+String(b))}return(a?"[":"{")+String(c)+(a?"]":"}")}};
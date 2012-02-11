// ==UserScript==
// @name           twithere
// @namespace      http://userscripts.org/
// @include        *
// @require        http://code.jquery.com/jquery.min.js
// ==/UserScript==

function twithere(url){
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://search.twitter.com/search.json" + url,
        onload: function(response) {
            search= eval('(' + response.responseText + ')');
            for(i in search.results){
                tweet= search.results[i];
                $('#twithere_content').append(
                    '<div style="clear:both; border-bottom:1px solid crimson; padding:4px; min-height:48px">' +
                        '<div style="float:left">' +
                            '<img src="' + tweet.profile_image_url + '" style="border-radius:5px; width:48px; height:48px;" />' +
                        '</div>' +
                        '<div style="margin-left:58px; text-align:left; font-size:12px; min-height:48px;">' +
                            '<span style="color:black;">' + tweet.from_user +':&nbsp;' + '</span>' + 
                            '<span>' + linkify(tweet.text) + '</span>' +
                        '</div>' + 
			'<div style="position:relative; top:-8px; height:0px; margin-right:12px; color:black; text-align:right; font-size:10px;">' + 
			    time_interp(tweet.created_at) + 
                        '</div>'+ 
                    '</div>'
                );
                $('#twithere_count').text(function(index, text){
                    return Number(text) + 1;
                });
            }
            if(search.next_page){
                $('#twithere_content').append('<a id="twithere_more" style="cursor:pointer;">more</a>');
                $('#twithere_more').hover(function(){
                    $(this).remove();
                    twithere(search.next_page);
                });
            }
        }
    });
}
function linkify(txt){
    return txt.replace(
        /((https?\:\/\/)|(www\.))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi,
        function(_url){
            var full_url= _url;
            if (!full_url.match('^https?:\/\/')) {
               full_url= 'http://' + full_url;
            }
            var short_url= _url.replace(/^https?:\/\//,'');
            return '<a href="' + full_url + '">' + short_url + '</a>';
        }
    );
}
function parseTwitterDate(txt) {
    var t = txt.replace(/(\d{1,2}[:]\d{2}[:]\d{2}) (.*)/,'$2 $1');
    t = t.replace(/(\+\S+) (.*)/,'$2 $1')
    return ( new Date(Date.parse(t)) );
}
function fuzz_tm(sec)
{
    var str= '';
    var t= [(sec)];
    var def= {'year':31536000,'day':86400,'hour':3600,'min':60,'sec':1};
    Object.keys(def).map(function(unit,j){
    	t.splice( j, 1, Math.floor(t[j]/def[unit]), t[j]%def[unit] );
    	if( t[j]>0 && str.length<8 )
    		str+= t[j] + (' ') + unit + (t[j]>1?'s':'') + (' ');
    });
    return str+'ago';
}
var now= new Date();
function time_interp(date_t){
    var diff= Math.abs(parseTwitterDate(date_t)-now);
    return fuzz_tm(Math.floor(diff/1000)); 
}
if(window.parent == window){ // process only main page, not iframes
    $('body').append(
        '<div id="twithere" style="position:fixed; top:10px; left:10px; width:auto; max-width:400px; text-align:left; color:navy; opacity:0.9; z-index:5566; border-radius:5px; padding:3px; background-image: -moz-linear-gradient(left, rgb(245,142,32) 10%, rgb(255,0,0) 58%);">' +
            '<a id="twithere_toggle" style="cursor:pointer;">twithere</a>&nbsp;[<span id="twithere_count">0</span>]' +
	    '<div id="twithere_content" style="display:none; margin-right:8px;">' +
		'<div style="position:absolute; height:100%; width:100%; top:0px; left:0px; margin-left:0px; z-index:-1;" align="right">' +
		    '<div id="twithere_withdraw" style="height:100%; width:12px; background-color:darkred; cursor:pointer;"/>' +
		'</div>' +
	    '</div>'+
	'</div>'
    );
    function showntell(){
        var sw= $('#twithere_content').is(':hidden');
        $('#twithere').css('position',(sw?'absolute':'fixed'));
        $('#twithere_content').toggle('fast');
    } 
    $('#twithere_toggle').click(showntell);
    $('#twithere_withdraw').click(showntell);
    var url = "?q="+encodeURIComponent(window.location.href);
    twithere(url);
}


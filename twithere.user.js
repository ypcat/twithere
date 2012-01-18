// ==UserScript==
// @name           twithere
// @namespace      http://userscripts.org/
// @include        *
// @require        http://code.jquery.com/jquery.min.js
// ==/UserScript==

function twithere(url){
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://search.twitter.com/search.json?q="+encodeURIComponent(url),
        onload: function(response) {
            search = eval('('+response.responseText+')');
            for(i in search.results){
                tweet = search.results[i];
                $('#twithere_content').append(
                    '<div style="clear:both; border-bottom:1px solid crimson; padding:4px; min-height:48px">' +
                        '<div style="float:left">' +
                            '<img src="' + tweet.profile_image_url + '" style="border-radius:5px;" />' +
                        '</div>' +
                        '<div style="margin-left:58px;">' +
                            '<span style="color:black;">'+ 
                            tweet.from_user + ': '+
                            '</span>'+ 
                            linkify(tweet.text) +
                        '</div>' +
                    '</div>'
                );
                $('#twithere_count').text(function(index, text){
                    return Number(text) + 1;
                });
            }
        }
    });
}
function linkify(txt){
    if(txt)
    txt = txt.replace(
	    /((https?\:\/\/)|(www\.))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi,
        function(_url){
            var full_url = _url;
            if (!full_url.match('^https?:\/\/')) {
               full_url = 'http://' + full_url;
            }
            var short_url = _url.replace(/^https?:\/\//,'');
            return '<a href="'+full_url+'">'+short_url+'</a>';
        }
    );
    return txt;
}
if(window.parent == window){ // process only main page, not iframes
    $('body').append(
        '<div id="twithere" style="position:absolute; top:10px; left:10px; width:auto; max-width:400px; color:navy; opacity:0.9; z-index:5566; border-radius:5px; padding:3px; background-image: -moz-linear-gradient(left, rgb(245,142,32) 10%, rgb(255,0,0) 58%); " >' +
        '<a id="twithere_toggle">twithere</a>' + ' ' +
        '[<span id="twithere_count">0</span>]' +
        '<div id="twithere_content" style="display:none; " />' +
        '</div>'
    )
    $('#twithere_toggle').click(function(){
        $('#twithere_content').toggle();
    });
    twithere(window.location.href);
}


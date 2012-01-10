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
                    '<div><img src="' + tweet.profile_image_url + '" />' +
                    tweet.from_user + ': ' + tweet.text +
                    '</div>'
                );
                $('#twithere_count').text(function(index, text){
                    return Number(text) + 1;
                });
            }
        }
    });
}

if(window.parent == window){ // not iframes
    $('body').append(
        '<div id="twithere" style="position:absolute; top:10px; left:10px; width:auto; max-width:400px; background-color:red; color:cyan; opacity:0.8; z-index:5566; " >' +
        '<a id="twithere_toggle">twithere</a>' + ' ' +
        '<span id="twithere_count">0</span>' +
        '<div id="twithere_content" style="display:none; " />' +
        '</div>'
    )
    $('#twithere_toggle').click(function(){
        $('#twithere_content').toggle();
    });
    twithere(window.location.href);
}


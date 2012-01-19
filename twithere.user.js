// ==UserScript==
// @name           twithere
// @namespace      http://userscripts.org/
// @include        *
// @require        http://code.jquery.com/jquery.min.js
// ==/UserScript==

function twithere(url){
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://search.twitter.com/search.json"+url,
        onload: function(response) {
            search = eval('('+response.responseText+')');
            for(i in search.results){
                tweet = search.results[i];
                $('#twithere_content').append(
                    '<div style="clear:both; border-bottom:1px solid crimson; padding:4px; min-height:48px">' +
                        '<div style="float:left">' +
                            '<img src="' + tweet.profile_image_url + '" style="border-radius:5px;width:48px;height:48px;" />' +
                        '</div>' +
                        '<div style="margin-left:58px;">' +
                            '<span style="color:black;">'+
                            tweet.from_user + ': '+
                            '</span>'+ 
                            linkify(tweet.text) +
                            '<div style="color:darkred;text-align:right;font-size:8px;">'+ 
                            time_interp(tweet.created_at) +
                            '</div>'+ 
                        '</div>' +
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
function parseTwitterDate(txt) {
    var t = txt.replace(/(\d{1,2}[:]\d{2}[:]\d{2}) (.*)/, '$2 $1');
    t = t.replace(/(\+\S+) (.*)/, '$2 $1')
    return ( new Date(Date.parse(t)) );
}
function fuzz_tm(sec)
{
    var str= '';
    var t= { val: 0, unit: str };
    var s= (((sec % 31536000) % 86400) % 3600) % 60;
    if( s>0 ) t= { val:s, unit: 'sec' };
    var m= Math.floor((((sec % 31536000) % 86400) % 3600) / 60);
    if( m>0 ) t= { val:m, unit: 'min' };
    var h= Math.floor(((sec % 31536000) % 86400) / 3600);
    if( h>0 ) t= { val:h, unit: 'hour' };
    var d= Math.floor((sec % 31536000) / 86400); 
    if( d>0 ) t= { val:d, unit: 'day' };
    if( t.val>0 ) str= t.val+' '+t.unit+(t.val>1?'s':'')+' ago';
    return str;
}
var now= new Date();
function time_interp(date_t){
    var diff= Math.abs(parseTwitterDate(date_t)-now);
    return fuzz_tm(Math.floor(diff/1000)); 
}

if(window.parent == window){ // process only main page, not iframes
    $('body').append(
        '<div id="twithere" style="position:fixed; top:10px; left:10px; width:auto; max-width:400px; color:navy; opacity:0.9; z-index:5566; border-radius:5px; padding:3px; background-image: -moz-linear-gradient(left, rgb(245,142,32) 10%, rgb(255,0,0) 58%); " >' +
        '<a id="twithere_toggle" style="cursor:pointer;">twithere</a>' + ' ' +
        '[<span id="twithere_count">0</span>]' +
        '<div id="twithere_content" style="display:none; " />' +
        '</div>'
    )
    $('#twithere_toggle').click(function(){
        var sw= $('#twithere_content').is(':hidden');
        $('#twithere').css('position',(sw?'absolute':'fixed'));
        $('#twithere_content').toggle();
    });
    var url = "?q="+encodeURIComponent(window.location.href);
    twithere(url);
}



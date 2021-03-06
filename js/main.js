﻿/**
  * @author michael.spencer@washingtonpost.com (Mike Spencer)
  * @fileoverview custom portrait unit for Statoil
  */
(function(w, d, $, wpAd){

  'use strict';
  
  if(!$){return false;}
  
  var $container = $('#statoil_portrait_ad'),
    geoconsensus_url = 'http://geoconsensusdata.com/api/1.0/erp/content?theme=erp4DBD10A39FEAF917F&image=true&excerpt=true&element=article+author&key=1bDVQEbP',
    yql_base = 'http://query.yahooapis.com/v1/public/yql',
    slate_feed = (/slate\.com/.test(d.domain) ? '//www.slate.com/articles/health_and_science/' : 'js/') + 'human_evolution.teaser.all.2.json';

  //randomly sort array:
  Array.prototype.shuffle = function(){
    for (var j, x, i = this.length; i; j = parseInt(Math.random() * i, 10), x = this[--i], this[i] = this[j], this[j] = x);
    return this;
  };

  //get top slate article:
  $.getJSON(slate_feed, function(data){
    if(data && data.entries){
      var entry = data.entries[Math.floor(Math.random()*data.entries.length)];
      $('#statoil_article_main', $container).attr({href: wpAd.statoil_vars.clickTrack + entry.link}).empty().append('<img src="' + entry.media[0].thumbnails[0].url + '" width="272" alt="" />');
      $('#statoil_article_headline', $container).attr({href: wpAd.statoil_vars.clickTrack + entry.link}).append(entry.menuline);
    } else {
      $('#statoil_article_main, #statoil_article_headline', $container).empty();
    }
  });

  //get geoconsensus articles:  
  $.ajax({
    url: yql_base,
    data: {
      'q': 'select json.content_title, json.url, json.image, json.excerpt, json.element from json where url="' + geoconsensus_url + '"',
      'format': 'json',
      '_maxage': '86400'
    },
    cache: true,
    dataType: 'jsonp',
    jsonp: 'callback',
    jsonpCallback: 'wpAd.natGeoCB'
  });
  
  //geoconsensus JSONP callback:
  wpAd.natGeoCB = function(arg){
    var data = arg && arg.query && arg.query.results && arg.query.results.json || false,
      html = [];
    if(data){
      data = data.shuffle().slice(0,3);
      $.each(data, function(i, item){
        var excerpt = item.json.excerpt && item.json.excerpt.replace(/&lt;.*?&gt;/ig, '') || '',
          char_lim = 55,
          source = item.json.element ? '<p class="source">From ' + item.json.element + '</p>' : '';
        if(excerpt.length > char_lim){
          excerpt = excerpt.substr(0, char_lim) + '&hellip;';
        }
        html.push('<a class="statoil-article clear" href="' + wpAd.statoil_vars.clickTrack + item.json.url + '" target="_blank"><img src="' + item.json.image + '" width="94" height="70" alt="" /><p class="bold">' + item.json.content_title + '</p><p>'  + excerpt + '</p>'+ source +'</a>');
      });
      $('#statoil_articles_bottom', $container).empty().append(html.join(''));
    }
  };
  
  function addPixel(arg){
    $(d.createElement('img')).attr({
      'width': '1',
      'height': '1',
      'src': arg.replace(/\[timestamp\]|\[random\]|\%n/gi, Math.floor(Math.random()*1E9)),
      'alt': arguments[1] || 'pixel'
    }).css({
      'border': '0',
      'display': 'none'
    }).appendTo($container);
  }

  function startSpinners(){
    if(w.Spinner){
      $('div.spin', $container).each(function(){
        new w.Spinner({
          length: 5,
          width: 3,
          radius: 8,
          color:'#fff'
        }).spin(this);
      });
      return true;
    }
    return false;
  }

  if(!startSpinners()){
    $(startSpinners);
  }
  
  //render impression pixel
  addPixel('http://statoil.solution.weborama.fr/fcgi-bin/adserv.fcgi?tag=827433&f=10&h=R&rnd=[RANDOM]', 'impression pixel');
  
})(window, document, window.jQuery, wpAd);
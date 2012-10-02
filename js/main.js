/**
  * @author michael.spencer@washingtonpost.com (Mike Spencer)
  * @fileoverview custom portrait unit for Statoil
  */
(function(w, $, wpAd){

  'use strict';
  
  if(!$){return false;}
  
  var $container = $('#statoil_portrait_ad'),
    geoconsensus_url = 'http://geoconsensusdata.com/api/1.0/erp/content?theme=erp4DBD10A39FEAF917F&key=1bDVQEbP&image=true&excerpt=true',
    yql_base = 'http://query.yahooapis.com/v1/public/yql';

  //randomly sort array:
  Array.prototype.shuffle = function(){
    for (var j, x, i = this.length; i; j = parseInt(Math.random() * i, 10), x = this[--i], this[i] = this[j], this[j] = x);
    return this;
  };

  //get top slate article:
  //$.getJSON('//www.slate.com/articles/arts/culturebox.teaser.all.2.json', function(data){ //FOR TESTING
  //$.getJSON('js/feed.json', function(data){ //FOR TESTING
  $.getJSON('//www.slate.com/articles/health_and_science/human_evolution.teaser.all.2.json', function(data){
    if(data && data.entries){
      var entry = data.entries[Math.floor(Math.random()*data.entries.length)];
      $('#statoil_article_main', $container).attr({href: wpAd.statoil_vars.clickTrack + entry.link}).empty().append('<img src="' + entry.media[0].thumbnails[0].url + '" width="272" alt="" />');
      $('#statoil_article_headline', $container).attr({href: wpAd.statoil_vars.clickTrack + entry.link}).append(entry.menuline);
    } else {
      $('#statoil_article_main, #statoil_article_headline', $container).empty();
    }
  });

  //get geoconsensus articles:
  $.getJSON(yql_base + '?callback=?', {
    q: 'select json.content_title, json.url, json.image,json.excerpt from json where url="' + geoconsensus_url + '"',
    format: 'json',
    max_age: '3600'
  }, function(arg){
    var data = arg && arg.query && arg.query.results && arg.query.results.json || false,
      html = [];
    if(data){
      data = data.shuffle().slice(0,3);
      $.each(data, function(i, item){
        var excerpt = item.json.excerpt && item.json.excerpt.replace(/&lt;.*?&gt;/ig, '') || '', char_lim = 75;
        if(excerpt.length > char_lim){
          excerpt = excerpt.substr(0, char_lim) + '&hellip;';
        }
        html.push('<a class="statoil-article clear" href="' + wpAd.statoil_vars.clickTrack + item.json.url + '" target="_blank"><img src="' + item.json.image + '" width="94" height="70" alt="" /><p class="bold">' + item.json.content_title + '</p><p>'  + excerpt + '</p></a>');
      });
      $('#statoil_articles_bottom', $container).empty().append(html.join(''));
    }
  });

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

})(window, window.jQuery, wpAd);
var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var express = require('express');

var url = require('url');

var bbsUrl = 'http://bbs.tianya.cn/';
var app = express();

superagent.get(bbsUrl).end(function (err, res) {
	if (err) {
		return console.error(err);
	}
	var titleUrls = [];
	var $ = cheerio.load(res.text);

	$('.bbs-list .title a').each(function(idx, element) {
		var $element = $(element);

		var href = url.resolve(bbsUrl, $element.attr('href'));
		titleUrls.push(href);
	});

	// console.log(titleUrls);

	var ep = new eventproxy();

	ep.after('title_html', bbsUrl.length, function (titles) {
		titles = titles.map(function (titlePair) {
			var titleUrl = titlePair[0];
			var titleHtml = titlePair[1];
			var $ = cheerio.load(titleHtml);

			return ({
				title: $('.s_title').text().trim(),
				href: titleUrl,
				comment1: $('.bbs-content').eq(0).text().trim(),
			});
		});

		console.log('final:');
		console.log(titles);
	});

	titleUrls.forEach(function (titleUrl) {
      superagent.get(titleUrl)
        .end(function (err, res) {
          console.log('fetch ' + titleUrl + ' successful');
          ep.emit('title_html', [titleUrl, res.text]);
        });
    });

});

app.listen(3000, function () {
  console.log('app is listening at port 3000');
});
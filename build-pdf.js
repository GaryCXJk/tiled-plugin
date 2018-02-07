var markdownpdf = require('markdown-pdf');
var toc = require('markdown-toc');
var fs = require('fs');
var pdf = require('html-pdf');

var html = fs.readFileSync('./doc/src/index.html', 'utf8');
var mdDocs = ["introduction.md", "usage.md", "properties.md", "devhooks.md"];
var bookPath = "doc/help.pdf";
var commentPath = "doc/help.js";

var str = '';

mdDocs.forEach(function(file) {
	str+= fs.readFileSync('doc/src/' + file);
});

var Remarkable = require('remarkable');
var rm = new Remarkable();

html = html.replace(/{{\s*input\s*}}/, rm.render(str));

var options = {
	format: "A4", border: "0.25in"
};
 
pdf.create(html, options).toFile(bookPath, function(err, res) {
  if (err) return console.log(err);
  console.log(res); //
});

var comment = str.replace(/(\n\r|\r\n)/g,'\n');
comment = comment.replace(/(^|[\n\r]+)(###|   )\s+(.+?[^\s])([\n\r]+|$)/g, function(matches) {
	var line = '-';
	if(arguments[2] === '###') {
		line = '=';
	}
	var returnStr = arguments[1];
	returnStr+= arguments[3] + '\n';
	for(var idx = 0; idx < arguments[3].length; idx++) {
		returnStr+= line;
	}
	returnStr+= arguments[4];
	return returnStr;
});

comment = comment.replace(/(^|[\n\r]+)(#{1,2})\s+(.+?)([\n\r]+|$)/g, function(matches) {
	var line = '=';
	if(arguments[2] === '##') {
		line = '-';
	}
	var separator = '';
	for(var idx = 0; idx < 80; idx++) {
		separator+= line;
	}
	var returnStr = arguments[1];
	returnStr+= separator + '\n';
	returnStr+= line + ' ' + arguments[3];
	for(var idx = 2 + arguments[3].length; idx < 78; idx++) {
		returnStr+= ' ';
	}
	returnStr+= ' ' + line + '\n';
	returnStr+= separator + arguments[4];
	return returnStr;
});
comment = comment.replace(/\*\*(.+?)\*\*  /g, '  $1');
comment = comment.replace(/\\_/g, '_');

fs.writeFileSync(commentPath, '/*\n * ' + comment.split('\n').join('\n * ') + '\n */');
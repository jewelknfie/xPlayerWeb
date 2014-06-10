var fs = require('fs');

function Productors() {
};

module.exports = Productors;

Productors.productorList=function() {
	return ['手机软件', 'smart pss', '招商引资'];
}
Productors.classificationList=function() {
	return ['产品介绍', '操作指南', 'Q&A 技术交流'];
}

Productors.videoList=function(callback) {
	var list = fs.readdirSync('./public/resources');
    var files = [], i = 0;
    list.forEach(function (item) {
        if (item.lastIndexOf('.mp4') == (item.length - 4)) {
            files[i++] = item;
        }
    });
    return files;
}


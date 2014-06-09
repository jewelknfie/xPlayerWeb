var fs = require('fs');

function Productors() {
};

module.exports = Productors;

Productors.productorList=function() {
	return ['手机软件', 'smart pss'];
}
Productors.classificationList=function() {
	return ['产品介绍', '操作指南', 'Q&A 技术交流'];
}

Productors.videoList=function(callback) {
	return fs.readdirSync('./public/resources');
}


var fs = require('fs');

function Productors() {
};

module.exports = Productors;

Productors.productorList=function() {
	return ['产品A', '明星产品B', '明星产品C'];
}
Productors.classificationList=function() {
	return ['产品介绍', '产品流程', 'Q&A'];
}

Productors.videoList=function(callback) {
	return fs.readdirSync('./public/resources');
}


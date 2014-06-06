var mongodb = require('./db');

function Post(name, title, productor, classification, videoName, post) {
	this.name = name;
	this.title = title;
	this.productor = productor;
	this.classification = classification;
	this.videoName = videoName;
	this.post = post;
};

module.exports = Post;

//存储用户信息
Post.prototype.save = function(callback) {
	var date = new Date();
	//存储各种时间格式，方便以后扩展
	var time = {
		date: date,
		year: date.getFullYear(),
		month: date.getFullYear() + "-" + (date.getMonth() + 1),
		day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
		minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
				date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
	};

	//要存入数据库的用户文档
	var post = {
		name: this.name,
		time: time,
		title: this.title,
		productor: this.productor,
		classification : this.classification,
		videoName: this.videoName,
		post: this.post,
		comments: []
	};
	
	//打开数据库
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);//错误，返回 err 信息
		}
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);//错误，返回 err 信息
			}
			collection.insert(post, {
				safe: true
			}, function(err) {
				mongodb.close();
				if (err) {
					return callback(err);//错误，返回 err 信息
				}
				callback(null);//成功！err 为 null，并返回存储后的用户文档
			});
		});
	});
};

Post.getAll = function(name, productor, classification, day, title, callback) {
	//打开数据库
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		//读取 posts 集合
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if (name) {
				query.name = name;
			}
			if (productor) {
				query.productor = productor;
			}
			if (classification) {
				query.classification = classification;
			}
			if (day) {
				query.day = day;
			}
			if (title) {
				query.title = title;
			}
			//根据 query 对象查询文章
			collection.find(query).sort({
				time: -1
			}).toArray(function(err, docs) {
				mongodb.close();
				if (err) {
					return callback(err);//失败！返回 err
				}
				callback(null, docs);//成功！以数组形式返回查询的结果
			});
		});
	});
};

Post.getOne = function(name, productor, classification, day, title, callback) {
	//打开数据库
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		//读取 posts 集合
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			//根据 query 对象查询文章
			collection.findOne({
				"name" : name, 
				"productor" : productor, 
				"classification" : classification, 
				"time.day": day,
				"title": title
			}, function(err, doc) {
				mongodb.close();
				if (err) {
					return callback(err);//失败！返回 err
				}
				callback(null, doc);
			});
		});
	});
};
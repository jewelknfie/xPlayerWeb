var mongodb = require('./db')
  , markdown = require('markdown').markdown
  , ObjectID = require('mongodb').ObjectID
  , Common = require('../models/common.js');

function Post(name, title, productor, classification, videoName, post) {
	this.name = name;
	this.title = title;
	this.productor = productor;
	this.classification = classification;
	this.videoName = videoName;
	this.post = post;
};

module.exports = Post;

function getTime() {
	return Common.getTime();
}

//存储用户信息
Post.prototype.save = function(callback) {
	
	//要存入数据库的用户文档
	var post = {
		name: this.name,
		time: getTime(),
		updated_time: getTime(),
        sticky_time: null,
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

Post.getTen = function(name, productor, classification, day, title, searchType, keyword, page, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function (err, collection) {
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
            if (keyword) {
                var reg = new RegExp("^.*" + keyword + ".*$", "i");
                if (searchType == 'title') {
                    query.title = reg;
                }
                if (searchType == 'name') {
                    query.name = reg;
                }
            }

            //使用 count 返回特定查询的文档数 total
            collection.count(query, function (err, total) {
                //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
                collection.find(query, {
                    skip: (page - 1)*10,
                    limit: 10
                }).sort({
                    sticky_time:-1,
                    time: -1
                }).toArray(function (err, docs) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    docs.forEach(function (doc) {
                        doc.post = markdown.toHTML(doc.post);
                    });
                    callback(null, docs, total);
                });
            });
        });
    });
};

Post.getOne = function(name, keyId, needMarkdown, callback) {
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
			query._id = new ObjectID(keyId);
			collection.findOne(query, function(err, doc) {
				mongodb.close();
				if (err) {
					return callback(err);//失败！返回 err
				}
				if (doc && needMarkdown) {
					doc.post = markdown.toHTML(doc.post);
                    doc.comments.forEach(function (comment) {
                        comment.content = markdown.toHTML(comment.content);
                    });
				}

				callback(null, doc);
			});
		});
	});
};

//Post.search = function(keyword, callback) {
//    mongodb.open(function (err, db) {
//        if (err) {
//            return callback(err);
//        }
//        db.collection('posts', function (err, collection) {
//            if (err) {
//                mongodb.close();
//                return callback(err);
//            }
//            var pattern = new RegExp("^.*" + keyword + ".*$", "i");
//            collection.find({
//                "title": pattern
//            }, {
//                "productor":1,
//                "classification":1,
//                "name": 1,
//                "time": 1,
//                "title": 1
//            }).sort({
//                time: -1
//            }).toArray(function (err, docs) {
//                mongodb.close();
//                if (err) {
//                    return callback(err);
//                }
//				docs.forEach(function (doc) {
//                        doc.post = markdown.toHTML(doc.post);
//                    });
//                callback(null, docs);
//            });
//        });
//    });
//};

//更新一篇文章及其相关信息
Post.update = function(keyId, post, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //更新文章内容
            collection.update({
                "name": post.name,
                "_id": new ObjectID(keyId)
            }, {
                $set: {
					updated_time: getTime(),
					title: post.title,
					productor: post.productor,
					classification : post.classification,
					videoName: post.videoName,
					post: post.post
				}
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};

Post.sticky = function(name, keyId, isSticky, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //更新文章内容
            collection.update({
                "name": name,
                "_id": new ObjectID(keyId)
            }, {
                $set: {
                    sticky_time: isSticky ? getTime() : null
                }
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};

//删除一篇文章
Post.remove = function(name, keyId, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //删除文档
            collection.remove({
                "name": name,
                "_id": new ObjectID(keyId)
            }, {
                w:1
            } ,function (err) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                mongodb.close();
                callback(null);
            });
        });
    });
};

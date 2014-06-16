var mongodb = require('./db')
    , ObjectID = require('mongodb').ObjectID
    , Common = require('../models/common.js');

function VisitLog(ip, name) {
    this.ip = ip;
    this.name = name;
    this.count = 0;
}

module.exports = VisitLog;

VisitLog.prototype.record = function (callback) {
    var ip = this.ip,
        name = this.name,
        time = Common.getTime();

    console.log(ip + " " + name);

    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            return callback(err);
        }
        //读取 posts 集合
        db.collection('vlogs', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //通过keyid查找文档，并把一条留言对象添加到该文档的 comments 数组里
            collection.update({
                "ip": ip,
                "name": name,
                "time.day": time.day
            }, {
                $inc: {"count": 1}
            }, true, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};
var crypto = require('crypto')
		, User = require('../models/user.js')
		, Post = require('../models/post.js')
		, fs = require('fs')
		, productors = require('../models/productors.js')
		, Comment = require('../models/comment.js');
/*
 * GET home page.
 */

module.exports = function(app) {

	app.get('/', function(req, res) {
		res.redirect("/p/0");
	});

	app.get('/p/:productor', function(req, res) {
		Post.getAll(null, req.params.productor, null, null, null, function(err, posts) {
			if (err) {
				posts = [];
			}
			res.render('detailshow', {
				title: 'show',
				user: req.session.user,
				posts: posts,
				curProductor: req.params.productor,
				curClassification: req.params.classification,
				productorList: productors.productorList(),
				classificationList: productors.classificationList(),
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});
	});

	app.get('/p/:productor/:classification', function(req, res) {
		Post.getAll(null, req.params.productor, req.params.classification, null, null, function(err, posts) {
			if (err) {
				posts = [];
			}
			res.render('detailshow', {
				title: 'show',
				user: req.session.user,
				posts: posts,
				curProductor: req.params.productor,
				curClassification: req.params.classification,
				productorList: productors.productorList(),
				classificationList: productors.classificationList(),
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});
	});

	app.get('/p/:productor/:classification/:username', function(req, res) {
		Post.getAll(req.params.username, req.params.productor, req.params.classification, null, null, function(err, posts) {
			if (err) {
				posts = [];
			}
			res.render('detailshow', {
				title: 'show',
				user: req.session.user,
				posts: posts,
				curProductor: req.params.productor,
				curClassification: req.params.classification,
				productorList: productors.productorList(),
				classificationList: productors.classificationList(),
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});
	});

	app.get('/p/:productor/:classification/:username/:day/:title', function(req, res) {
		Post.getOne(req.params.username, req.params.productor, req.params.classification, req.params.day, req.params.title, function(err, post) {
			if (err) {
				req.flash('error', err);
				return res.redirect("/");
			}
			if (!post) {
				req.flash('error', "The article not found!");
				return res.redirect("/");
			}
			res.render('article', {
				title: req.params.title,
				post: post,
				user: req.session.user,
				curProductor: req.params.productor,
				curClassification: req.params.classification,
				productorList: productors.productorList(),
				classificationList: productors.classificationList(),
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});
	});
	
	app.post('/s', function(req, res) {
		Post.getAll(null, null, null, null, req.body.searchTitle, function(err, posts) {
			if (err) {
				posts = [];
			}
			res.render('detailshow', {
				title: 'show',
				user: req.session.user,
				posts: posts,
				curProductor: req.params.productor,
				curClassification: req.params.classification,
				productorList: productors.productorList(),
				classificationList: productors.classificationList(),
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});
	});

	app.get('/login', checkNotLogin);
	app.get('/login', function(req, res) {
		res.render('login', {
			title: '登陆',
			user: req.session.user,
			curProductor: req.params.productor,
			curClassification: req.params.classification,
			productorList: productors.productorList(),
			classificationList: productors.classificationList(),
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});

	app.post('/login', checkNotLogin);
	app.post('/login', function(req, res) {
		//生成密码的 md5 值
		var md5 = crypto.createHash('md5'),
				password = md5.update(req.body.password).digest('hex');
		//检查用户是否存在
		User.get(req.body.name, function(err, user) {
			if (!user) {
				req.flash('error', '用户不存在!');
				return res.redirect('/login');//用户不存在则跳转到登录页
			}
			//检查密码是否一致
			if (user.password != password) {
				req.flash('error', '密码错误!');
				return res.redirect('/login');//密码错误则跳转到登录页
			}
			//用户名密码都匹配后，将用户信息存入 session
			req.session.user = user;
			req.flash('success', '登陆成功!');
			res.redirect('/');//登陆成功后跳转到主页
		});
	});

	app.get('/reg', checkNotLogin);
	app.get('/reg', function(req, res) {
		res.render('reg', {
			title: '注册',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});

	app.post('/reg', checkNotLogin);
	app.post('/reg', function(req, res) {
		var name = req.body.name,
				password = req.body.password,
				password_re = req.body['password-repeat'];
		//检验用户两次输入的密码是否一致
		if (password_re != password) {
			req.flash('error', '两次输入的密码不一致!');
			return res.redirect('/reg');//返回注册页
		}
		//生成密码的 md5 值
		var md5 = crypto.createHash('md5'),
				password = md5.update(req.body.password).digest('hex');
		var newUser = new User({
			name: name,
			password: password,
			email: req.body.email
		});
		//检查用户名是否已经存在 
		User.get(newUser.name, function(err, user) {
			if (user) {
				req.flash('error', '用户已存在!');
				return res.redirect('/reg');//返回注册页
			}
			//如果不存在则新增用户
			newUser.save(function(err, user) {
				if (err) {
					req.flash('error', err);
					return res.redirect('/reg');//注册失败返回主册页
				}
				req.session.user = user;//用户信息存入 session
				req.flash('success', '注册成功!');
				res.redirect('/');//注册成功后返回主页
			});
		});
	});

	app.get('/post', checkLogin);
	app.get('/post', function(req, res) {
		console.log(productors.videoList());
		res.render('post', {
			title: '发表',
			curProductor: req.params.productor,
			curClassification: req.params.classification,
			productorList: productors.productorList(),
			classificationList: productors.classificationList(),
			videoList: productors.videoList(),
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});

	app.post('/post', checkLogin);
	app.post('/post', function(req, res) {
		console.log(req.session.user.name);
		var currentUser = req.session.user,
				post = new Post(currentUser.name, req.body.title, req.body.productor, req.body.classification, req.body.videoName, req.body.post);
		post.save(function(err) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			req.flash('success', '发布成功!');
			res.redirect('/');//发表成功跳转到主页
		});
	});

	app.get('/upload', checkLogin);
	app.get('/upload', function(req, res) {
		res.render('upload', {
			title: '上传文件',
			user: req.session.user,
			curProductor: req.params.productor,
			curClassification: req.params.classification,
			productorList: productors.productorList(),
			classificationList: productors.classificationList(),
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});

	app.post('/upload', checkLogin);
	app.post('/upload', function(req, res) {
		for (var i in req.files) {
			if (req.files[i].size == 0) {
				// 使用同步方式删除一个文件
				fs.unlinkSync(req.files[i].path);
				console.log('Successfully removed an empty file!');
			} else {
				var target_path = './public/resources/' + req.files[i].name;
				// 使用同步方式重命名一个文件
				fs.renameSync(req.files[i].path, target_path);
				console.log('Successfully renamed a file!');
			}
		}
		req.flash('success', '上传成功!');
		res.redirect('/upload');//发表成功跳转到主页
	});

	app.get('/logout', checkLogin);
	app.get('/logout', function(req, res) {
		req.session.user = null;
		req.flash('success', '登出成功!');
		res.redirect('/');//登出成功后跳转到主页
	});

	function checkLogin(req, res, next) {
		if (!req.session.user) {
			req.flash('error', '未登录!');
			res.redirect('/login');
		}
		next();
	}

	function checkNotLogin(req, res, next) {
		if (req.session.user) {
			req.flash('error', '已登录!');
			res.redirect('back');//返回之前的页面
		}
		next();
	}

}
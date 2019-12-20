var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

router.use(function(req, res, next) {
    if (!req.userInfo.isAdmin) {
        res.send('Sorry, only the administrator can enter the background management!');
        return;
    }
    next();
});

router.get('/user', function(req, res) {

    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    User.count().then(function(count) {
        pages = Math.ceil(count / limit);
        page = Math.min( page, pages );
        page = Math.max( page, 1 );

        var skip = (page - 1) * limit;

        User.find().limit(limit).skip(skip).then(function(users) {
            res.render('admin/user_index', {
                userInfo: req.userInfo,
                users: users,

                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });

    });

});

router.get('/category', function(req, res) {

    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    Category.count().then(function(count) {

        pages = Math.ceil(count / limit);
        page = Math.min( page, pages );
        page = Math.max( page, 1 );
        var skip = (page - 1) * limit;

        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function(categories) {
            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories: categories,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    });
});

router.get('/category/add', function(req, res) {
    res.render('admin/category_add', {
        userInfo: req.userInfo
    });
});

router.post('/category/add', function(req, res) {

    var name = req.body.name || '';

    if (name === '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: 'Name cannot null!'
        });
        return;
    }


    Category.findOne({
        name: name
    }).then(function(rs) {
        if (rs) {

            res.render('admin/error', {
                userInfo: req.userInfo,
                message: 'The classification already exists.'
            });
            return Promise.reject();
        } else {

            return new Category({
                name: name
            }).save();
        }
    }).then(function(newCategory) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: 'Classification save successful.',
            url: '/admin/category'
        });
    })

});

router.get('/category/edit', function(req, res) {

    var id = req.query.id || '';

    Category.findOne({
        _id: id
    }).then(function(category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: 'Classification information error!'
            });
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            });
        }
    })

});

router.get('/', function(req, res, next) {
    res.render('admin/index', {
        userInfo: req.userInfo
    });
});

router.post('/category/edit', function(req, res) {

    var id = req.query.id || '';
    var name = req.body.name || '';

    Category.findOne({
        _id: id
    }).then(function(category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: 'Classification information error!'
            });
            return Promise.reject();
        } else {
            if (name === category.name) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: 'Modify successful!',
                    url: '/admin/category'
                });
                return Promise.reject();
            } else {
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                });
            }
        }
    }).then(function(sameCategory) {
        if (sameCategory) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: 'The same category already exists in the database.'
            });
            return Promise.reject();
        } else {
            return Category.update({
                _id: id
            }, {
                name: name
            });
        }
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: 'Modify',
            url: '/admin/category'
        });
    })

});


router.get('/category/delete', function(req, res) {


    var id = req.query.id || '';

    Category.remove({
        _id: id
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: 'Delete successful.',
            url: '/admin/category'
        });
    });

});


router.get('/content', function(req, res) {

    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    Content.count().then(function(count) {

        pages = Math.ceil(count / limit);
        page = Math.min( page, pages );
        page = Math.max( page, 1 );

        var skip = (page - 1) * limit;

        Content.find().limit(limit).skip(skip).populate(['category', 'user']).sort({
            addTime: -1
        }).then(function(contents) {
            res.render('admin/content_index', {
                userInfo: req.userInfo,
                contents: contents,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });

    });

});

router.get('/content/add', function(req, res) {

    Category.find().sort({_id: -1}).then(function(categories) {
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categories: categories
        })
    });

});


router.post('/content/add', function(req, res) {


    if ( req.body.category === '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: 'Content categories cannot be empty!'
        });
        return;
    }

    if ( req.body.title === '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: 'The content title cannot be empty.'
        });
        return;
    }


    new Content({
        category: req.body.category,
        title: req.body.title,
        user: req.userInfo._id.toString(),
        description: req.body.description,
        content: req.body.content
    }).save().then(function(rs) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: 'Save successful!',
            url: '/admin/content'
        })
    });

});


router.get('/content/edit', function(req, res) {

    var id = req.query.id || '';

    var categories = [];

    Category.find().sort({_id: 1}).then(function(rs) {

        categories = rs;

        return Content.findOne({
            _id: id
        }).populate('category');
    }).then(function(content) {

        if (!content) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: 'The specified content does not exist.'
            });
            return Promise.reject();
        } else {
            res.render('admin/content_edit', {
                userInfo: req.userInfo,
                categories: categories,
                content: content
            })
        }
    });

});


router.post('/content/edit', function(req, res) {
    var id = req.query.id || '';

    if ( req.body.category === '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: 'Content categories cannot be empty.'
        })
        return;
    }

    if ( req.body.title === '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: 'The content title cannot be empty.'
        })
        return;
    }

    Content.update({
        _id: id
    }, {
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: 'Save successful!',
            url: '/admin/content/edit?id=' + id
        })
    });

});


router.get('/content/delete', function(req, res) {
    var id = req.query.id || '';

    Content.remove({
        _id: id
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: 'Delete successful!',
            url: '/admin/content'
        });
    });
});

module.exports = router;
const router = require('express').Router();
const passport = require('passport');
const fs = require('fs');
const mongoose = require('mongoose');
const userModel = mongoose.model('user');
const recordModel = mongoose.model('record');
const moment = require('moment');
const random = require('random');
const _ = require('underscore');
const escapeStringRegexp = require('escape-string-regexp');
const exportToCsv = require('export-to-csv');
const papa = require('papaparse');

function createFilter(req) {
    filter = {
        owner: req.session.passport.user._id
    };

    if (req.query.fromDate || req.query.toDate) {
        filter.date = {};

        if (req.query.fromDate) {
            filter.date.$gte = moment(req.query.fromDate).toDate();
        }

        if (req.query.toDate) {
            filter.date.$lte = moment(req.query.toDate).toDate();
        }
    }


    if (req.query.includingTags || req.query.excludingTags) {
        filter.tags = {};
        if (req.query.includingTags) {
            filter.tags.$all = req.query.includingTags.split(/[ ,]+/)
        }

        if (req.query.excludingTags) {
            filter.tags.$not = {
                $elemMatch: {
                    $in: req.query.excludingTags.split(/[ ,]+/)
                }
            }
        }
    }

    return filter;
}

router.route('/records').get((req, res) => {
    recordModel.find(createFilter(req), function (err, records) {
        if (err)
            return res.status(500).json({ error: err, records: '' });

        return res.status(200).json({ error: '', records: records })
    });
}).post((req, res) => {
    new recordModel({
        value: req.body.value,
        date: moment(req.body.date).toDate(),
        tags: req.body.tags,
        owner: req.session.passport.user._id
    }).save(function (err, record) {
        if (err)
            return res.status(500).json({ error: err });

        return res.status(200).json({ error: '', record: record })
    });
}).put((req, res) => {
    recordModel.findByIdAndUpdate(req.body._id, {
        value: req.body.value,
        date: req.body.date,
        tags: req.body.tags
    }, function (err, record) {
        if (err)
            return res.status(500).json({ error: err });

        return res.status(200).json({ error: '', record: record })
    })
}).delete((req, res) => {
    recordModel.deleteOne(req.body, function (err) {
        if (err)
            return res.status(500).json({ error: err });

        return res.status(200).json({ error: '' })
    });
});

router.route('/csv').get((req, res) => {
    recordModel.find(createFilter(req), "-_id -owner", function (err, records) {
        if (err)
            return res.status(500).json({ error: err, csv: '' });

        return res.status(200).json({
            error: '', csv: papa.unparse(_.map(records, function (doc) {
                return {
                    date: moment(doc.date).toDate(),
                    value: doc.value,
                    tags: doc.tags.join(",")
                };
            }))
        })
    });
}).post((req, res) => {
    let data = papa.parse(req.body.csv, { header: true });

    records = _.map(data.data, function (row) {
        return {
            date: moment(row.date).toDate(),
            value: row.value,
            tags: row.tags.split(","),
            owner: req.session.passport.user._id
        };
    });

    recordModel.insertMany(records, function (error) {
        if (error)
            return res.status(500).json({ error: error });

        return res.status(200).json({ error: "" });
    });
}).put((req, res) => {
    recordModel.remove({ owner: req.session.passport.user._id }, function (err) {
        if (err)
            return res.status(500).json({ error: err, tags: '' });

        let data = papa.parse(req.body.csv, { header: true });

        records = _.map(data.data, function (row) {
            return {
                date: moment(row.date).toDate(),
                value: row.value,
                tags: row.tags.split(","),
                owner: req.session.passport.user._id
            };
        });

        recordModel.insertMany(records, function (error) {
            if (error)
                return res.status(500).json({ error: error });

            return res.status(200).json({ error: "" });
        });
    })
});

router.route('/tags').get((req, res) => {
    recordModel.aggregate([
        {
            $unwind: "$tags"
        },
        {
            $match: {
                tags: {
                    $regex: req.query.tag ? '.*' + escapeStringRegexp(req.query.tag) + '.*' : '.*',
                    $options: 'i'
                }
            }
        },
        {
            $group: {
                _id: null,
                tags: {
                    $addToSet: "$tags"
                }
            }
        },
        {
            $unwind: "$tags"
        },
        {
            $sort: {
                "tags": 1
            }
        }
        , {
            $group: {
                _id: null,
                tags: {
                    $push: "$tags"
                }
            }
        }
    ]).exec(function (err, tags) {
        if (err)
            return res.status(500).json({ error: err, tags: '' });

        if (typeof tags[0] === typeof undefined) {
            return res.status(200).json({ error: '', tags: [] });
        } else {
            return res.status(200).json({ error: '', tags: tags[0].tags });
        }
    });
});

router.route('/randomrecords').get((req, res) => {
    let tags = [
        'szeged',
        'család',
        'iskola',
        'számla',
        'étel',
        'ital',
        'szórakozás',
        'utazás',
        'ak-47'
    ];

    let startDate = moment().subtract(30, 'days').startOf('day');
    let endDate = moment().startOf('day');

    let records = [];

    for (let day = startDate; !endDate.isBefore(day); day.add(1, 'day')) {
        let dailyRecords = random.int(1, 4);
        for (let i = 0; i < dailyRecords; i++) {
            records.push({
                date: day.hour(random.int(0, 23)).minute(random.int(0, 59)).second(random.int(0, 59)).toDate(),
                value: random.int(-30000, 100000),
                tags: _.sample(tags, random.int(0, tags.length)),
                owner: req.session.passport.user._id
            });
        }
    }

    recordModel.insertMany(records, function (error) {
        if (error)
            return res.status(500).json({ error: error });

        return res.status(200).json({ error: "" });
    });
});

module.change_code = 1;
module.exports = router;

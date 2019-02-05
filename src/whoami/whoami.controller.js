'use strict';

const errors = require('../errors');

exports.get = errors.async(function (req, res) {
    const {account_number} = req.user || req.identity;
    const username = req.user ? req.user.username : null;
    res.json({ username, account_number, request_id: req.id }).end();
});

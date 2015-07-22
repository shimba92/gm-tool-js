"use strict";

module.exports = {
    secretKey: 'my-secret-key',
    mongoLabURI: 'mongodb://admin:root@ds055690.mongolab.com:55690/gm-tools-prototype-1',
    mongoLocalURI: 'mongodb://localhost/gm-tool',
    redisURI: '',
    userRole: {
        ADMIN: {strValue: 'admin', intValue: 0},
        SUPER_USER_1: {strValue: 'super-user-1', intValue: 1}
    }
};
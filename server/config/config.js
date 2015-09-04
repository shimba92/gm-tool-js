"use strict";

module.exports = {
    secretKey: 'my-secret-key',
    mongoLabURI: 'mongodb://admin:root@ds055690.mongolab.com:55690/gm-tools-prototype-1',
    mongoLocalURI: 'mongodb://localhost/gm-tool',
    redisURI: '',
    userRole: {
        ADMIN: {strValue: 'admin', intValue: 0},
        SUPER_USER_1: {strValue: 'super-user-1', intValue: 1}
    },
    servers: [
        {name: 'Socket Live', ip: '10.198.48.144:1101'},
        {name: 'Socket Private', ip: '127.0.0.1:1101'}
    ]
};

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
    servers: {
        live: {name: 'Socket Live', host: '49.213.81.39', port: 443},
        private: {name: 'Socket Private', host: '127.0.0.1', port: 1101}
    }
};

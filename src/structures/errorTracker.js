/**
 * Stand-in for the old Sentry (raven) client, which no longer exists.
 * Errors are written to the log instead.
 */
const winston = require('winston');
const log = (e) => winston.error(e && e.stack ? e.stack : e);
module.exports = {
    captureException: log,
    captureError: log,
    captureMessage: log
};

const slugify = require('slugify');
module.exports = (value) => slugify(value || '', { lower: true, strict: true, trim: true });

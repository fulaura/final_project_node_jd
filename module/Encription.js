const bcrypt = require('bcrypt');
const saltRounds = 10;

async function hashPassword(password) {
    password = await bcrypt.hash(password, saltRounds);
    return password;
}
async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

module.exports = { hashPassword, comparePassword};
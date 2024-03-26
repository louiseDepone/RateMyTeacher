const decode = require ("jwt-decode")

function decoding(res){
    return decode.jwtDecode(res.headers.authorization);
}

module.exports = {decoding}
const request = require('request-promise-native');
const CLIENT_SECRET = process.env.CLIENT_SECRET;

module.exports = async function (context, req) {
    const url = 'https://app.vssps.visualstudio.com/oauth2/token';
    const bodyParams = {
        client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        client_assertion: CLIENT_SECRET,
        grant_type: req.body.code
          ? 'urn:ietf:params:oauth:grant-type:jwt-bearer'
          : 'refresh_token',
        assertion: req.body.code || req.body.refreshToken,
        redirect_uri: req.body.redirectUri,
    };

    try {
        const res = await request(url, { method: 'POST', form: bodyParams });

        context.res = {
            status: 200,
            body: res,
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (e) {
        context.res = {
            status: e.statusCode || 500,
            body: e.error || e.message,
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }
};

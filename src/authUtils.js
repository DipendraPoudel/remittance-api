require("dotenv").config();
const path = require("path");
const oauth = require("mastercard-oauth1-signer");

// Load MCAPI auth keys
const loadKeys = () => {
  const forge = require("node-forge");
  const fs = require("fs");
  const p12Content = fs.readFileSync(
    path.join(__dirname, process.env.MCAPI_KEY),
    "binary"
  );
  const p12Asn1 = forge.asn1.fromDer(p12Content, false);
  const p12 = forge.pkcs12.pkcs12FromAsn1(
    p12Asn1,
    false,
    process.env.MCAPI_KEY_PASSWORD
  );
  const keyObj = p12.getBags({
    friendlyName: process.env.MCAPI_KEY_ALIAS,
    bagType: forge.pki.oids.pkcs8ShroudedKeyBag,
  }).friendlyName[0];
  return {
    signingKey: forge.pki.privateKeyToPem(keyObj.key),
    consumerKey: process.env.MCAPI_CONSUMER_KEY,
  };
};
// Add oauth1a signing to OpenAPI client
const applyAuth = (clientInstance) => {
  const { signingKey, consumerKey } = loadKeys();

  clientInstance.applyAuthToRequest = function (request) {
    const _end = request._end;
    request._end = function () {
      const authHeader = oauth.getAuthorizationString(
        request.url,
        request.method,
        request._data,
        consumerKey,
        signingKey
      );
      request.req.setHeader("Authorization", authHeader);
      _end.call(request);
    };
    return request;
  };
};

module.exports = { applyAuth };

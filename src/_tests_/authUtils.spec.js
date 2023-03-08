const authUtils = require("../authUtils");

beforeAll(() => {
  process.env.MCAPI_KEY = "../../remittance-api/remittanceapp-sandbox.p12";
  process.env.MCAPI_KEY_ALIAS = "keyalias";
  process.env.MCAPI_KEY_PASSWORD = "keystorepassword";
  process.env.MCAPI_CONSUMER_KEY =
    "3A8yOPxdsS02xub_Jq7N5c_ExqUNDF1vGyqyEVI2c038c47d!62ff7ffca0854128b6317e70e0ff57e00000000000000000";
});

test("setup mastercard authentication to api client", () => {
  const clientInstance = {};
  authUtils.applyAuth(clientInstance);
  expect(clientInstance).toHaveProperty("applyAuthToRequest");
});

test("apply mastercard authentication in api client", () => {
  const clientInstance = {};
  authUtils.applyAuth(clientInstance);
  const header = {};
  const request = {
    url: "https://test-url.co.nz",
    method: "POST",
    _data: "[]",
    req: {
      setHeader: (headerKey, headerValue) => (header[headerKey] = headerValue),
    },
    _end: { call: (request) => console.log("Request ", request) },
  };
  clientInstance.applyAuthToRequest(request);
  expect(request).toHaveProperty("_end");
  request._end();
  expect(header).toHaveProperty("Authorization");
});

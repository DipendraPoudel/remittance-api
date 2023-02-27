module.exports = (clientInstance) => {
  const quotesApi = require("remittance-api-client/dist/api/QuotesApi");
  const quotesApiService = new quotesApi();

  const createQuote = (req, res) => {
    const quote = req.body;
    console.log("Creating Quote ", quote);
    quotesApiService.addQuote(
      {
        quoteCreateRequest: JSON.stringify(quote),
      },
      (err, data, resp) => {
        if (err) {
          console.log("***** error *****\n", err);
          return res.status(500).send({ err });
        }
        if (data) {
          return res.status(201).send(data);
        }
        console.log("***** response *****\n", resp);
        return res.status(500).send({ resp });
      }
    );
  };

  const getQuotes = (req, res) => {
    const { partnerId, limit, offset } = req.query;
    console.log("Retrieve quotes for partner", partnerId);
    contractsApiService.getContracts(
      partnerId,
      { limit, offset },
      (err, data, resp) => {
        if (err) {
          console.log("***** error *****\n", err);
          return res.send({ err });
        }
        if (data) {
          return res.send(data);
        } else {
          console.log("***** response *****\n", resp);
          return res.send({ resp });
        }
      }
    );
  };

  return {
    createQuote,
    getQuotes,
  };
};

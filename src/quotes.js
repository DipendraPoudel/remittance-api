module.exports = (clientInstance) => {
  const crossborder = require("crossborder/dist/index");
  const quotesApiService = new crossborder.QuotesApi(clientInstance);

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
        else(data) 
          return res.status(201).send(data);
        
      }
    );
  };

  const getQuotes = (req, res) => {
    const { partnerId, limit, offset } = req.query;
    console.log("Retrieve quotes for partner", partnerId);
    quotesApiService.getQuotes(
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

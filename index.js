const fs = require("fs");
const Airtable = require("airtable");
const fastcsv = require("fast-csv");
require("dotenv").config();

// constants
const TABLE_NAME = "Table 1";
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

async function readOpenVC() {
  let count = 0;
  let csvData = [];
  let stream = fs.createReadStream("openvc.csv");
  let csvStream = fastcsv
    .parse()
    .on("data", function (data) {
      let countries = data[3];
      let minInvestment = data[7];
      let maxInvestment = data[8];
      let stages = data[4];

      // filtering
      // if (!countries.includes("USA")) {
      //   return;
      // }

      let minDesiredInvestment = Number(
        minInvestment.replace(/[^0-9.-]+/g, "")
      );
      let maxDesiredInvestment = Number(
        maxInvestment.replace(/[^0-9.-]+/g, "")
      );

      if (stages.includes("Early Revenue") || stages.includes("Prototype")) {
        csvData.push({
          fields: {
            Name: data[0],
            URL: data[1],
            address: data[2],
            countries: data[3],
            stages: data[4],
            description: data[5],
            entity: data[6],
            "minimum investment": minDesiredInvestment,
            "maximum investment": maxDesiredInvestment,
            LinkedIn: data[9],
          },
        });
        count++;
      }

      // Airtable allows batching 10 items per request
      if (count === 10) {
        sendToAirtable(csvData);
        count = 0;
        csvData = [];
      }
    })
    .on("end", function () {
      console.log("Finished processing data");
      csvData = [];
    });
  stream.pipe(csvStream);
}

async function readGritt() {
  let count = 0;
  let csvData = [];
  let stream = fs.createReadStream("gritt_extract.csv");

  let angelsStream = fastcsv
    .parse()
    .on("data", (data) => {
      csvData.push({
        fields: {
          Name: `${data[0]} ${data[1]}`,
          URL: data[4],
          address: "",
          countries: data[3],
          stages: "",
          description: data[2],
          entity: "Angel",
          "minimum investment": 0,
          "maximum investment": 0,
          LinkedIn: data[9],
        },
      });

      count++;

      // Airtable allows batching 10 items per request
      if (count === 10) {
        sendToAirtable(csvData);
        count = 0;
        csvData = [];
      }
    })
    .on("end", function () {
      console.log("Finished processing data");
    });

  stream.pipe(angelsStream);
}

function sendToAirtable(data) {
  base(TABLE_NAME).create(data, (err, record) => {
    if (err) {
      console.error("FUCK", err);
    }
  });
}

const main = async () => {
  await readOpenVC();
  await readGritt();
};

main();

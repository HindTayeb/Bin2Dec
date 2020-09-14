const express = require('express');
const app = express();

// const bin2dec = require('./bin2dec');
const querystring = require("querystring");
const fs = require('fs');
const {
    check,
    validationResult
} = require('express-validator');


// Hostname and port
const hostname = "127.0.0.1";
const port = process.env.PORT || 8080;

// Directory of static files
app.use(express.static(__dirname + '/public'));

app.use(express.json());

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    // Capture the contents of index.html in a variable
    let fileContents = fs.readFileSync("./index.html", {
        encoding: "utf8"
    });
    // Send a response to the client with the index.html file
    res.write(fileContents);
    res.end();
});

app.post('/',
    // [check('binaryInput')
    // .matches("[01]+")
    // .withMessage('Must be only 0s or 1s')
    // .isLength({
    //     max: 8
    // })
    // .withMessage('Must be at maximum 8 digits')
    // ],
    (req, res) => {
        req.on("data", function (inputValue) {
            let query = inputValue.toString();
            let binaryInput = querystring.parse(query).binaryInput;
            let fileContents = fs.readFileSync("./index.html", {
                encoding: "utf8"
            });
            if (binaryInput.length > 8) {
                fileContents = fileContents.replace("<div class='alert alert-danger' role='alert' hidden>danger alert</div>",
                    "<div class='alert alert-danger' role='alert'>Please enter value less than 8 digits</div>");
                res.setHeader('Content-Type', 'text/html');
                res.write(fileContents);
                res.end();
            } else if (!binaryInput.match(/^[0-1]{1,}$/g)) {
                fileContents = fileContents.replace("<div class='alert alert-danger' role='alert' hidden>danger alert</div>",
                    "<div class='alert alert-danger' role='alert'>Please enter a value of 0s and 1s only</div>");
                res.setHeader('Content-Type', 'text/html');
                res.write(fileContents);
                res.end();
            } else {
                let decimalNum = parseInt(String(binaryInput), 2);

                fileContents = fileContents.replace("<input type='number' class='form-control' id='decimalOutput' readonly>",

                    "<input type='number' class='form-control' id='decimalOutput' value=" + decimalNum + " readonly>");
                res.setHeader('Content-Type', 'text/html');
                res.write(fileContents);
                res.end();
            }

        });

    });

app.listen(port, () => {
    // Display server location information to the console
    console.log(`Server is listening at http://${hostname}:${port}/`);
});
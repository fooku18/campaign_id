var csv = require("csv"),
    fs = require("fs"),
    parser = csv.parse({delimiter:",",escape:'"',from:2}),
    transform = csv.transform(function(data) {
        return [data[0].substr(0,10).replace(/\./g,"/"),data[1] + ":" + data[2],data[3]]
    }),
    stringify = csv.stringify({delimiter:"\t"}),
    res = "";
parser.on("readable",function() {
    while(data = parser.read()) {
        transform.write(data);
    }
})
transform.on("readable",function() {
    while(data = transform.read()) {
        stringify.write(data);
    }
})
stringify.on("readable",function() {
    //res += stringify.read();
    ws.write(stringify.read());
})
parser.on("finish",function() {
    ws.close();
})
var rs = fs.createReadStream("/home/jakob/node/test.csv"),
    ws = fs.createWriteStream("/home/jakob/node/output.csv");
rs.pipe(parser);
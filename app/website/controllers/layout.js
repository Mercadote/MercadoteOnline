var LayoutView = require('../views/layout'),
    LayoutModel = require('../models/dataAccess'),
    moment = require('moment');
var path = require('path');

var Layout = function(conf) {
    this.conf = conf || {};

    this.view = new LayoutView();
    this.model = new LayoutModel({ parameters: this.conf.parameters });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }
}




Layout.prototype.get_viewpdf = function(req, res, next) {
    var fs = require('fs');
    var filename = req.query.fileName;
    var filePath = path.dirname(require.main.filename) + "\\pdf\\" + filename + ".pdf";

    fs.readFile(filePath, function(err, file) {
        res.writeHead(200, { "Content-Type": "application/pdf" });
        res.write(file, "binary");
        res.end();
        fs.unlinkSync(filePath);
    });


}

Layout.prototype.post_newpdf = function(req, res, next) {

  

    var http = require('http'),
        fs = require('fs');
    var filename = guid();
    var filePath = path.dirname(require.main.filename) + "\\pdf\\" + filename + ".pdf";


    var options = {
        "method": "POST",
        "hostname": "189.204.141.193",
        "port": "5488",
        "path": "/api/report",
        "headers": {
            "content-type": "application/json"
        }
    };

    var request = http.request(options, function(response) {
        var chunks = [];

        response.on("data", function(chunk) {
            chunks.push(chunk);
        });

        response.on("end", function() {
            var body = Buffer.concat(chunks);

            fs.writeFile(filePath, body, function(err) {
                if (err) return console.log(err);
                console.log('Archivo creado');
            });

        });
    });


    request.write(JSON.stringify(req.body.values));
    request.end();

    var self = this;

    self.view.expositor(res, {
        error: null,
        result: filename
    });


};




function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '_' + s4() + '_' + s4() + '_' +
        s4() + '_' + s4() + s4() + s4();
};




module.exports = Layout;

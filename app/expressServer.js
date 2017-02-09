var env = process.env.NODE_ENV || 'production',
express = require('express'),
swig = require('swig'),
bodyParser = require('body-parser'),
middlewares = require('./middlewares/admin'),
router = require('./website/router');




    //Alta de opciones
    var done=false;

    var ExpressServer = function(config){
      this.config = config || {};

      this.expressServer = express();

      this.expressServer.use(allowCrossDomain);

    // middlewares
    this.expressServer.use(bodyParser.urlencoded({extended: true}))
    this.expressServer.use(bodyParser.json());
    for (var middleware in middlewares){
      this.expressServer.use(middlewares[middleware]);
    }

    this.expressServer.engine('html', swig.renderFile);
    this.expressServer.set('view engine', 'html');
    this.expressServer.set('views', __dirname + '/website/views/templates');
    swig.setDefaults({varControls:['[[',']]']});

    //////////////////////////////////////////////////////////////

    if(env == 'development'){
      console.log('OK NO HAY CACHE');
      this.expressServer.set('view cache', false);
      swig.setDefaults({cache: false, varControls:['[[',']]']});
    }

    //Inicia los APIs
    for (var controller in router){
      for (var funcionalidad in router[controller].prototype){
        var method = funcionalidad.split('_')[0];
        var entorno = funcionalidad.split('_')[1];
        var data = funcionalidad.split('_')[2];
        data = (method == 'get' && data !== undefined) ? ':data' : '';
        var url = '/api/' + controller + '/' + entorno + '/' + data;
        this.router(controller,funcionalidad,method,url);
      }
    } 


    //Servimos el archivo angular
    this.expressServer.get('*', function(req, res){
      res.sendfile('app/static/index.html');
    });
    
  };





var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};





  ExpressServer.prototype.router = function(controller,funcionalidad,method,url){
    console.log(url);
    var parameters = this.config.parameters;

    this.expressServer[method](url, function(req,res,next){
      
     var conf = {
       'funcionalidad':funcionalidad,
       'req': req,
       'res': res,
       'next': next,
       'parameters' : parameters
     }

     var Controller = new router[controller](conf);
     Controller.response();
     
   });
  }
  module.exports = ExpressServer;


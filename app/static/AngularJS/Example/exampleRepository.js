var referenceURL = global_settings.urlCORS + 'api/layout/';


registrationModule.factory('exampleRepository', function($http) {
    return {
        getViewpdf: function(fileName) {
            return $http({
                url: referenceURL + 'viewpdf/',
                method: "GET",
                params: { fileName: fileName },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        createPdf: function(jsonData) {            
            return $http({
                url: referenceURL + 'newpdf/',
                method: "POST",
                data: { values: jsonData },
                headers: { 'Content-Type': 'application/json'}

            });
        },
        callExternalPdf: function(jsonData) {
            console.log('Llamada externa');
            return $http({
                url: 'http://189.204.141.193:5488/api/report/',
                method: "POST",
                data: jsonData ,
                headers: { 'Content-Type': 'application/json' }

            });
        }


    };

});

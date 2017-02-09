registrationModule.controller('exampleController', function($scope, alertFactory, exampleRepository) {
    //this is the first method executed in the view
    $scope.init = function() {

    };



    $scope.createPdf = function() {



        var jsonData = {
            "template": { "name": "prueba" },
            "data": {
                "books": [
                    { "name": "Lulu", "author": "Charles Dickens", "sales": 351 },
                    { "name": "Alex", "author": "J. R. R. Tolkien", "sales": 125 },
                    { "name": "Gibran", "author": "Dan Brown", "sales": 255 },
                    { "name": "hector", "author": "J. R. R. Tolkien", "sales": 99 }
                ]
            }
        }

        exampleRepository.createPdf(jsonData).then(function(result) {  
            
        
                        setTimeout(function() {
                            window.open("http://192.168.20.9:5000/api/layout/viewpdf?fileName=" + result.data);
                        }, 5000);

        });

    }



});

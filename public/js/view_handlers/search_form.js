(function($, WIMR){
  
  WIMR.dialog.registerTemplateCallback('search_form', function($el) {
    
    var $form = $el.find('form');
    
    $form.submit(function(e){
      e.preventDefault();
      WIMR.dialog.loading();
      
      var address = $form.find('#inputAddress').val();
      
      if ( address === "") {
        WIMR.dialog.showTemplate('search_form');
        $('#addressField').addClass('has-error');
        
      } else {
        var url = "/geocode.json?address=" + address;
      
      
        /**
         * GET /geocode.json, which is a proxy to the Google
         * Maps API for getting lat/longs of an address
         */
        $.get(url)
          .done(function (response){
            // Google returns a single result
            if (response.length == 1){
              var address = response[0]
                , latitude = address.geometry.location.lat
                , longitude = address.geometry.location.lng
                , viewVars = { formattedAddress: WIMR.shortAddress(address) }
                ;
              /**
               * Have lat/long, querying our database for existing reports
               **/
              $.get('/locations.json?latitude=' + latitude + '&longitude=' + longitude)
                .done(function(response){
                  if(response.locations && response.locations.length >= 1){
                    WIMR.dialog.renderExistingResult(response.locations[0], viewVars);
                  } else {
                    WIMR.dialog.renderNewResult(latitude, longitude, viewVars);
                  }
                })
                .fail(function(response){
                  console.log("Errored while looking for an existing location");
                  WIMR.dialog.loading('clear');
              })
              
            // google returns multiple results or no results at all
            } else {
              var viewVars = {};
              viewVars.possibleAddresses = response || [];
              viewVars.buildingsFoundMessage = response.length + " buildings found" ;
              viewVars.possibleAddresses.forEach(function(obj){
                obj.short_address = WIMR.shortAddress(obj);
              })
              WIMR.dialog.showTemplate('search_results', viewVars);
            }

          })
          .fail(function (response){
            WIMR.dialog.showTemplate('search_form');
            $('#addressField').addClass('has-error');
            alert("Sorry, either the address was incorrect or doesn't exist.")
          });
    
      }
    });

  });

})(jQuery, WIMR);
$( document ).ready(function() {
	$( "#ordersForm" ).on( "submit", function( event ) {
	  var outletVar = $(".outlet-select").find(":selected").val();
	  
	  if ( outletVar == "" || typeof outletVar == "undefined" ) {
		alert("Please input outlet");
		$(".outlet-select").focus();
		event.preventDefault();		  
	  }
	});
	
	$(".outlet-select").on("change", function( event ) {
	  if ( $(this).val() == "Amoy" ) {
		  $("#RWS_Accordion").hide();
		  $("#Amoy_Accordion").show();
		  
		  $('#RWS_Accordion').find('input[type=number]').val('');
	  } else if ( $(this).val() == "RWS" ) {
		  $("#RWS_Accordion").show();
		  $("#Amoy_Accordion").hide();
		  
		  $('#Amoy_Accordion').find('input[type=number]').val('');
		  // $('#flush-collapseSixAmoy').collapse();
	  }
	});
	
});
$( document ).ready(function() {
    console.log( "ready!" );
	$( "#ordersForm" ).on( "submit", function( event ) {
	  var outletVar = $(".outlet-select").find(":selected").val();
	  
	  if ( outletVar == "" || typeof outletVar == "undefined" ) {
		alert("Please input outlet");
		$(".outlet-select").focus();
		event.preventDefault();		  
	  }
	});
	
});
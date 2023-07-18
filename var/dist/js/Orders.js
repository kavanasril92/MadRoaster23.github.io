$( document ).ready(function() {
	$( "#ordersForm" ).on( "submit", function( event ) {
	  var outletVar = $(".outlet-select").find(":selected").val();
	  
	  if ( outletVar == "" || typeof outletVar == "undefined" ) {
			alert("Please input outlet");
			$(".outlet-select").focus();
			event.preventDefault();		  
	  }
	});
	
	var d = new Date(new Date().getTime()+(24*60*60*1000));

	var time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
	var date = d.getDate();
	var month = d.getMonth();
	var year = d.getFullYear();
	var monthArray = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var tomorrowsDate = date + " " + monthArray[month] + " " + year;
	
	$("#Tomorrows-Date").text("Order for " + date + " " + monthArray[month] + " " + year);
	
	$(".outlet-select").on("change", function( event ) {
	  if ( $(this).val() == "Amoy" ) {
		  $("#RWS_Accordion").hide();
		  $("#Amoy_Accordion").show();
		  
		  $('#RWS_Accordion').find('input[type=number]').val('');
	  } else if ( $(this).val() == "RWS" ) {
		  $("#Amoy_Accordion").hide();
		  $("#RWS_Accordion").show();
		  
		  $('#Amoy_Accordion').find('input[type=number]').val('');
		  // $('#flush-collapseSixAmoy').collapse();
	  }
	});
	
	$( "#daily-small-orders-outlined" ).on( "click", function( event ) {
		$("#Outlet-Section").delay(100).fadeIn();
		$("#Whole-Form").delay(100).fadeIn();
		$("#Others-Section").delay(100).fadeIn();
		$("#Submit-Form-Button").delay(100).fadeIn();
		
		$("#Big-Order-Section").delay(100).fadeOut();
		$("#Big-Order-Section").find('input[type=number]').val('');
	});
	
	$( "#big-orders-outlined" ).on( "click", function( event ) {
		$("#Outlet-Section").delay(100).fadeIn();
		$("#Whole-Form").delay(100).fadeIn();
		$("#Big-Order-Section").delay(100).fadeIn();
		$("#Others-Section").delay(100).fadeIn();
		$("#Submit-Form-Button").delay(100).fadeIn();
	});
	
});
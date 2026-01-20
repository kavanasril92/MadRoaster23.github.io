// Modified by KL for 20260117
var current_date;
var current_time;
var add_date;
var d;
var yyyy;
var mm;
var dd;

$( document ).ready(function() {
	$( "#ordersForm" ).on( "submit", function( event ) {
	  var outletVar = $(".outlet-select").find(":selected").val();
	  
	  if ( outletVar == "" || typeof outletVar == "undefined" ) {
			alert("Please input outlet");
			$(".outlet-select").focus();
			event.preventDefault();		  
	  } 
		// Modified by KL on 20260120
		else {
			$.ajax({
				url: this.action,
				method: this.method || 'POST',
				data: $(this).serialize()
			}).always(function(){
				window.location.href = 'complete.html';
			});
		}
	});
	
	// Modified by KL 20251227 - Update to 2 days later for inventory
	// Modified by KL for 20260117
	current_date = new Date(new Date().getTime());
	current_time = current_date.getHours();
	add_date = 2;
	if ( current_time >= 16 ) {
		add_date = 3;
	}

	d = new Date(new Date().getTime()+(24*60*60*1000*add_date));
	

	var time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
	var date = d.getDate();
	var month = d.getMonth();
	var year = d.getFullYear();
	var monthArray = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var tomorrowsDate = date + " " + monthArray[month] + " " + year;

	// Modified by KL 20251227 - Update to 2 days later for inventory
	var dayArray = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
	$("#Tomorrows-Date").text("Order for " + date + " " + monthArray[month] + " " + year + " (" + dayArray[d.getDay()] +")");
	
	$(".outlet-select").on("change", function( event ) {
	  // Modified by KL for 20231212 - Added Courtyard
	  // Commented by KL 20251227
	  /*
	  if ( $(this).val() == "Amoy" ) {
		  $("#RWS_Accordion").hide();
		  $("#Amoy_Accordion").show();
		  
		  $('#RWS_Accordion').find('input[type=number]').val('');
	  } 
		
		
		else if ( $(this).val() == "RWS" || $(this).val() == "Courtyard" ) {
		  $("#Amoy_Accordion").hide();
		  $("#RWS_Accordion").show();
			
			// Modified by KL for 20231212 - show Toasted Cereal when non-RWS is selected
			if ( $(this).val() == "RWS" ) {
				var $ToastedCerealLabelVar = $('label:contains("Toasted Cereal")');
				$ToastedCerealLabelVar.show();
				var $ToastedCerealInputVar = $ToastedCerealLabelVar.nextAll("input:first");
				$ToastedCerealInputVar.show();
			} else {
				var $ToastedCerealLabelVar = $('label:contains("Toasted Cereal")');
				$ToastedCerealLabelVar.hide();
				var $ToastedCerealInputVar = $ToastedCerealLabelVar.nextAll("input:first");
				$ToastedCerealInputVar.hide();
				$ToastedCerealInputVar.val('');
			}
		  
		  $('#Amoy_Accordion').find('input[type=number]').val('');
		  // $('#flush-collapseSixAmoy').collapse();
	  }
		*/
	  // Added by KL 20251227
		var outlet_selection = $(this).val();
	  $("." + outlet_selection + "-ONLY-DIV").delay(100).fadeIn();
		$("." + outlet_selection + "-ONLY").delay(100).fadeIn();
	  $('.outlet-select option').each(function (index) {
			var outlet = $(this).val();
			if ( outlet != outlet_selection && outlet != "" ) {
				$("." + outlet + "-ONLY-DIV:not(." + outlet_selection + "-ONLY-DIV)").each(function(index) {
					$(this).find('input').val('');
					$(this).delay(100).fadeOut();
				});

				$("." + outlet + "-ONLY:not(." + outlet_selection + "-ONLY)").each(function(index) {
					$(this).find('input').val('');
					$(this).find(".accordion-collapse").collapse('hide');
					$(this).delay(100).fadeOut();
				});

				// if ( !$("." + outlet + "-ONLY:visible").hasClass(outlet_selection + "-ONLY") ){
				// 	$("." + outlet + "-ONLY:visible").find('input').val('');
				// 	$("." + outlet + "-ONLY:visible").find(".accordion-collapse").collapse('hide');
				// 	$("." + outlet + "-ONLY:visible").delay(100).fadeOut();
				// }
			}
		});
	});
	
	// Updated by KL on 20231212 - Changed from Small Orders to Start Order 
	$( "#start-order-outlined" ).on( "click", function( event ) {
		$("#Outlet-Section").delay(100).fadeIn();
		$("#Whole-Form").delay(100).fadeIn();
		// Updated by KL on 20231212 - Changed from Small Orders to Start Order 
		$("#Big-Order-Section").delay(100).fadeIn();
		$("#Others-Section").delay(100).fadeIn();
		$("#Submit-Form-Button").delay(100).fadeIn();
		
		// Updated by KL on 20231212 - Changed from Small Orders to Start Order 
		// $("#Big-Order-Section").delay(100).fadeOut();
		// $("#Big-Order-Section").find('input[type=number]').val('');
	});
	
	$( "#big-orders-outlined" ).on( "click", function( event ) {
		$("#Outlet-Section").delay(100).fadeIn();
		$("#Whole-Form").delay(100).fadeIn();
		$("#Big-Order-Section").delay(100).fadeIn();
		$("#Others-Section").delay(100).fadeIn();
		$("#Submit-Form-Button").delay(100).fadeIn();
	});
	
	const generateRandomString = (length) => {
		const characters =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		let result = '';

		// Create an array of 32-bit unsigned integers
		const randomValues = new Uint32Array(length);
		
		// Generate random values
		window.crypto.getRandomValues(randomValues);
		randomValues.forEach((value) => {
			result += characters.charAt(value % charactersLength);
		});
		return result;
	}
	
	$("#Unique-Identifier-Section").find('input').val(getCurrentUnixTimestamp() + generateRandomString(22));

	// Added by KL 20251227 - Update Date for Copyright ID
	$( "#copyright_date_id" ).text(year);

	// Added by KL 20251227
	// Commented by KL on 20260120
	/*
	$('#ordersForm').on('submit', function (e) {
		e.preventDefault(); // stop page reload

		$.ajax({
			url: this.action,
			method: this.method || 'POST',
			data: $(this).serialize()
		}).always(function(){
			window.location.href = 'complete.html';
		});
	});
	*/

	// Modified by KL for 20260117
	dd = String(d.getDate()).padStart(2, '0');
	mm = String(d.getMonth() + 1).padStart(2, '0'); // January is 0
	yyyy = d.getFullYear();
	// Commented by KL for 20260117
	// $("#Order-Date-Section").find('input').val(dd + "-" + mm + "-" + yyyy);

	// Added by KL for 20260117
	// Initialize values for Calendar
	// 1. When load form on Day 0 < 1600, will be for Day 2
	// 2. When load form on Day 0 >= 1600, will be for Day 3
	// Initialize Calendar
	initializeCalendar('calendar_input', d);

	$('#calendar_input').on('startDateChange.coreui.calendar', function (e) {
		const d = e.date;
		const formatted =
			String(d.getDate()).padStart(2, '0') + '-' +
			String(d.getMonth() + 1).padStart(2, '0') + '-' +
			d.getFullYear()
			
		$("#Order-Date-Section").find('input').val(formatted);

		const selectedDay = d.getDay();
		const selectedDate = d.getDate();
		const selectedMonth = d.getMonth();
		const selectedYear = d.getFullYear();

		$("#Tomorrows-Date").text("Order for " + selectedDate + " " + monthArray[selectedMonth] + " " + selectedYear + " (" + dayArray[selectedDay] +")");

		var newDate = new Date(selectedYear, selectedMonth, selectedDate);

		$('#calendar_input').find('[data-coreui-date="' + newDate + '"]').trigger('click');

	})

	if ( $('#calendar_input') ) {
		// On Load of Calendar, fill up value of Order Date in hidden cell
		const $selected = $('#calendar_input .calendar-cell.selected');
		if ( $selected[0] ) {
			const initial_date_value = $selected[0].dataset.coreuiDate;
			const initial_date_value_obj = new Date(initial_date_value);

			var initial_date_value_obj_dd = String(initial_date_value_obj.getDate()).padStart(2, '0');
			var initial_date_value_obj_mm = String(initial_date_value_obj.getMonth() + 1).padStart(2, '0'); // January is 0
			var initial_date_value_obj_yyyy = initial_date_value_obj.getFullYear();
			var initial_date_value_obj_fulldate = initial_date_value_obj_dd + "-" + initial_date_value_obj_mm + "-" + initial_date_value_obj_yyyy;

			$("#Order-Date-Section").find('input').val(initial_date_value_obj_fulldate);
		}	
	}
	
	
	// Added by KL for 20260120
	$.getJSON("./Custom/CustomConfig.json", function (data) {
		const CLIENT_ID = data['GoogleCloud-SheetsClientID'];
		const API_KEY = data['GoogleCloud-SheetsAPIKey'];
		const SheetID = data['GoogleCloud-SheetID'];
		const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

		initClient(CLIENT_ID, API_KEY, SCOPES);
		var tokenClient = initGIS(CLIENT_ID, SCOPES, SheetID);
		tokenClient.requestAccessToken();
	});
	
	/*
	initClient(CLIENT_ID, API_KEY, SCOPES);
	var tokenClient = initGIS(CLIENT_ID, SCOPES);
	tokenClient.requestAccessToken();

	
	$.getJSON("./Custom/CustomConfig.json", function (data) {
		const CLIENT_ID = data['GoogleCloud-SheetsClientID'];
		const API_KEY = data['GoogleCloud-SheetsAPIKey'];
		const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

		initClient(CLIENT_ID, API_KEY);

	});
	*/

	// signIn();

});

function initializeCalendar (calendarName, dateVar) {
	var newdd = String(dateVar.getDate()).padStart(2, '0');
	var newmm = String(dateVar.getMonth() + 1).padStart(2, '0');
	var newyyyy = dateVar.getFullYear();
	const myCalendarDisabledDates = document.getElementById(calendarName);

	// Restrict submission after 7AM to next day onwards
	var todaydate = new Date(Date.now());
	var todaydate_hours = todaydate.getHours();
	var min_date = todaydate;
	var mindate_dd = String(todaydate.getDate()).padStart(2, '0');
	var mindate_month = String(todaydate.getMonth() + 1).padStart(2, '0');
	var mindate_yyyy = todaydate.getFullYear();
	// Only allow submission of today's form for submissions before 7AM same day
	if ( todaydate_hours >= 7 ) {
		var newDate = new Date (todaydate.getTime()+(24*60*60*1000*1));
		min_date = newDate;
		mindate_dd = String(newDate.getDate()).padStart(2, '0');
		mindate_month = String(newDate.getMonth() + 1).padStart(2, '0');
		mindate_yyyy = newDate.getFullYear();
	}

	const optionsCalendarDisabledDates = {
		startDate: new Date(newyyyy + "-" + newmm-1 + "-" + newdd),
		calendars: 1,
		// calendarDate: '2026/01/23	',
		/*
		disabledDates: [
			[new Date(2022, 2, 4), new Date(2022, 2, 7)],
			new Date(2022, 2, 16),
			new Date(2022, 3, 16),
			[new Date(2022, 4, 2), new Date(2022, 4, 8)]
		],
		*/
		locale: 'en-SG',
		//maxDate: new Date(2022, 5, 0),
		minDate: new Date(mindate_yyyy, mindate_month-1, mindate_dd),
		firstDayOfWeek: 1
	}

	new coreui.Calendar(myCalendarDisabledDates, optionsCalendarDisabledDates);

	var dateq = new Date('2026','0','30');

	const selectedDay = dateVar.getDay();
		const selectedDate = dateVar.getDate();
		const selectedMonth = dateVar.getMonth();
		const selectedYear = dateVar.getFullYear();
		var newDate = new Date(selectedYear, selectedMonth, selectedDate);

		$('#calendar_input').find('[data-coreui-date="' + newDate + '"]').trigger('click');
}

function getCurrentUnixTimestamp() {
  return Math.floor(Date.now() / 1000);
}

// Added by KL for 20260120
function googleSheetAction(action) {
	$.getJSON("./Custom/CustomConfig.json", function (data) {
		const CLIENT_ID = data['GoogleCloud-SheetsClientID'];
		const API_KEY = data['GoogleCloud-SheetsAPIKey'];
		const SheetID = data['GoogleCloud-SheetID'];
		const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

		initClient(CLIENT_ID, API_KEY, SCOPES);
		var tokenClient = initGIS(CLIENT_ID, SCOPES, SheetID);
		tokenClient.requestAccessToken();
	});
}

function initClient(CLIENT_ID, API_KEY, SCOPES) {
	gapi.load('client', async () => {
		await gapi.client.init({
			apiKey: API_KEY,
			discoveryDocs: [
				'https://sheets.googleapis.com/$discovery/rest?version=v4'
			],
		})
	});
}

function initGIS(CLIENT_ID, SCOPES, SheetID) {
  var tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (tokenResponse) => {
			// console.log(tokenResponse);
			if (tokenResponse.error) {
				console.error('Auth error:', tokenResponse);

				alert('Authentication failed. Please try again.');
				return;
			} 
			gapi.client.setToken(tokenResponse);
			//console.log(tokenClient);
			loadSheet(SheetID); // call API after auth

    },
		// On close of popup
		error_callback: (errorResp) => {
			console.log(errorResp.message);

			if ( errorResp.message == "Popup window closed") {
				// To reload the button that retrieves Google Sheet Data
			}

    },
  });
	return tokenClient;
}

async function loadSheet(SheetID) {
	try {
		const response = await gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: SheetID,
			range: 'Order Database!A1:Z'
		});

		const [headers, ...rows] = response.result.values;

		const data = rows.map(row =>
			headers.reduce((obj, h, i) => {
				obj[h] = row[i] || '';
				return obj;
			}, {})
		);

		console.log(data);

	} catch (err) {
    console.error('Sheets API error:', err);

    // Check error code / reason
    const status = err?.status;
    const message = err?.result?.error?.message || 'Unknown error';

    if (status === 403) {
      // 403 = Forbidden (user doesn't have access or insufficient scope)
      alert('Access denied. You do not have permission to view this sheet.');
    } else if (status === 404) {
      // Sheet not found
      alert('The requested sheet does not exist.');
    } else {
      alert(`Error loading sheet: ${message}`);
    }
  }

}

/*
async function signIn() {
  await gapi.auth2.getAuthInstance().signIn();
  loadSheet();
}

async function loadSheet() {
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: 'YOUR_SHEET_ID',
    range: 'Data!A1:Z'
  });

  const values = response.result.values;
  console.log(values);
}
*/

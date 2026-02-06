// Modified by KL for 20260117
var current_date;
var current_time;
var add_date;
var d;
var yyyy;
var mm;
var dd;
let dataTable;
// Modified by KL for 20260205 - Search by Date Button + Search Filter
let searchText = [];
let todayFilterActive = false;
let isApplyingSearch = false;
let holdTimer = null;
let repeatTimer = null;
let speed = 100;
let started = false;

$( document ).ready(function() {
	$( "#ordersForm" ).on( "submit", function( event ) {
		event.preventDefault();		  
	  var outletVar = $(".outlet-select").find(":selected").val();
	  
	  if ( outletVar == "" || typeof outletVar == "undefined" ) {
			alert("Please input outlet");
			$(".outlet-select").focus();
	  } 
		// Modified by KL on 20260120
		else {
			$.ajax({
				url: this.action,
				method: this.method || 'POST',
				data: $(this).serialize()
			}).always(function(){
				window.location.href = 'ordersubmitted';
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
		// Added by KL on 20260120
		$("#order-summary").delay(100).fadeIn();
		
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
	// $.getJSON("./Custom/CustomConfig.json", function (data) {
	// 	const CLIENT_ID = data['GoogleCloud-SheetsClientID'];
	// 	const API_KEY = data['GoogleCloud-SheetsAPIKey'];
	// 	const SheetID = data['GoogleCloud-SheetID'];
	// 	const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

	// 	initClient(CLIENT_ID, API_KEY, SCOPES);
	// 	var tokenClient = initGIS(CLIENT_ID, SCOPES, SheetID);
	// 	// tokenClient.requestAccessToken();
	// });

	// Added by KL for 20260120
	// On click of New Order Button, display section
	$("#new-order-button").on('click',function(){
		$("#main-form-section").css('display','block');
	})

	let datatableReady = false
	// Modified by KL on 20260205 - Resolve Promise issue where Modal Dialog cannot open if pressed too fast
	// let datatableReadyPromise = $.Deferred()
	let datatableReadyResolve;
	const datatableReadyPromise = new Promise(resolve => {
		datatableReadyResolve = resolve;
	});
	
	$("#past-orders-button").on('click',function(e){
		const btnEl = document.getElementById('past-orders-button')
		let btn = coreui.LoadingButton.getInstance(btnEl);

		$.when(datatableReadyPromise).done(() => {
			btn.stop()

			const modalStatic = document.getElementById('sheet-datatable');
			let modalDialog = new coreui.Modal(modalStatic);

			modalDialog.show();

			datatableReady = false;
		})
	})

	// Added by KL on 20260130 - Calculate width before modal is visible
	const modalStatic1 = document.getElementById('sheet-datatable');
	// let modalDialog1 = coreui.Modal.getOrCreateInstance(modalStatic1);

	modalStatic1.addEventListener('shown.coreui.modal', function () {
		dataTable.refresh();
		updateStickyOffsets();
	});

	modalStatic1.addEventListener('shown.coreui.modal', function () {
		$("#modal_date_button").text('Today');
		$("#modal_date_button").val(formatToday());

		const $btn = $('#modal_date_button');

		$btn.removeClass('active')
				.attr('aria-pressed', 'false')
				.blur(); // 🔑 removes sticky hover/focus on mobile
	});

	fetch("/sheet")
  .then(res => res.json())
  .then(data => {
    const keys = Array.from(new Set(data.flatMap(Object.keys)));
    const tableEl = document.getElementById("ordersTable");

		// Define the order you want
		// Modified by KL on 20260130 - Order the Datatable to the input form
		const firstColumns = ["OrderDate", "Which outlet are you from?","Reorder", "Order ID", "Timestamp"]; // columns to appear first
		const remainingColumns = keys.filter(k => !firstColumns.includes(k));

		const IGNORE_COLUMNS = new Set([
			"Data to be Used",
			"Outlet Data",
			"Unique Identifier",
			"Which outlet are you from? ",
		]);

		const visibleKeys = remainingColumns.filter(k => !IGNORE_COLUMNS.has(k));
		
		// Modified by KL on 20260130 - Order the Datatable to the input form
		// Get the order of input label in the form
		let orderInputOrder = [];
		$(`#ordersForm input`).each(function () {

			const $input = $(this);

			// find the associated label (label[for="input_id"])
			const inputId = $input.attr('id');
			const $label = $(`label[for="${inputId}"]`);
			const inputKey = $label[0]?.textContent;
			if ((inputKey !== null && inputKey !== undefined) ) {
				if ( 
					visibleKeys.includes(inputKey) 
				) {
					orderInputOrder.push(inputKey);
				} else if ( inputKey === "Butter KG" ) {
					orderInputOrder.push("Butter KG_2");
				} else if ( inputKey === "CB Bottles (Pieces)" ) {
					orderInputOrder.push("CB Bottle (Pieces)");
				}
			}
			
		});

		const keyArray = [
			...orderInputOrder,
			...visibleKeys.filter(x => !orderInputOrder.includes(x))
		]

		// New ordered keys
		const finalkeys = [...firstColumns, ...keyArray];

		// const headers = [...new Set(data.flatMap(Object.keys))];
		const timestampIndex = finalkeys.indexOf("Timestamp");
		const orderDateIndex = finalkeys.indexOf("OrderDate");

    tableEl.innerHTML = `
      <thead>
        <tr>
				${
					finalkeys.map(k => 
						{
							// console.log("Header key:", k);
							if ( k === "Butter KG_2" ) {
								return `<th>Butter KG</th>`;
							} else if ( k === "Which outlet are you from?" ) {
								return `<th>Outlet</th>`;
							} else if ( k === "OrderDate" ) {
								return `<th>Order Date</th>`;
							} else if ( k === 'Reorder' ) {
								const img = document.createElement('img')
								img.src = 'var/brand/order.png'
								img.width = 20
								img.height = 20
								return ` <th><div style="display:flex; white-space:nowrap; gap:6px; align-items:center">${k}<img src="var/brand/order.png" alt="" width="20%" height="20%"></div></th>`
							} else {
								return `<th>${k}</th>`;
							}
						}
					).join('')
				}
				</tr>
      </thead>
			<tbody class="table-group-divider">
				${data.map((row, index) => `
					<tr>
						${finalkeys.map(k => {
							const value = row[k] ?? "";

							// Timestamp: dd/mm/yyyy HH:mm:ss
							if (k === "Timestamp") {
								return `
									<td data-sort="${toISO(value)}">
										${toISONormalize(value)}
									</td>
								`;
							}

							// OrderDate: dd-mm-yyyy
							if (k === "OrderDate") {
								const displayDate = value;                  // already DD-MM-YYYY
								const [day, month, year] = value.split('-');
								// const sortDate = `${year}-${month}-${day}`;     // convert for sorting
								const orderDate = `${year}${month}${day}`
								// Modified by KL on 20260130 - Transforming date to dd-mm-yy
								var yearDoubleDigit = year.slice(2);
								var displayDateTransformed = `${day}-${month}-${yearDoubleDigit}`;

								return `
									<td data-type="date" data-order="${orderDate}" style="white-space:nowrap">
										${displayDateTransformed}
									</td>
								`;
							}

							// Reorder: Make Button
							// Modified by KL on 20260130 - Resize button for Mobile & align button to center of td
							if (k === "Reorder") {
								return `
									<td style="text-align:center">
										<button type="button" class="btn btn-light rounded-pill btn-tight" onclick="ReorderPopulate(this)"><span class="cil-contrast"></span>Reorder</button>
									</td>
								`;
							}

							// default cell
							return `<td>${value}</td>`;
						}).join("")}
					</tr>
				`).join("")}
			</tbody>
    `;
		
		// Modified by KL on 20260205 - Ordered by Order Date, then by Outlet Name
		const ordertable = document.querySelector("#ordersTable");
		const ordertbody = ordertable.querySelector("tbody");
		const orderrows = Array.from(ordertbody.querySelectorAll("tr"));

		orderrows.sort((rowA, rowB) => {
			// 🔹 Column indexes
			const DATE_COL = 0;
			const STRING_COL = 1;

			// ---- 1️⃣ Primary sort: Date DESC ----
			const dateA = parseDMY(rowA.cells[DATE_COL].innerText);
			const dateB = parseDMY(rowB.cells[DATE_COL].innerText);

			if (dateA.getTime() !== dateB.getTime()) {
				return dateB - dateA; // DESC
			}

			// ---- 2️⃣ Secondary sort: String ASC ----
			const strA = rowA.cells[STRING_COL].innerText.trim().toLowerCase();
			const strB = rowB.cells[STRING_COL].innerText.trim().toLowerCase();

			return strA.localeCompare(strB); // ASC
		});

		// Re-insert rows in sorted order
		orderrows.forEach(row => ordertbody.appendChild(row));

    // initialize DataTable
    dataTable = new simpleDatatables.DataTable(tableEl, {
      searchable: true,
      // fixedHeight: true,
			perPage: 10,
      perPageSelect: [5, 10, 25, 50, 100],
			sortable: true,
			columns: [
				{
					select: orderDateIndex,
					type: "date",
					sort: "desc"
				},
			],
			labels: {
				placeholder: "Search Orders...",
				searchTitle: "Search within table",
				pageTitle: "Page {page}",
				// Added by KL on 20260130 - Make Modal datatable more easily readible on Mobile
				perPage: "per page",
				noRows: "No entries found",
				info: "Showing {start} to {end} of {rows} entries",
				noResults: "No orders match your search query",
			},
			// hiddenHeader: true,
    });

		dataTable.on('datatable.search', function(query, matched) {
			
		});

		// Modified by KL for 20260205 - Search by Date Button + Search Filter
		// console.log(dataTable);
		dataTable.on('datatable.multisearch', function(query, matched) {
			let searchTermsString = [];
			if ( query.length > 0 ) {
				let searchTerms = query[0].terms;
				searchTerms.forEach(termVal => {
					searchTermsString.push(termVal);
				})
			}

			const method = 'multisearch';
			const pg = 1;
			toggleColumnsMatched(dataTable, method, pg)
			updateStickyOffsets();
			if (isApplyingSearch) {
				isApplyingSearch = false;
				return
			}
			searchText = [...searchTermsString];
  		applyCombinedSearch(dataTable);

			toggleColumnsMatched(dataTable, method, pg)
			updateStickyOffsets();
		});

		dataTable.on('datatable.update', function(e) {
			const method = 'update';
			const pg = 1;
			toggleColumnsMatched(dataTable, method, pg)
			// Modified by KL on 20260130 - Sticky 2 Columns
			updateStickyOffsets();
		});

		dataTable.on('datatable.page', function(page) {
			const method = 'update';
			const pg = page;
			toggleColumnsMatched(dataTable, method, pg)
			// Modified by KL on 20260130 - Sticky 2 Columns
			updateStickyOffsets();
		});

		dataTable.on('datatable.init', () => {
			datatableReady = true
			// Modified by KL on 20260205 - Resolve Promise issue where Modal Dialog cannot open if pressed too fast
			// datatableReadyPromise.resolve();
			datatableReadyResolve();

			// ✅ ENABLE BUTTON HERE
			viewOrdersBtn.innerText = 'View All Orders';
  		viewOrdersBtn.disabled = false;

			const method = 'init';
			const pg = 1;
			toggleColumnsMatched(dataTable, method, pg)
			// Modified by KL on 20260130 - Sticky 2 Columns
			updateStickyOffsets();
			// Added by KL on 20260205 - Add button for searching by Date
			addTodaySearchButton(dataTable);
		})
		
		// Modified by KL on 20260130 - Sticky 2 Columns
		updateStickyOffsets();

		window.addEventListener('resize', updateStickyOffsets);
  });

	$("#accordionFlushExample").on('change', 'input', function(e){
		const $input = $(this);
		
		// find the associated label (label[for="input_id"])
		const inputId = $input.attr('id');
		const $label = $(`label[for="${inputId}"]`);
		const inputKey = $label[0]?.textContent;

		// console.log(inputKey, ": ", $input.val());

		const $tbody = $('#order-table tbody');
    $tbody.empty(); // clear table first

		var rowNum = 1;
		$('#accordionFlushExample input').each(function () {
			const $input = $(this);
	
			// Try to find the label using the input's id
			const inputId = $input.attr('id');
			const inputVal = $input.val();
			let labelText = '';
	
			if (inputId) {
					const $label = $(`#accordionFlushExample label[for="${inputId}"]`);
					labelText = $label.length ? $label.text().trim() : '';
			}
			
			// skip empty rows
			if (!labelText || !inputVal) return;

			const row = `
					<tr>
							<td style="font-weight: 100;font-size: medium;">${rowNum}</td>
							<td style="font-weight: 100;font-size: medium;" class="order-label-item">${labelText}</td>
							<td style="font-weight: 100;font-size: medium;">${inputVal}</td>
							<td style="font-weight: 100;font-size: medium;"><button type="button" class="btn btn-ghost-secondary" style="padding-top:0px; padding-bottom:0px; padding-left:6px; padding-right:6px; font-size:small" onclick="RemoveOrderItem(this)">X</button></td>
					</tr>
			`;
			rowNum++;

			$tbody.append(row);

	
			// console.log('Label:', labelText, 'Value:', $input.val());
		});
			
		// $('.item-input').each(function (index) {
    //     const item = $(this).val().trim();
    //     const qty  = $('.qty-input').eq(index).val();

    //     // skip empty rows
    //     if (!item || !qty) return;

    //     const row = `
    //         <tr>
    //             <td>${item}</td>
    //             <td>${qty}</td>
    //         </tr>
    //     `;

    //     $tbody.append(row);
    // });

		// console.log('Changed:', {
		// 	name: $input.attr('name'),
		// 	id: $input.attr('id'),
		// 	value: $input.val()
		// });
	})

	const viewOrdersBtn = document.getElementById('past-orders-button');

	// Disable immediately
	viewOrdersBtn.disabled = true;

	// If using CoreUI LoadingButton
	const viewOrdersLoadingBtn = coreui.LoadingButton.getOrCreateInstance(viewOrdersBtn);

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

	// console.log(newDate);

	const calEl = document.getElementById('calendar_input');
	const cal = coreui.Calendar.getInstance(calEl);
	cal._calendarDate = newDate;
	cal._updateCalendar();

	$('#calendar_input').find('[data-coreui-date="' + newDate + '"]').trigger('click');
}

function getCurrentUnixTimestamp() {
  return Math.floor(Date.now() / 1000);
}

function getAllKeys(rows) {
  const keys = new Set()
  rows.forEach(row => {
    Object.keys(row).forEach(key => keys.add(key))
  })
  return Array.from(keys)
}

function buildColumns(keys) {
  return keys.map(key => ({
    key: key,
    label: key
  }))
}

function normalizeRows(rows, keys) {
  return rows.map(row => {
    const normalized = {}
    keys.forEach(key => {
      normalized[key] = row[key] ?? ""
    })
    return normalized
  })
}

function toISO(ts) {
  if (!ts) return "";
  const [date, time] = ts.split(" ");
  const [d, m, y] = date.split("/");
  return `${y}-${m}-${d}T${time}`;
}

function dateToISO(d) {
  if (!d) return "";
  const [day, month, year] = d.split("-");
  return `${day}-${month}-${year}`;
}

function toISONormalize(ts) {
	if (!ts) return "";
  const [date, time] = ts.split(" ");
  var [m, d, y] = date.split("/");
	 // zero-pad
  m = m.padStart(2, "0");
  d = d.padStart(2, "0");

	// Modified by KL on 20260205 - Update hour to be padded
	let [hh, min, sec] = time.split(":");
  hh = hh.padStart(2, "0");
  return `${d}-${m}-${y} ${hh}:${min}:${sec}`;
}

function toggleColumnsByValue(dt, alwaysVisible = []) {
  const headings = dt.data.headings;
  const allRows = dt.data.data;

  let activeRowIndexes;

  // 1️⃣ SEARCH active
  if (dt._searchQueries.length && Array.isArray(dt._searchData)) {
    activeRowIndexes = dt._searchData.map(r => r.index);
		console.log(activeRowIndexes);
  }
  // 2️⃣ PAGING active
  else if (dt.pages.length) {
    activeRowIndexes = dt.pages[dt._currentPage - 1];
  }
  // 3️⃣ Fallback (all rows)
  else {
    activeRowIndexes = allRows.map((_, i) => i);
  }

  headings.forEach((heading, colIndex) => {
    const colName = heading.textContent ? heading.textContent.trim() : heading.textContent;

    // Always show selected columns
    if (alwaysVisible.includes(colName)) {
      dt.columns.visible[colIndex] = true;
      return;
    }

    let hasValue = false;

    for (const rowIndex of activeRowIndexes) {
      const cell = allRows[rowIndex]?.cells[colIndex];
      if (cell !== null && String(cell).trim() !== "") {
        hasValue = true;
        break;
      }
    }

    dt.columns.visible[colIndex] = hasValue;
  });

  dt.update();
}

function getFilteredRows(dt) {
  const visibleRows = [];

  // Iterate over all table rows in tbody
  const trs = dt.dom.querySelectorAll("tbody tr");

  trs.forEach(tr => {
    if (tr.style.display !== "none") { // only visible rows
      const rowObj = {};
      dt.data.headings.forEach((header, i) => {
        const cell = tr.children[i];
        if (cell && cell.textContent.trim() !== "") {
          rowObj[header] = cell.textContent.trim();
        }
      });
      visibleRows.push(rowObj);
    }
  });

  return visibleRows;
}

function toggleColumnsMatched ( dt, method, pg ) {

	var headerRow = [];
	var fullHeaderRowIndex = []
	var MUSTHAVEHEADERROW = ['Order Date', 'Outlet','Reorder','Order ID','Timestamp'];
	var MUSTHAVEHEADERROWINDEX = [];
	dt.data.headings.forEach((headerCol, i)=>{
		// Working on this portion. Reorder does not get returned
		headerValue = typeof headerCol.data === 'string' ? headerCol.data : headerCol.text;
		headerRow.push(headerValue);
		
		if ( MUSTHAVEHEADERROW.includes(headerValue) ) {
			MUSTHAVEHEADERROWINDEX.push(i);
		}
		fullHeaderRowIndex.push(i);
	});
	
	var pagesDataIndex = [];
	dt.pages.forEach((page, i) => {
		// pagesData[i] = [page];
		pagesDataIndex[i] = [...MUSTHAVEHEADERROWINDEX];
		page.forEach((pageDataRow, j) => {
			pageDataRow.row.cells.forEach(( cellData, k ) => {
				// console.log(cellData);
				var cellDataLength = cellData?.text ? cellData.text.length : cellData.data.length;
				if ( cellDataLength > 0 ) {
					if ( !pagesDataIndex[i].includes(k) ) {
						pagesDataIndex[i].push(k);
					}
				}
			})
		});

		// Sort by ascending number
		pagesDataIndex[i].sort((a, b) => a - b);
	});

	// Reset Header & TD data
	$('#ordersTable tr').each(function () {
		fullHeaderRowIndex.forEach((element) => {
			$(this).find('th, td').eq(element).show();
		});
	});
	
	var page1Array = pagesDataIndex.length > 0 ? pagesDataIndex[pg-1] : [];
	if ( page1Array.length > MUSTHAVEHEADERROW.length ) { // if results have data more than the default
		$('#ordersTable tr').each(function () {
			fullHeaderRowIndex.forEach((element) => {
				if ( !page1Array.includes(element) ) {
					$(this).find('th, td').eq(element).hide();
				}
			});
		});
		
	}
}

function ReorderPopulate(btn) {
	// console.log(index);
	// console.log(dataTable);
	// dataTable.data.data[index]
	const tr = btn.closest('tr');
	const index = parseInt(tr.dataset.index, 10);
	// console.log(tr);
	// console.log(index);
	// 1️⃣ Get headers
	const headers = dataTable.data.headings.map(h => {
		var headerValue = typeof h.data === 'string' ? h.data : h.text;
		return headerValue
	});
	// console.log(headers);
	
	// 2️⃣ Get row values
	const rowData = dataTable.data.data[index].cells.map(cell => cell.data);
	// console.log(rowData);
	
	// 3️⃣ Combine into key:value object
	const rowObject = {};
	headers.forEach((header, i) => {
		// Modified by KL on 20260129 - To capture Order Date properly
		if ( header === "Order Date" ) {
			rowObject[header] = rowData[i];
		} else {
			rowObject[header] = rowData[i][0]?.data;
		}
	});
	// console.log(rowObject);

	const modalStatic = document.getElementById('sheet-datatable');
	let modalDialog = coreui.Modal.getOrCreateInstance(modalStatic);

	modalDialog.hide();
	showAlertModal("<b>Form Filled</b>", "Order");
	$("#start-order-outlined").trigger('click');

	// Added by KL on 20260129 - Fill Up Calendar according to Reordered order
	const rawDate = rowObject["Order Date"].trim();
	var [rawDate_day, rawDate_month, rawDate_year] = rawDate.split('-');
	// Modified by KL on 20260203 - Rectifying issue where Date is defaulting to 19XX instead of 20XX
	// If year is 2 digits → force 20xx
  if (rawDate_year.length === 2) {
    rawDate_year = 2000 + parseInt(rawDate_year, 10);
  } else {
    rawDate_year = parseInt(rawDate_year, 10);
  }
	var rawDate_newDate = new Date(rawDate_year, rawDate_month-1, rawDate_day);

	const calEl = document.getElementById('calendar_input');
	const cal = coreui.Calendar.getInstance(calEl);
	const cal_mindate = cal._minDate;
	var final_date = cal_mindate;
	if ( rawDate_newDate >= cal_mindate ) {
		final_date = rawDate_newDate
	}

	cal._calendarDate = final_date;
	cal._updateCalendar();

	$('#calendar_input').find('[data-coreui-date="' + final_date + '"]').trigger('click');

	// Fill Up Outlet Option first
	const $tbody = $('#order-table tbody');
	$tbody.empty(); // clear table first
	if ( rowObject['Outlet'] ) {
		const $select = $('#Outlet-Section select');
		const valueToSet = rowObject['Outlet'];
		if ($select.find(`option[value="${valueToSet}"]`).length > 0) {
			
			// ✅ Guaranteed: divs hidden
			$(`#ordersForm input`).each(function () {

				const $input = $(this);

				// find the associated label (label[for="input_id"])
				const inputId = $input.attr('id');
				const $label = $(`label[for="${inputId}"]`);
				const inputKey = $label[0]?.textContent;
				if ( inputKey in rowObject ) {
					$input.val('')
				}

				if (rowObject[inputKey] !== undefined && rowObject[inputKey] !== null) {
					$input.val(rowObject[inputKey]).trigger('change');
				}
				
			});

			$select.val(valueToSet).trigger('change');

			// (async function () {
			// 	await setSelectAndWaitForHide($select, valueToSet);

			// 	// ✅ Guaranteed: divs hidden
			// 	$(`#ordersForm input:not([type="hidden"])`).each(function () {

			// 		const $input = $(this);

			// 		// find the associated label (label[for="input_id"])
			// 		const inputId = $input.attr('id');
			// 		const $label = $(`label[for="${inputId}"]`);
			// 		// console.log($input.attr('display'));
					
			// 		console.log("Div is hidden: " + $input.is(':visible'));
			// 		if ($input.is(':visible')) {
			// 			console.log($label[0]?.textContent + ": hidden");
			// 		} else {
			// 			console.log($label[0]?.textContent + ": " + $input.css('display'));
			// 		}
			// 	});
			// })();

			// $(':animated').promise().done(function () {
			// 	$(`#ordersForm input:not([type="hidden"])`).each(function () {

			// 		const $input = $(this);

			// 		// find the associated label (label[for="input_id"])
			// 		const inputId = $input.attr('id');
			// 		const $label = $(`label[for="${inputId}"]`);
			// 		// console.log($input.attr('display'));
					
			// 		console.log("Div is hidden: " + $input.is(':visible'));
			// 		if ($input.is(':visible')) {
			// 			console.log($label[0]?.textContent + ": hidden");
			// 		} else {
			// 			console.log($label[0]?.textContent + ": " + $input.css('display'));
			// 		}
			// 	});
			// });

			// $select.val(valueToSet).trigger('change');

			
			// .promise().done(function() {
				// $(`#ordersForm input:not([type="hidden"])`).each(function () {

				// 	const $input = $(this);

				// 	// find the associated label (label[for="input_id"])
				// 	const inputId = $input.attr('id');
				// 	const $label = $(`label[for="${inputId}"]`);
				// 	// console.log($input.attr('display'));
					
				// 	console.log("Div is hidden: " + $input.is(':visible'));
				// 	if ($input.is(':visible')) {
				// 		console.log($label[0]?.textContent + ": hidden");
				// 	} else {
				// 		console.log($label[0]?.textContent + ": " + $input.css('display'));
				// 	}

				// 	// if ($label.length) {
				// 	// 		const key = $label.text().trim(); // get label text
				// 	// 		const value = data[key];

				// 	// 		// if value exists, fill the input
				// 	// 		if (value !== undefined) {
				// 	// 				$input.val(typeof value === 'object' && value.data ? value.data : value);
				// 	// 		}
				// 	// }

				// });
			// }); 
		} 
	}

	// Fill up form
	// $(`#ordersForm input:not([type="hidden"])`).each(function () {

	// 		const $input = $(this);

	// 		// find the associated label (label[for="input_id"])
	// 		const inputId = $input.attr('id');
	// 		const $label = $(`label[for="${inputId}"]`);
	// 		// console.log($input.attr('display'));
			
	// 		console.log("Div is hidden: " + $input.is(':visible'));
	// 		if ($input.is(':visible')) {
	// 			console.log($label[0]?.textContent + ": hidden");
	// 		} else {
	// 			console.log($label[0]?.textContent + ": " + $input.css('display'));
	// 		}

	// 		// if ($label.length) {
	// 		// 		const key = $label.text().trim(); // get label text
	// 		// 		const value = data[key];

	// 		// 		// if value exists, fill the input
	// 		// 		if (value !== undefined) {
	// 		// 				$input.val(typeof value === 'object' && value.data ? value.data : value);
	// 		// 		}
	// 		// }
	// });

}

function setSelectAndWaitForHide($select, value, delay = 2000) {
    return new Promise(resolve => {
        $select.val(value).trigger('change');

				setTimeout(resolve, delay);

        // $(':animated').promise().done(resolve);
    });
}

function showAlertModal(message, title = 'Alert') {

    // Remove existing alert modal if any
    $('#dynamicAlertModal').remove();

    // Build modal HTML dynamically
    const modalHtml = `
        <div class="modal fade" id="dynamicAlertModal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content">

              <div class="modal-header">
                <h5 class="modal-title">${title}</h5>
                <button type="button" class="btn-close" data-coreui-dismiss="modal"></button>
              </div>

              <div class="modal-body">
                ${message}
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-dark" data-coreui-dismiss="modal">
                  OK
                </button>
              </div>

            </div>
          </div>
        </div>
    `;

    // Append to body
    $('body').append(modalHtml);

    // Init + show CoreUI modal
    const modalEl = document.getElementById('dynamicAlertModal');
    const modal = new coreui.Modal(modalEl);

    modal.show();

    // Cleanup after close
    modalEl.addEventListener('hidden.coreui.modal', function () {
        $(this).remove();
    });
}

// Added by KL on 20260130 - Sticky 2nd Column
function updateStickyOffsets() {
  const table = document.querySelector('.datatable-table')
  if (!table) return

  const firstTh = table.querySelector('thead th:nth-child(1)')
  if (!firstTh) return

  const width = firstTh.offsetWidth
  document.documentElement.style.setProperty('--col1-width', `${width}px`)
}

// Modified by KL on 20260205 - Ordered by Order Date, then by Outlet Name
function parseDMY(value) {
  const clean = value.trim();
  const [dd, mm, yy] = clean.split("-");

  // Convert 2-digit year → 20xx
  const year = yy.length === 2 ? `20${yy}` : yy;

  return new Date(`${year}-${mm}-${dd}`);
}

// Added by KL on 20260205 - Add button for searching by Date
function addTodaySearchButton(dataTable) {
	// console.log(dataTable);
  const top = dataTable.wrapperDOM.querySelector(".datatable-top");
  if (!top) return;

  // Avoid duplicate button
  if (top.querySelector(".btn-today")) return;

	const wrapper = document.createElement("div");
  wrapper.className = "date-actions";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn btn-outline-light btn-sm rounded-pill btn-today";
	btn.setAttribute("data-coreui-toggle", "button");
  btn.textContent = "Today";
	btn.id = "modal_date_button";
	btn.value = formatToday();
	coreui.Button.getOrCreateInstance(btn);

  btn.addEventListener("click", () => {
		todayFilterActive = !todayFilterActive;
		applyCombinedSearch(dataTable);
  });

	const iconbuttondown = document.createElement("button");
	iconbuttondown.type = "button";
  iconbuttondown.className = "btn btn-outline-light btn-sm rounded-pill circle-btn";
	const icondown = document.createElement("i");
	icondown.classList.add("fa-solid", "fa-angle-down");
	iconbuttondown.id = "modal_date_button_decrease";
	iconbuttondown.appendChild(icondown);

	const iconbuttonup = document.createElement("button");
	iconbuttonup.type = "button";
  iconbuttonup.className = "btn btn-outline-light btn-sm rounded-pill circle-btn";
	const iconup = document.createElement("i");
	iconup.classList.add("fa-solid", "fa-angle-up");
	iconbuttonup.id = "modal_date_button_increase";
	iconbuttonup.appendChild(iconup);

  wrapper.appendChild(iconbuttondown);
  wrapper.appendChild(btn);
	wrapper.appendChild(iconbuttonup)
  top.appendChild(wrapper);

	$("#modal_date_button_decrease, #modal_date_button_increase").on('click', function(){
		// inc_dec_date($(this)[0].id);
	});

	// Increase
	const incBtn = document.getElementById('modal_date_button_increase');
	const decBtn = document.getElementById('modal_date_button_decrease');
	
	incBtn.addEventListener('mousedown', () => {
		const current = $("#modal_date_button").val();
		startHold(current, +1);
	});
	incBtn.addEventListener('touchstart', (e) => {
		e.preventDefault();
		const current = $("#modal_date_button").val();
		startHold(current, +1);
	});

	// Decrease
	decBtn.addEventListener('mousedown', () => {
		console.log('mousedown');
		const current = $("#modal_date_button").val();
		startHold(current, -1);
	});
	decBtn.addEventListener('touchstart', (e) => {
		e.preventDefault();
		const current = $("#modal_date_button").val();
		startHold(current, -1);
	});

	// Stop on release
	['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(evt => {
		incBtn.addEventListener(evt, stopHold);
		decBtn.addEventListener(evt, stopHold);
	});

	// $("#modal_date_button").on('click', function(){
	// 	if ( !$(this).hasClass('active') ) {
	// 		console.log($(this));
	// 		// console.log($(this));
	// 		$(this)[0].blur();
	// 		// Wait for click/toggle logic to complete
	// 		setTimeout(() => {
	// 			$(this)[0].blur();   // 🔑 removes focus & hover visuals
	// 		}, 100);
	// 	}
	// });

	document.querySelectorAll('#modal_date_button').forEach(btn => {
		btn.addEventListener('click', () => {
			if ( !btn.classList.contains('active') ) {
				// console.log(btn);
				btn.blur();
			}
			// btn.classList.remove('hover-fix');
			// console.log(btn);
			
			// setTimeout(() => {
			// 	btn.blur(); // removes focus + hover state
			// }, 300);
		});
	});

	document.querySelectorAll('.circle-btn').forEach(btn => {
		btn.addEventListener('touchend', () => {
			btn.classList.remove('hover-fix');
			
			setTimeout(() => {
				btn.blur(); // removes focus + hover state
			}, 300);
		});
	});

	// const dateBtn = document.getElementById('modal_date_button');

	// dateBtn.addEventListener('mouseup touchend', () => {
	// 	console.log("mouseup");
	// 	// Wait for click/toggle logic to complete
	// 	setTimeout(() => {
	// 		dateBtn.blur();   // 🔑 removes focus & hover visuals
	// 	}, 100);
	// });
}

function formatToday() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);

  return `${dd}-${mm}-${yy}`;
}

// Modified by KL for 20260205 - Search by Date Button + Search Filter
function applyCombinedSearch(dataTable) {
	if (isApplyingSearch) return;
	isApplyingSearch = true;
  let query = [...searchText];
	
	let $modal_date_button = $("#modal_date_button")
	let modal_date_button_active = $modal_date_button.hasClass('active');
	if ( modal_date_button_active ) {
		let modal_date_button_value = $modal_date_button.val();
		const dateValue = modal_date_button_value; // DD-MM-YY
		query.push(dateValue);
	}

  dataTable.multiSearch([{terms:query, columns:undefined}]);
	isApplyingSearch = false;
}

function parseDDMMYYFromModalDate(dateStr) {
  const [dd, mm, yy] = dateStr.split("-").map(Number);

  // assume 20xx (adjust if needed)
  const yyyy = yy < 100 ? 2000 + yy : yy;

  return new Date(yyyy, mm - 1, dd);
}

function formatDDMMYY(dateObj) {
  const dd = String(dateObj.getDate()).padStart(2, "0");
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const yy = String(dateObj.getFullYear()).slice(-2);

  return `${dd}-${mm}-${yy}`;
}

function changeDate(currentValue, deltaDays) {
  const date = parseDDMMYYFromModalDate(currentValue);
  date.setDate(date.getDate() + deltaDays);
  return formatDDMMYY(date);
}

function startHold(currentValue, days) {
	if (started) return;
  started = true;

	// 🔔 haptic tap
  if (navigator.vibrate) {
    navigator.vibrate(15);
  }

  // 1️⃣ instant change
	let inc_dec_val = days == -1 ? 'modal_date_button_decrease' : 'modal_date_button_increase';
  inc_dec_date(inc_dec_val);

  // 2️⃣ start repeating after delay
  holdTimer = setTimeout(() => {
    repeatTimer = setInterval(() => {
			inc_dec_date(inc_dec_val);
			speed = Math.max(20, speed - 5);

			// optional light repeat buzz
      if (navigator.vibrate) {
        navigator.vibrate(5);
      }
		}, speed);	
	// speed = 100;
  }, 400); // delay before repeat
	// speed = 100;

}

function stopHold() {
  clearTimeout(holdTimer);
  clearInterval(repeatTimer);
	speed = 100;
	started = false;
  holdTimer = repeatTimer = null;
}

function inc_dec_date( containerid ){
	const current = $("#modal_date_button").val();
	const currentDateObj = parseDDMMYYFromModalDate(formatToday());
	// console.log(current);
	// console.log(currentDateObj);
	let newDateObj = ""
	let dateAddSubtract = 0;
	if ( containerid == "modal_date_button_decrease" ) {
		dateAddSubtract = -1;
		newDateObj = parseDDMMYYFromModalDate(changeDate(current, dateAddSubtract));
	} else if ( containerid == "modal_date_button_increase" )  {
		dateAddSubtract = +1;
		newDateObj = parseDDMMYYFromModalDate(changeDate(current, dateAddSubtract));
	}
	const MS_PER_DAY = 24 * 60 * 60 * 1000;
	const dateDiff = Math.round((newDateObj - currentDateObj) / MS_PER_DAY);
	if ( dateDiff == -1 ) {
		$("#modal_date_button").text('Yesterday');
	} else if ( dateDiff == 1 ) {
		$("#modal_date_button").text('Tomorrow');
	} else if ( dateDiff == 0 ) {
		$("#modal_date_button").text('Today');
	}	else {
		$("#modal_date_button").text(changeDate(current, dateAddSubtract));
	}
	$("#modal_date_button").val(changeDate(current, dateAddSubtract));
	if ( $("#modal_date_button").hasClass('active') ) {
		applyCombinedSearch(dataTable);
	}
}

function RemoveOrderItem(btn) {
	const orderItem = $(btn).closest('tr').find('td.order-label-item').text().trim();

	$('#accordionFlushExample label').each(function () {
    const $label = $(this);
    if ($label.text().trim() === orderItem) {
      const forId = $label.attr('for');
      if (forId) {
				const $inputDiv = $(`#accordionFlushExample input[id="${forId}"]`);
				$inputDiv.val('').trigger('change');
        // $('#' + forId).val('').trigger('change');
      }
    }
  });
}

// Added by KL for 20260120
// function googleSheetAction(action) {
// 	$.getJSON("./Custom/CustomConfig.json", function (data) {
// 		const CLIENT_ID = data['GoogleCloud-SheetsClientID'];
// 		const API_KEY = data['GoogleCloud-SheetsAPIKey'];
// 		const SheetID = data['GoogleCloud-SheetID'];
// 		const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

// 		initClient(CLIENT_ID, API_KEY, SCOPES);
// 		var tokenClient = initGIS(CLIENT_ID, SCOPES, SheetID);
// 		tokenClient.requestAccessToken();
// 	});
// }

// function initClient(CLIENT_ID, API_KEY, SCOPES) {
// 	gapi.load('client', async () => {
// 		await gapi.client.init({
// 			apiKey: API_KEY,
// 			discoveryDocs: [
// 				'https://sheets.googleapis.com/$discovery/rest?version=v4'
// 			],
// 		})
// 	});
// }

// function initGIS(CLIENT_ID, SCOPES, SheetID) {
//   var tokenClient = google.accounts.oauth2.initTokenClient({
//     client_id: CLIENT_ID,
//     scope: SCOPES,
//     callback: (tokenResponse) => {
// 			// console.log(tokenResponse);
// 			if (tokenResponse.error) {
// 				console.error('Auth error:', tokenResponse);

// 				alert('Authentication failed. Please try again.');
// 				return;
// 			} 
// 			gapi.client.setToken(tokenResponse);
// 			//console.log(tokenClient);
// 			loadSheet(SheetID); // call API after auth

//     },
// 		// On close of popup
// 		error_callback: (errorResp) => {
// 			console.log(errorResp.message);

// 			if ( errorResp.message == "Popup window closed") {
// 				// To reload the button that retrieves Google Sheet Data
// 			}

//     },
//   });
// 	return tokenClient;
// }

// async function loadSheet(SheetID) {
// 	try {
// 		const response = await gapi.client.sheets.spreadsheets.values.get({
// 			spreadsheetId: SheetID,
// 			range: 'Order Database!A1:Z'
// 		});

// 		const [headers, ...rows] = response.result.values;

// 		const data = rows.map(row =>
// 			headers.reduce((obj, h, i) => {
// 				obj[h] = row[i] || '';
// 				return obj;
// 			}, {})
// 		);

// 		console.log(data);

// 	} catch (err) {
//     console.error('Sheets API error:', err);

//     // Check error code / reason
//     const status = err?.status;
//     const message = err?.result?.error?.message || 'Unknown error';

//     if (status === 403) {
//       // 403 = Forbidden (user doesn't have access or insufficient scope)
//       alert('Access denied. You do not have permission to view this sheet.');
//     } else if (status === 404) {
//       // Sheet not found
//       alert('The requested sheet does not exist.');
//     } else {
//       alert(`Error loading sheet: ${message}`);
//     }
//   }

// }

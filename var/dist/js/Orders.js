// Modified by KL for 20260117
var current_date;
var current_time;
var add_date;
var d;
var yyyy;
var mm;
var dd;
let dataTable;

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
	let datatableReadyPromise = $.Deferred()

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

	fetch("/sheet")
  .then(res => res.json())
  .then(data => {
    const keys = Array.from(new Set(data.flatMap(Object.keys)));
    const tableEl = document.getElementById("ordersTable");

		// Define the order you want
		const firstColumns = ["OrderDate", "Which outlet are you from?","Reorder"]; // columns to appear first
		const remainingColumns = keys.filter(k => !firstColumns.includes(k));

		const IGNORE_COLUMNS = new Set([
			"Data to be Used",
			"Outlet Data",
			"Unique Identifier",
			"Which outlet are you from? ",
		]);

		const visibleKeys = remainingColumns.filter(k => !IGNORE_COLUMNS.has(k));

		// New ordered keys
		const finalkeys = [...firstColumns, ...visibleKeys];

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
								img.src = '/var/brand/order.png'
								img.width = 20
								img.height = 20
								return ` <th><div style="display:flex; white-space:nowrap; gap:6px; align-items:center">${k}<img src="/var/brand/order.png" alt="" width="20%" height="20%"></div></th>`
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

								return `
									<td data-type="date" data-order="${orderDate}" style="white-space:nowrap">
										${displayDate}
									</td>
								`;
							}

							// Reorder: Make Button
							if (k === "Reorder") {
								return `
									<td>
										<button type="button" class="btn btn-light rounded-pill" onclick="ReorderPopulate(this)"><span class="cil-contrast"></span>Reorder</button>
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
				}
			],
			labels: {
				placeholder: "Search Orders...",
				searchTitle: "Search within table",
				pageTitle: "Page {page}",
				perPage: "orders per page",
				noRows: "No entries found",
				info: "Showing {start} to {end} of {rows} entries",
				noResults: "No orders match your search query",
			},
			// hiddenHeader: true,


    });

		dataTable.on('datatable.search', function(query, matched) {
			
		});

		dataTable.on('datatable.update', function(e) {
			const method = 'update';
			const pg = 1;
			toggleColumnsMatched(dataTable, method, pg)
		});

		dataTable.on('datatable.page', function(page) {
			const method = 'update';
			const pg = page;
			toggleColumnsMatched(dataTable, method, pg)
		});

		dataTable.on('datatable.init', () => {
			datatableReady = true
			datatableReadyPromise.resolve();
			const method = 'init';
			const pg = 1;
			toggleColumnsMatched(dataTable, method, pg)
		})

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
							<td style="font-weight: 100;font-size: medium;">${labelText}</td>
							<td style="font-weight: 100;font-size: medium;">${inputVal}</td>
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
  return `${d}-${m}-${y} ${time}`;
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
		rowObject[header] = rowData[i][0]?.data;
	});
	// console.log(rowObject);

	const modalStatic = document.getElementById('sheet-datatable');
	let modalDialog = coreui.Modal.getOrCreateInstance(modalStatic);

	modalDialog.hide();
	showAlertModal("<b>Form Filled</b>", "Order");
	$("#start-order-outlined").trigger('click');


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

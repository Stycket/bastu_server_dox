const { DateTime } = luxon;

const now = DateTime.now();
console.log(now.toISO());

document.addEventListener('DOMContentLoaded', () => {
  const monthButtonsContainer = document.getElementById('month-buttons-container');

  const bookButton = document.getElementById('book-button');
  const messageBox = document.getElementById('message-box');





// Global variables to store selected date and times
let selectedDate = null;
let selectedTimes = [];


let currentMonth = DateTime.now().month;;


// Event delegation for date and time slot selection
document.addEventListener('click', (event) => {
  const target = event.target;

  const selectableDate = target.closest('.selectable-date');
  const selectableTime = target.closest('.selectable-time');

 

  if (selectableDate) {
    handleDateSelection(selectableDate);
  } else if (selectableTime) {
    handleTimeSelection(selectableTime);
  }
});



function handleDateSelection(selectedDateElement) {
  // Remove 'selected' class from previously selected date
  if (selectedDate) {
    selectedDate.classList.remove('selected');
  }

  // Reset selected times and remove 'selected' class from all time slots
  selectedTimes.forEach(timeElement => {
    timeElement.classList.remove('selected');
  });
  selectedTimes = [];

  // Update selected date and month
  selectedDateElement.classList.add('selected');
  selectedDate = selectedDateElement;
  selectedMonth = currentMonth; // Get the selected month from the dataset

  console.log('Selected date:', selectedDateElement.textContent);




// make the timeslots and their logic


  
// populateTimeSlots function
function populateTimeSlots(selectedDate, selectedMonth) {
  const timeSlotTable = document.createElement('table');
  timeSlotTable.id = 'time-slot-table';
  timeSlotTable.classList.add('date-time-table');

  const timeSlotTableBody = document.createElement('tbody');

  let bodyRow = document.createElement('tr'); // Initialize the first row

  for (let hour = 1; hour <= 24; hour++) {
    const formattedHour = hour.toString().padStart(2, '0');
    const timeSlot = formattedHour + ':00';
    const bodyCell = document.createElement('td');
    const option = document.createElement('option');
    option.value = timeSlot;
    option.textContent = timeSlot;

    // Generate a unique ID for each timeslot cell
    const cellId = `Date_${selectedDateElement.textContent}-Time_${formattedHour}`;
  

    bodyCell.id = cellId.replace(/\s+/g, '-'); // Replace spaces with dashes


    const bookedItemsList = document.getElementById("booked_items_list");
    const bookedItemstest = bookedItemsList.getElementsByTagName("li");

    setTimeout(function() {
      for (let i = 0; i < bookedItemstest.length; i++) {
          const bookedItem = bookedItemstest[i];
          const idParts = bookedItem.id.split("-Time_");
          const times = idParts[1].split("-");
  
          for (let j = 0; j < times.length; j++) {
              const time = times[j];
              const tableCellId = idParts[0] + "-Time_" + time;
              const tableCell = document.getElementById(tableCellId.slice(0, -3));
  
              if (tableCell) {
                  tableCell.style.backgroundColor = "blueviolet";
                  tableCell.style.pointerEvents = "none";
              }
          }
      }
  }, 55); // Delay of 3000 milliseconds (3 seconds)
  




  setTimeout(function() {
    const bookedItemsList = document.getElementById('booked_items_list');
    

    for (let i = 0; i < bookedItemsList.children.length; i++) {
        const bookedItem = bookedItemsList.children[i];
        const idParts = bookedItem.id.split("-Time_");
        const times = idParts[1].split("-");

        for (let j = 0; j < times.length; j++) {
            const time = times[j];
            const tableCellId = idParts[0] + "-Time_" + time;
            const tableCell = document.getElementById(tableCellId);
           

            if (tableCell) {
                tableCell.style.backgroundColor = "blueviolet";
                tableCell.style.pointerEvents = "none";
            }
        }
    }
}, 55);





    // Check if the time slot is booked for the selected date
    const isBooked = bookedItems.some(item => 
      item.date === selectedDate && item.timeSlot.includes(timeSlot)
    );

    if (isBooked) {
      bodyCell.classList.add('booked-time');
      option.disabled = true; // Disable selecting booked time slots
    } else {
      bodyCell.classList.add('selectable-time');
    }

    bodyCell.appendChild(option);
    bodyRow.appendChild(bodyCell);

    if (hour % 5 === 0 || hour === 24) {
      timeSlotTableBody.appendChild(bodyRow);
      bodyRow = document.createElement('tr'); // Start a new row
    }
  }

  timeSlotTable.appendChild(timeSlotTableBody);


  const bookingBox = document.getElementById('bookin_box');

  const existingTable = document.getElementById('time-slot-table');
  if (existingTable) {
    existingTable.replaceWith(timeSlotTable);
  } else {
    bookingBox.appendChild(timeSlotTable);
  }
}



populateTimeSlots();



  // Get the container element


  
}







function handleTimeSelection(selectedTimeElement) {
  if (selectedTimes.includes(selectedTimeElement)) {
    selectedTimes = selectedTimes.filter(time => time !== selectedTimeElement);
    selectedTimeElement.classList.remove('selected');
  } else if (selectedTimes.length < 3) {
    selectedTimes.push(selectedTimeElement);
    selectedTimeElement.classList.add('selected');
  }

  console.log('Selected times:', selectedTimes.map(time => time.textContent));

  const choosenTimesDiv = document.getElementById('BookingTimes');
  const choosenTimes = Array.from(selectedTimes).map(time => time.textContent);

  // Convert the time strings to Date objects for easier manipulation
  const timeObjects = choosenTimes.map(time => {
    const [hours, minutes] = time.split(':');
    return new Date(0, 0, 0, parseInt(hours), parseInt(minutes));
  });
  
  // Find the earliest and latest times
  const earliestTime = new Date(Math.min(...timeObjects));
  const latestTime = new Date(Math.max(...timeObjects));
  
  // Add 1 hour to the latest time
  latestTime.setHours(latestTime.getHours() + 1);
  
  // Format the times as strings in the desired format (HH:mm-HH:mm)
  const formattedEarliestTime = `${earliestTime.getHours()}:${earliestTime.getMinutes().toString().padStart(2, '0')}`;
  const formattedLatestTime = `${latestTime.getHours()}:${latestTime.getMinutes().toString().padStart(2, '0')}`;
  
  // Combine the formatted times with a hyphen
  const formattedTimeRange = `${formattedEarliestTime}-${formattedLatestTime}`;
  
  // Assign the formatted time range to the chosenTimesDiv's text content
  choosenTimesDiv.textContent = formattedTimeRange;
  


  
  // Log the cell ID with the correct values
  const cellId = `Date_${selectedDate.textContent}-Time_${selectedTimeElement.textContent}`;

  const cellIdNoSpace = cellId.replace(/\s+/g, '-'); // Replace spaces with dashes
  console.log('Cell ID:', cellIdNoSpace);
}



  let selectedMonth = DateTime.now().month; // Initialize with current month

  function populateMonthButtons() {
    monthButtonsContainer.innerHTML = '';

    currentMonth = DateTime.now().month;






    const monthNamesInSwedish = [
      'januari', 'februari', 'mars', 'april', 'maj', 'juni',
      'juli', 'augusti', 'september', 'oktober', 'november', 'december'
    ];
    
    for (let i = -1; i < 3; i++) {
      const monthIndex = (currentMonth + i) % 12;
      const button = document.createElement('div');
      const monthName = monthNamesInSwedish[monthIndex];
      
      button.textContent = monthName;
      button.classList.add('month-button');
      button.dataset.month = monthIndex + 1; // Adding 1 to match 1-indexed months
      monthButtonsContainer.appendChild(button);


  // Add the 'selected' class to the first button
  if (i === -1) {
    button.classList.add('selected');
}

    
      button.addEventListener('click', () => {


  // Remove selected class from all buttons
      const allButtons = document.querySelectorAll('.month-button');
      allButtons.forEach(btn => btn.classList.remove('selected'));

      // Add selected class to the clicked button
      button.classList.add('selected');



        selectedMonth = monthIndex + 1; // Adding 1 to match 1-indexed months
        populateDateSelector(selectedMonth);
      });
    }
  }




  function populateDateSelector(month) {
  const dateTable = document.createElement('table');
  dateTable.id = 'date-table';
  dateTable.classList.add('date-time-table');

  let startDate = DateTime.local().set({ month, day: 1 });
  const endDate = startDate.endOf('month');

  let row = document.createElement('tr');

  let rowDays = document.createElement('tr');



const firstDayOfWeek = startDate.weekday; // Get the day index (0-6) of the 1st day
  const daysOfWeek = ['Sön', 'Mån', 'Tis', 'Ons', 'Tors', 'Fre', 'Lör'];

  let headerRow = document.createElement('tr');
  for (let i = 0; i < 7; i++) {
    const headerCell = document.createElement('th');
    headerCell.textContent = daysOfWeek[(firstDayOfWeek + i) % 7]; // Adjust for the first day of the week
    headerRow.appendChild(headerCell);
  }
  dateTable.appendChild(headerRow);

  row.classList.add('week-row');

  for (let i = 0; i < firstDayOfWeek; i++) {
    const emptyCell = document.createElement('td');
    emptyCell.classList.add('empty-cell');
    rowDays.appendChild(emptyCell);
  }



  while (startDate <= endDate) {
    const cell = document.createElement('td');
    const option = document.createElement('option');
    option.value = startDate.toISODate();

    // Format the date in Swedish
    const formattedDate = startDate.setLocale('sv').toFormat('d / M');

    option.textContent = formattedDate;

    cell.appendChild(option);
    cell.classList.add('selectable-date');
    row.appendChild(cell);

    if (row.children.length === 7) {
      dateTable.appendChild(row);
      row = document.createElement('tr');
    }

    startDate = startDate.plus({ days: 1 });
    
  }

  if (row.children.length > 0) {
    dateTable.appendChild(row);
  }


  const bookingBox = document.getElementById('bookin_box');

  const existingTable = document.getElementById('date-table');
  if (existingTable) {
    existingTable.replaceWith(dateTable);
  } else {
    bookingBox.appendChild(dateTable);
  }

  // Re-add event listeners for the new date cells
  const selectableDates = document.querySelectorAll('.selectable-date');
  selectableDates.forEach(dateCell => {
    dateCell.addEventListener('click', () => {
      handleDateSelection(dateCell);
    });
  });
}




  

  populateMonthButtons();
  populateDateSelector(selectedMonth);
 


  bookButton.addEventListener('click', async () => {
    const selectedDateValue = selectedDate.textContent;
    const selectedTimeSlots = selectedTimes.map(time => time.textContent);

    //reload page when bookin
    location.reload();


    console.log('Selected date:', selectedDateValue);
  console.log('Selected time slots:', selectedTimeSlots);
  
    const response = await fetch('https://6219-2a00-801-703-2b1b-f0f1-441b-b075-5c37.ngrok-free.app/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: selectedDateValue,
        timeSlots: selectedTimeSlots, 
      }),
    });
    const data = await response.json();
    if (data.success) {
      messageBox.textContent = 'Booking successful!';
    } else {
      messageBox.textContent = 'Booking failed. Time slot may be unavailable.';
    }
  });
});



let bookedItems = [];


// fetch booked items


// fetch booked items
// Define a function to fetch booked items
async function fetchBookedItems() {
  console.log('fetchBookedItems function is fired.'); // Console log when the function is fired
  const messageBox = document.querySelector('#messageBoxId');

  try {
    const response = await fetch('https://6219-2a00-801-703-2b1b-f0f1-441b-b075-5c37.ngrok-free.app/booked', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Add your request data here if needed
      }),
    });
    const data = await response.json();

    if (data.success) {
      bookedItems = data.bookedItems;

      const bookingsList = document.querySelector('#bookingsListId');

      // Clear any existing content
      bookingsList.innerHTML = '';

      // Create a div to contain the list items
      const bookedItemsListDiv = document.createElement('div');
      bookedItemsListDiv.id = 'booked_items_list';

      // booked slots logic for user

      const bokadeTider = document.querySelector('#bokadeTider');

      // Loop through booked items and create list items
      bookedItems.forEach(item => {
        const listItem = document.createElement('li');
        const listItemUser = document.createElement('li');
        const text = `Date_${item.date}-Time_${item.timeSlot.map(slot => slot.split(':')[0]).join('-')}_id`;

        const textUser = `Datum: ${item.date} Tid: ${item.timeSlot.map(slot => slot.split(':')[0]).join('-')}`;

        listItem.textContent = text;
        listItem.id = text.replace(/\s+/g, '-'); // Replace spaces with dashes

        function reformatDateTime(input) {
          const match = input.match(/Tid: (\d+)(?:-(\d+))?(?:-(\d+))?/);

          if (!match) {
            return input;
          }

          const [, first, middle, last] = match.map(Number);

          let startTime, endTime;

          if (last) {
            startTime = Math.min(first, middle, last);
            endTime = Math.max(first, middle, last) + 1;
          } else if (middle) {
            startTime = first;
            endTime = middle + 1;
          } else {
            startTime = first;
            endTime = first + 1;
          }

          const formattedStartTime = `${startTime < 10 ? '0' : ''}${startTime}:00`;
          const formattedEndTime = `${endTime < 10 ? '0' : ''}${endTime}:00`;

          return input.replace(/Tid: \d+(?:-\d+)?(?:-\d+)?/, `Tid: ${formattedStartTime}-${formattedEndTime}`);
        }

        const inputString = textUser;
        const reformattedString = reformatDateTime(inputString);

        console.log(reformattedString);

        listItemUser.textContent = reformattedString;

        bookedItemsListDiv.appendChild(listItem);
        bokadeTider.appendChild(listItemUser);
      });

      // Append the div containing the list items to the parent element
      bookingsList.appendChild(bookedItemsListDiv);

      console.log('Bookings received:', bookedItems); // Console log when bookings are received successfully
    } else {
      messageBox.textContent = 'Failed to fetch booked items.';
    }
  } catch (error) {
    console.error('An error occurred:', error);
    messageBox.textContent = 'An error occurred while processing your request.';
  }
}

// Call the fetchBookedItems function 5 seconds after page load
setTimeout(fetchBookedItems, 5000);


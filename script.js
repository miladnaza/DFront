const apiUrl = 'https://dnode.onrender.com';


// Function to fetch and display ticket details
async function fetchTicketDetails() {
    const ticketNumber = document.getElementById('ticketNumber').value.trim();
    const detailsDiv = document.getElementById('ticketDetails');
    const table = document.getElementById('ticketDetailsTable');
    const tbody = table.querySelector('tbody');

    // Clear previous content
    detailsDiv.innerHTML = '';
    tbody.innerHTML = '';
    table.style.display = 'none';

    if (!ticketNumber) {
        detailsDiv.innerHTML = `<p style="color: red;">Please enter a ticket number.</p>`;
        return;
    }

    try {
        detailsDiv.innerHTML = 'Loading...'; // Show loading message

        // Fetch data from the API
        const response = await fetch(`${apiUrl}/ticket/${ticketNumber}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.length === 0) {
            detailsDiv.innerHTML = `<p>No details found for the provided ticket number.</p>`;
            return;
        }

        // Choose how to display data (as a table or div)
        const displayAsTable = true; // Change this to false to show as paragraphs instead

        if (displayAsTable) {
            // Populate table
            data.forEach(ticket => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${ticket.PASSENGER_ID}</td>
                    <td>${ticket.FLIGHT_ID}</td>
                    <td>${ticket.SEATING_CLASS}</td>
                    <td>${new Date(ticket.DEPARTURE_DATE).toISOString().split('T')[0]}</td>
                    <td>${new Date(ticket.DEPARTURE_DATE).toTimeString().split(' ')[0]}</td>
                    <td>${new Date(ticket.ARRIVAL_DATE).toISOString().split('T')[0]}</td>
                    <td>${new Date(ticket.ARRIVAL_DATE).toTimeString().split(' ')[0]}</td>
                    <td>${ticket.ORIGIN_AIRPORT} (${ticket.ORIGIN_CODE})</td>
                    <td>${ticket.DESTINATION_AIRPORT} (${ticket.DESTINATION_CODE})</td>
                    <td>${ticket.AIRPLANE}</td>
                    <td>${ticket.AIRLINE}</td>
                `;
                tbody.appendChild(row);
            });

            table.style.display = 'table';
            detailsDiv.innerHTML = ''; // Clear the loading message
        } else {
            // Populate div
            detailsDiv.innerHTML = data.map(ticket => `
                <p><strong>Passenger ID:</strong> ${ticket.PASSENGER_ID}</p>
                <p><strong>Flight ID:</strong> ${ticket.FLIGHT_ID}</p>
                <p><strong>Seating Class:</strong> ${ticket.SEATING_CLASS}</p>
                <p><strong>Departure Date:</strong> ${new Date(ticket.DEPARTURE_DATE).toLocaleString()}</p>
                <p><strong>Arrival Date:</strong> ${new Date(ticket.ARRIVAL_DATE).toLocaleString()}</p>
                <p><strong>Origin:</strong> ${ticket.ORIGIN_AIRPORT} (${ticket.ORIGIN_CODE})</p>
                <p><strong>Destination:</strong> ${ticket.DESTINATION_AIRPORT} (${ticket.DESTINATION_CODE})</p>
                <p><strong>Airplane:</strong> ${ticket.AIRPLANE}</p>
                <p><strong>Airline:</strong> ${ticket.AIRLINE}</p>
                <hr>
            `).join('');
        }
    } catch (error) {
        console.error('Error fetching ticket details:', error);
        detailsDiv.innerHTML = `<p style="color: red;">Error fetching ticket details. Please try again later.</p>`;
    }
}

// Function to fetch and display flight duration
async function fetchFlightDuration() {
    const fromLocation = document.getElementById('fromLocation').value.trim().toLowerCase();
    const toLocation = document.getElementById('toLocation').value.trim().toLowerCase();
    const resultDiv = document.getElementById('flightDurationResult');

    resultDiv.innerHTML = 'Loading...';

    try {
        // Fetch data from the API with case-insensitive parameters
        const response = await fetch(`${apiUrl}/flight-duration?from=${fromLocation}&to=${toLocation}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        if (data.duration) {
            resultDiv.innerHTML = `<p>Flight Duration: ${data.duration}</p>`;
        } else {
            resultDiv.innerHTML = '<p>No flight duration found for the given locations.</p>';
        }
    } catch (error) {
        console.error('Error fetching flight duration:', error);
        resultDiv.innerHTML = `<p style="color: red;">Error fetching flight duration. Please try again later.</p>`;
    }
}

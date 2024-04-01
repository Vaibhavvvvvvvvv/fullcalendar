$(document).ready(function () {
    // Initialize events array
    var events = JSON.parse(localStorage.getItem('events'))||[];
    var doctors = JSON.parse(localStorage.getItem('doctors')) || [];
    console.log(events)
    var calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
        initialView: 'resourceTimeGridDay',
        resources: doctors,
        events: events,
        editable: true,
        nowIndicator: true,
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        slotminTime: "08:00:00",
        slotmaxtime: "20:00:00",
        minTime: "08:00:00",
        maxTime: "20:00:00",
        displayEventTime: true,
        displayEventEnd: true,
        themeSystem: 'bootstrap',
        eventBackgroundColor: '#2ecc71',
        eventBorderColor: '#27ae60',
        eventTextColor: '#ffffff',
        eventColor: '#2ecc71',
        eventOverlap: false
    });

    calendar.render();

    // Function to change the calendar view
    function changeCalendarView(view) {
        calendar.changeView(view);
    }

    // Button click events to change calendar view
    $("#monthView").click(function () {
        changeCalendarView('dayGridMonth');
    });

    $("#weekView").click(function () {
        changeCalendarView('timeGridWeek');
    });

    $("#dayView").click(function () {
        changeCalendarView('resourceTimeGridDay');
    });

    $("#bookAppointment").click(function () {
        var formData = {
            email: $("#email").val(),
            name: $("#name").val(),
            doctor: $("#doctor").val(),
            appointmentTime: $("#appointmentTime").val()
        };
        var updatedEvents = events.filter(function (event) {
            return event.resourceId !== formData.doctor;
        });
        console.log(updatedEvents)
        updatedEvents.push({
            id: formData.doctor,
            title: formData.name,
            start: formData.appointmentTime,
            end: formData.appointmentTime,
            resourceId: formData.doctor
        });
        events = updatedEvents;
        //store events in local storage
        if (!doctors.some(doctor => doctor.id === formData.doctor)) {
            var doctorObj = {
                id: formData.doctor,
                title: "Dr. " + formData.doctor  // You may adjust this based on your doctor data
            };
            doctors.push(doctorObj);
        }

        // Store events and doctors in local storage
        localStorage.setItem('events', JSON.stringify(events));
        localStorage.setItem('doctors', JSON.stringify(doctors));

        calendar.removeAllEvents();
        calendar.addEventSource(events);
        calendar.setOption('resources', doctors);
        calendar.render();

        // show data on table
        var table = $("#user tbody");
        var rowCount = table.find("tr").length + 1;
        table.append("<tr><td>" + rowCount + "</td><td>" + formData.email + "</td><td>" + formData.name + "</td><td>" + formData.appointmentTime + "</td><td>" + formData.doctor + "</td></tr>");
        $("#appointmentForm")[0].reset();
    });

    $("#submitdr").click(a => {
        let drId = $("#drId").val()
        let drName = $("#drName").val()

        var drObj = {
            id: drId,
            title: drName
        }
        calendar.addResource(drObj)
        $("#doctor").append($('<option>', {
            value: drId,
            text: drName
        }));
    });

    // fetch drid and drname in table
    $("#submitdr").click(function () {
        var drId = $("#drId").val();
        var drName = $("#drName").val();

        // Update doctors array (if the doctor is not already in the array)
        if (!doctors.some(doctor => doctor.id === drId)) {
            var drObj = {
                id: drId,
                title: drName
            };
            doctors.push(drObj);
        }

        // Store doctors in local storage
        localStorage.setItem('doctors', JSON.stringify(doctors));

        // Update the calendar with the new doctors
        calendar.setOption('resources', doctors);
        calendar.render();

        // Append data to the drdata table
        $("#drdata tbody").append("<tr><td>" + drId + "</td><td>" + drName + "</td></tr>");
        $("#drform")[0].reset();
    });
});
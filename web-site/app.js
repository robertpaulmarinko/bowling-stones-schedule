let _scheduleData = {};

document.addEventListener('DOMContentLoaded', function () {
    loadSchedule(function (scheduleData) {
        _scheduleData = scheduleData;
        renderSchedule(scheduleData);
    });

}, false)

function renderSchedule(scheduleData) {
    const todaysDate = new Date();
    todaysDate.setHours(0, 0, 0, 0);

    let html = "<table class='table table-striped'>";

    html += "<thead><tr><td></td>";
    for (let i = 0; i < scheduleData.bowlers.length; i++) {
        html += "<th>" + scheduleData.bowlers[i] + "</th>";
    }
    html += "</tr></thead>";

    html += "<tbody>"
    for (let dateIndex = 0; dateIndex < scheduleData.schedule.length; dateIndex++) {
        var scheduleDataRow = scheduleData.schedule[dateIndex];
        var currentDate = new Date(scheduleDataRow.date);
        currentDate.setHours(0, 0, 0, 0);
        if (currentDate.getTime() >= todaysDate.getTime()) {
            html += "<tr><td>" + scheduleDataRow.date + "</td>";
            for (let bowlerIndex = 0; bowlerIndex < scheduleDataRow.bowlers.length; bowlerIndex++) {
                var id = dateIndex + "-" + bowlerIndex;
                html += "<td>";
                html += "<div class='is-bowling-checkbox'>";
                html += "<input type='checkbox' data-date='" + dateIndex + "' data-bowler='" + bowlerIndex + "' id='" + id + "'";
                if (scheduleDataRow.bowlers[bowlerIndex]) {
                    html += "checked ";
                }
                html += "/>";
                html += "<label for='" + id + "'></label>";
                html += "</div>";
                html += "</td>";
            }
            html += "</tr>";
        }
    }
    html += "</tbody>";

    html += "</table>";
    document.getElementById("schedule").innerHTML = html;

    document.querySelector('#schedule').addEventListener('change', bowlerStatusChanged);
}

function bowlerStatusChanged(event) {
    let dateIndex = event.target.dataset.date;
    let bowlerIndex = event.target.dataset.bowler;
    _scheduleData.schedule[dateIndex].bowlers[bowlerIndex] = !_scheduleData.schedule[dateIndex].bowlers[bowlerIndex];
    saveSchedule(function () {
        console.log("Schedule was saved");
    })
}

function loadSchedule(done) {
    var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            done(JSON.parse(this.responseText));
        }
    });

    xhr.open("GET", "https://nhb97x9xpc.execute-api.us-east-1.amazonaws.com/default/schedule", true);
    setRequestHeader(xhr);
    xhr.send(data);
}

function saveSchedule(done) {
    var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            done();
        }
    });

    xhr.open("POST", "https://nhb97x9xpc.execute-api.us-east-1.amazonaws.com/default/schedule", true);
    setRequestHeader(xhr);
    xhr.send(JSON.stringify(_scheduleData));
}

function setRequestHeader(xhr) {
    xhr.setRequestHeader("x-api-key", "tzjBVPxE8thDjEpc3lfv97epE4lH7Mh8Z7xfVnTh");
    xhr.setRequestHeader('Content-Type', 'application/json');
}
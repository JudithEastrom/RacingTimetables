
// Save table as CSV

document.getElementById("save").addEventListener("click", () => {

    const table = document.getElementById("racing-timetable");
    const rows = table.querySelectorAll("tr");

    const csv = [];

    rows.forEach(row => {

        const rowData = [];

        row.querySelectorAll("th, td").forEach(cell => {

            const input = cell.querySelector("input");

            rowData.push(
                input ? input.value : cell.textContent
            );

        });

        csv.push(rowData.join(","));

    });


    const link = document.createElement("a");

    link.href =
        "data:text/csv;charset=utf-8," +
        encodeURIComponent(csv.join("\n"));

    link.download = "racing-timetable.csv";

    link.click();

});



// Add row
document.getElementById("add-row").addEventListener("click", () => {

    const table = document.getElementById("racing-timetable");

    const tbody = table.querySelector("tbody");

    const row = tbody.insertRow();


    const ssCount =
        table.rows[0].cells.length - 3;


    // Position
    row.insertCell().innerHTML =
        '<input type="number" class="position" readonly>';


    // Driver
    row.insertCell().innerHTML =
        '<input type="text" class="driver-name" placeholder="Driver Name">';


    // SS stages
    for(let i = 0; i < ssCount; i++){

        row.insertCell().innerHTML =
            '<input type="text" class="ss" placeholder="m:ss.mmm">';

    }


    // End time
    const endCell = row.insertCell();

    endCell.className = "end-time";

    endCell.textContent = "0:00.000";


    attachListeners();

    updatePositions();

});



// Add column

document.getElementById("add-column").addEventListener("click", () => {

    const table = document.getElementById("racing-timetable");

    const header = table.rows[0];

    const ssCount = header.cells.length - 3;


    const th = document.createElement("th");

    th.textContent = "SS" + (ssCount + 1);


    header.insertBefore(
        th,
        header.cells[header.cells.length - 1]
    );


    for (let i = 1; i < table.rows.length; i++) {

        const row = table.rows[i];

        const td = document.createElement("td");

        td.innerHTML =
            '<input type="text" class="ss" placeholder="m:ss.mmm">';


        row.insertBefore(
            td,
            row.cells[row.cells.length - 2]
        );

    }


    attachListeners();

});



// Remove column

document.getElementById("remove-column").addEventListener("click", () => {

    const table = document.getElementById("racing-timetable");
    const header = table.rows[0];
    const ssColumns =
        table.rows[0].cells.length - 3;


    if (ssColumns <= 1) {

        alert("There needs to be at least one SS");

        return;

    }


    const removeIndex = header.cells.length - 2;


    for (const row of table.rows) {

        row.deleteCell(removeIndex);

    }


    updateTotals();

});

// Remove driver

document.getElementById("remove-row").addEventListener("click", () => {

    const table = document.getElementById("racing-timetable");
    const tbody = table.querySelector("tbody");


    if (tbody.rows.length <= 1) {

        alert("There needs to be at least one row");

        return;

    }
    tbody.deleteRow(tbody.rows.length - 1);


    updateTotals();
    updatePositions();

});

// Time conversion
// Format: m:ss.mmm

function timeToMilliseconds(time) {

    if (!time) return 0;


    const parts = time.trim().split(":");


    if (parts.length !== 2) {
        return 0;
    }


    const minutes = Number(parts[0]);


    const secondsParts =
        parts[1].split(".");


    if (secondsParts.length !== 2) {
        return 0;
    }


    const seconds = Number(secondsParts[0]);

    const milliseconds =
        Number(secondsParts[1]);


    if (
        isNaN(minutes) ||
        isNaN(seconds) ||
        isNaN(milliseconds)
    ) {
        return 0;
    }


    return (
        minutes * 60000 +
        seconds * 1000 +
        milliseconds
    );

}



function millisecondsToTime(totalMs) {


    const minutes =
        Math.floor(totalMs / 60000);


    totalMs %= 60000;


    const seconds =
        Math.floor(totalMs / 1000);


    const milliseconds =
        totalMs % 1000;


    return (
        minutes +
        ":" +
        String(seconds).padStart(2, "0") +
        "." +
        String(milliseconds).padStart(3, "0")
    );

}




// Update end times

function updateTotals() {

    const table =
        document.getElementById("racing-timetable");


    for (let i = 1; i < table.rows.length; i++) {


        const row = table.rows[i];


        let total = 0;


        row.querySelectorAll(".ss").forEach(input => {

            total += timeToMilliseconds(input.value);

        });


        row.querySelector(".end-time").textContent =
            millisecondsToTime(total);

    }

}




// Update positions

function updatePositions(){

    const table =
        document.getElementById("racing-timetable");


    const tbody =
        table.querySelector("tbody");


    const rows =
        Array.from(tbody.rows);



    rows.sort((a,b)=>{


        const timeA =
            timeToMilliseconds(
                a.querySelector(".end-time").textContent
            );


        const timeB =
            timeToMilliseconds(
                b.querySelector(".end-time").textContent
            );


        return timeA - timeB;

    });



    rows.forEach(row => tbody.appendChild(row));



    rows.forEach((row,index)=>{

        row.querySelector(".position").value =
            index + 1;

    });

}




// Input listeners

function attachListeners() {


    document.querySelectorAll(".ss").forEach(input => {


        if (input.dataset.listener) {
            return;
        }


        input.dataset.listener = "true";


        // Bereken tijdens typen
        input.addEventListener(
            "input",
            updateTotals
        );


        // Sorteer pas na klaar typen
        input.addEventListener(
            "change",
            () => {

                updateTotals();

                updatePositions();

            }
        );


    });

}



attachListeners();

updateTotals();
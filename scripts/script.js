//save as CSV
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


//add row
document.getElementById("add-row").addEventListener("click", () => {

    const table = document.getElementById("racing-timetable");

    const row = table.insertRow();

    const ssCount = table.rows[0].cells.length - 3;


    // Driver
    row.insertCell().innerHTML =
        '<input type="text">';


    // SS times
    for (let i = 0; i < ssCount; i++) {

        row.insertCell().innerHTML =
            '<input type="text" class="ss" placeholder="m:ss.mmm">';

    }


    // Position
    row.insertCell().innerHTML =
        '<input type="number" readonly>';


    // End time
    const endCell = row.insertCell();

    endCell.className = "end-time";

    endCell.textContent = "0:00.000";


    attachListeners();

});

//add column
document.getElementById("add-column").addEventListener("click", () => {

    const table = document.getElementById("racing-timetable");

    const header = table.rows[0];

    const ssCount = header.cells.length - 3;


    const th = document.createElement("th");

    th.textContent = "SS" + (ssCount + 1);


    header.insertBefore(
        th,
        header.cells[header.cells.length - 2]
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


// Removes columns
document.getElementById("remove-column").addEventListener("click", () => {

    const table = document.getElementById("racing-timetable");

    const ssColumns =
        table.rows[0].cells.length - 3;


    if (ssColumns <= 1) {

        alert("There should at least be one SS.");

        return;

    }


    const removeIndex =
        table.rows[0].cells.length - 3;


    for (const row of table.rows) {

        row.deleteCell(removeIndex);

    }


    updateTotals();

});


//time conversion
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



//update end times
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



// update positions
function updatePositions() {

    const table =
        document.getElementById("racing-timetable");


    const rows =
        Array.from(table.rows).slice(1);



    rows.sort((a, b) => {


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



    rows.forEach(row => {

        table.appendChild(row);

    });



    rows.forEach((row, index) => {

        row.cells[row.cells.length - 2]
            .querySelector("input")
            .value = index + 1;

    });

}



//input listeners
function attachListeners() {


    document.querySelectorAll(".ss").forEach(input => {


        if (input.dataset.listener) {
            return;
        }


        input.dataset.listener = "true";


        // calculate after typing
        input.addEventListener(
            "input",
            updateTotals
        );


        // sort after typing
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
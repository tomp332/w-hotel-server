// window.addEventListener('scroll', function () {
//     let windowPosition = window.scrollY > 0;
//     header.classList.toggle('active', window.scrollY > 0);
// })
//
// menu.addEventListener('click', function () {
//     header.classList.toggle('menu-open');
//
// })

async function addReservation() {
    const hotelName = document.getElementById("hotel-name").textContent
    const suiteAmountRooms = document.getElementById("suite-room-amount").value
    const regularRoomAmount = document.getElementById("regular-room-amount").value
    const checkIn = document.getElementById("checkIn").textContent
    const checkOut = document.getElementById("checkOut").textContent
    fetch('/api/reservations', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
            hotelName: hotelName,
            suiteRoomAmount: suiteAmountRooms,
            regularRoomAmount: regularRoomAmount,
            checkIn: checkIn,
            checkOut: checkOut
        })
    }).then(function (response) {
        if (response.status !== 200) {
            alert("You must be logged in")
        } else {
            window.location.href = '/reservations'
        }
    })
}

$(document).ready(function () {
    $("#logout").click(async e => {
        e.preventDefault();
        await fetch('/auth/logout', {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        }).then(function (response) {
            if (response.status === 200) {
                window.location.href = '/'
            } else {
                alert("Couldn't log user out, please try again")
            }
        })
    })

    $(".delete-buttons").click(async function () {
        if (confirm("Do you really want to delete this reservation ?")) {
            let buttonId = this.id
            console.log(buttonId)
            if (await delete_row(buttonId)) {
                // Remove the reservation if success
                $(this).parents("tr").remove();
            }
        }
    });

});

async function delete_row(btnNum) {
    let rowId = btnNum.split('-')[1]
    return await fetch('/api/reservations', {
        method: 'DELETE',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
            hotelName: document.getElementById(`hotelName-${rowId}`).textContent
        })
    }).then(function (response) {
        if (response.status !== 200) {
            alert("Error deleting reservation, please try again")
            return false
        } else {
            return true
        }
    })
}

function edit_row(btnNum) {
    document.getElementById("edit_button").style.display = "none";
    document.getElementById("save_button").style.display = "block";

    let suiteRoomAmount = document.getElementById("suiteRoomAmount-" + btnNum);
    let regularRoomAmount = document.getElementById("regularRoomAmount-" + btnNum);
    let checkIn = document.getElementById("checkIn-" + btnNum);
    let checkOut = document.getElementById("checkOut-" + btnNum);


    let suiteRoomAmount_data = suiteRoomAmount.innerHTML;
    let regularRoomAmount_data = regularRoomAmount.innerHTML;
    let checkIn_data = checkIn.innerHTML;
    let checkOut_data = checkOut.innerHTML;

    suiteRoomAmount.innerHTML = "<input type='text' id='suiteRoomAmount_text" + btnNum + "' value='" + suiteRoomAmount_data + "'>";
    regularRoomAmount.innerHTML = "<input type='text' id='regularRoomAmount_text" + btnNum + "' value='" + regularRoomAmount_data + "'>";
    checkIn.innerHTML = "<input type='text' id='checkIn_text" + btnNum + "' value='" + checkIn_data + "'>";
    checkOut.innerHTML = "<input type='text' id='checkOut_text" + btnNum + "' value='" + checkOut_data + "'>";
}

async function save_row(btnNum, reservationId) {
    let suiteRoomAmount_val = document.getElementById("suiteRoomAmount_text" + btnNum).value;
    let regularRoomAmount_val = document.getElementById("regularRoomAmount_text" + btnNum).value;
    let checkIn_val = document.getElementById("checkIn_text" + btnNum).value;
    let checkOut_val = document.getElementById("checkOut_text" + btnNum).value;

    document.getElementById("suiteRoomAmount-" + btnNum).innerHTML = suiteRoomAmount_val;
    document.getElementById("regularRoomAmount-" + btnNum).innerHTML = regularRoomAmount_val;
    document.getElementById("checkIn-" + btnNum).innerHTML = checkIn_val;
    document.getElementById("checkOut-" + btnNum).innerHTML = checkOut_val;


    document.getElementById("edit_button").style.display = "block";
    document.getElementById("save_button").style.display = "none";

    return await fetch('/api/reservations', {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
            reservationId: reservationId,
            suiteRoomAmount: suiteRoomAmount_val,
            regularRoomAmount: regularRoomAmount_val,
            checkIn: checkIn_val,
            checkOut: checkOut_val

        })
    }).then(function (response) {
        if (response.status !== 200) {
            alert("Error update reservation, please try again")
            return false
        } else {
            return true
        }
    })
}
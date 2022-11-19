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

    $(".delete-reservation-buttons").click(async function () {
        if (confirm("Do you really want to delete this reservation ?")) {
            let buttonId = this.id
            if (await delete_reservation(buttonId)) {
                // Remove the reservation if success
                $(this).parents("tr").remove();
            }
        }
    });
    $(".delete-hotel-buttons").click(async function () {
        if (confirm("Do you really want to delete this hotel ?")) {
            let buttonId = this.id
            if (await delete_hotel(buttonId)) {
                // Remove the reservation if success
                $(this).parents("tr").remove();
            }
        }
    });
    $(".delete-user-buttons").click(async function () {
        if (confirm("Do you really want to delete this user ?")) {
            let buttonId = this.id
            if (await delete_user(buttonId)) {
                // Remove the reservation if success
                $(this).parents("tr").remove();
            }
        }
    });


    $(".edit-reservation-buttons").click(async function () {
        var $tr = $(this).closest('tr');
        var myRow = $("#reservations-table tr").index($tr);
        let currentRowNumber = myRow - 1

        var suites = $(this).parents("tr").find("td:eq(5)").text()
        var standard_rooms = $(this).parents("tr").find("td:eq(6)").text()
        var checkIn = $(this).parents("tr").find("td:eq(7)").text()
        var checkOut = $(this).parents("tr").find("td:eq(8)").text()


        $(this).parents("tr").find("td:eq(5)").html("<input onkeydown='return false' type='number' min='0' max='10' class='input-reservation-"
            + currentRowNumber + "'" + "id='edit-suites' name='edit_suites' value='" + suites + "'>");
        $(this).parents("tr").find("td:eq(6)").html("<input onkeydown='return false' type='number' min='0' max='10' class='input-reservation-"
            + currentRowNumber + "'" + "id='edit-rooms' name='edit_standard_rooms' value='" + standard_rooms + "'>");
        $(this).parents("tr").find("td:eq(7)").html("<input type='date'  type='number' min='0' class='input-reservation-"
            + currentRowNumber + "'" + "id='edit-checkIn' name='edit-checkIn' value='" + checkIn + "'>");
        $(this).parents("tr").find("td:eq(8)").html("<input type='date' class='input-reservation-"
            + currentRowNumber + "'" + "id='edit-checkOut' name='edit-checkOut' value='" + checkOut + "'>");

        $(this).parents("tr").find("td:eq(9)").prepend("<input type='button' value='Save' class='button update-reservation-buttons'/>")
        $(this).hide();

    });

    $(".edit-hotel-buttons").click(async function () {

    });

    $(".edit-user-buttons").click(async function () {

    });
});

$("main").on("click", ".update-reservation-buttons", async function () {
    if (confirm("Are you sure you want to update this reservation?")) {
        var $tr = $(this).closest('tr');
        var myRow = $("#reservations-table tr").index($tr);
        let currentRowNumber = myRow - 1
        let reservationId = $(`#0reservationId-${currentRowNumber}`).text()

        let suitesVal = $("#edit-suites").val()
        let standardRoomsVal = $("#edit-rooms").val()
        let checkInVal = $("#edit-checkIn").val()
        let checkOutVal = $("#edit-checkOut").val()


        // Send data to DB
        if(await edit_reservation(reservationId, suitesVal,standardRoomsVal,checkInVal,checkOutVal)){
            $(`.input-reservation-${currentRowNumber}`).remove()
            $(this).parents("tr").find("td:eq(5)").text(suitesVal)
            $(this).parents("tr").find("td:eq(6)").text(standardRoomsVal)
            $(this).parents("tr").find("td:eq(7)").text(checkInVal)
            $(this).parents("tr").find("td:eq(8)").text(checkOutVal)
            // Bring back the edit button
            $(this).remove()
            $(`#edit-reservation-buttons-${currentRowNumber}`).show();
        }

    }
})


async function delete_reservation(btnNum) {
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
            hotelName: document.getElementById(`0hotelName-${rowId}`).textContent
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

async function delete_user(btnNum) {
    let rowId = btnNum.split('-')[1]
    return await fetch('/api/user', {
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
            userId: document.getElementById(`2userId-${rowId}`).textContent
        })
    }).then(function (response) {
        if (response.status !== 200) {
            alert("Error deleting user, please try again")
            return false
        } else {
            return true
        }
    })
}

async function delete_hotel(btnNum) {
    let rowId = btnNum.split('-')[1]
    return await fetch('/api/hotels', {
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
            alert("Error deleting hotel, please try again")
            return false
        } else {
            return true
        }
    })
}

async function edit_reservation(reservationId, suites, standardRooms, checkIn, checkOut) {
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
            suiteRoomAmount: suites,
            regularRoomAmount: standardRooms,
            checkIn: checkIn,
            checkOut: checkOut
        })
    }).then(function (response) {
        if (response.status !== 200) {
            alert("Error updating reservation, please try again")
            return false
        } else {
            return true
        }
    })
}


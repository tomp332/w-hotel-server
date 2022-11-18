//Selectors


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
            if (await delete_row(buttonId)) {
                // Remove the reservation if success
                $(this).parents("tr").remove();
            }
        }
    });

});

async function delete_row(buttonId) {
    let rowId = buttonId.split('-')[1]
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

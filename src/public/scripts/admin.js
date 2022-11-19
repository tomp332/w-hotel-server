//Selectors

let header = document.querySelector('.header');
let hamburgerMenu = document.querySelector('.hamburger-menu');

window.addEventListener('scroll', function () {
    let windowPosition = window.scrollY > 0;
    header.classList.toggle('active', window.scrollY > 0);
})

hamburgerMenu.addEventListener('click', function () {
    header.classList.toggle('menu-open');

})


async function getHotels() {
    const hotels = await fetch('/api/hotels', {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    }).then((response) => response.json())
        .then((data) => {
            return data
        })
    return hotels

}


// Generate google map
async function initMap() {
    const hotels = await getHotels()
    // Init for map
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 3,
        center: {lat: 32.0853, lng: 34.7818},
    });

    for (const hotel of hotels) {
        const contentString = "<h3>" + hotel.hotelName + "</h3>"


        let marker = new google.maps.Marker({
            position: hotel.location,
            map,
            title: "Main marker",
        })
        let infoWindow = new google.maps.InfoWindow({
            content: contentString
        });
        marker.addListener('click', function () {
            infoWindow.open(map, marker);
        });

    }
}

window.initMap = initMap;

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
            hotelName: document.getElementById(`hotelName-${btnNum}`).textContent
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

function edit_row(btnNum)
{
    document.getElementById("edit_button").style.display="none";
    document.getElementById("save_button").style.display="block";

    let suiteRoomAmount=document.getElementById("suiteRoomAmount-"+btnNum);
    let regularRoomAmount=document.getElementById("regularRoomAmount-"+btnNum);
    let checkIn=document.getElementById("checkIn-"+btnNum);
    let checkOut=document.getElementById("checkOut-"+btnNum);


    let suiteRoomAmount_data=suiteRoomAmount.innerHTML;
    let regularRoomAmount_data=regularRoomAmount.innerHTML;
    let checkIn_data=checkIn.innerHTML;
    let checkOut_data=checkOut.innerHTML;

    suiteRoomAmount.innerHTML="<input type='text' id='suiteRoomAmount_text"+btnNum+"' value='"+suiteRoomAmount_data+"'>";
    regularRoomAmount.innerHTML="<input type='text' id='regularRoomAmount_text"+btnNum+"' value='"+regularRoomAmount_data+"'>";
    checkIn.innerHTML="<input type='text' id='checkIn_text"+btnNum+"' value='"+checkIn_data+"'>";
    checkOut.innerHTML="<input type='text' id='checkOut_text"+btnNum+"' value='"+checkOut_data+"'>";
}


async function save_row(btnNum, reservationId)
{
    let suiteRoomAmount_val=document.getElementById("suiteRoomAmount_text"+btnNum).value;
    let regularRoomAmount_val=document.getElementById("regularRoomAmount_text"+btnNum).value;
    let checkIn_val=document.getElementById("checkIn_text"+btnNum).value;
    let checkOut_val=document.getElementById("checkOut_text"+btnNum).value;

    document.getElementById("suiteRoomAmount-"+btnNum).innerHTML=suiteRoomAmount_val;
    document.getElementById("regularRoomAmount-"+btnNum).innerHTML=regularRoomAmount_val;
    document.getElementById("checkIn-"+btnNum).innerHTML=checkIn_val;
    document.getElementById("checkOut-"+btnNum).innerHTML=checkOut_val;


    document.getElementById("edit_button").style.display="block";
    document.getElementById("save_button").style.display="none";

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


function searchFunc(){
    // Declare variables
    let input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("admin__search");
    filter = input.value.toUpperCase();
    table = document.getElementById("reservations-table");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

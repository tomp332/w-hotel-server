async function addReservation(){
    return await fetch('/api/reservations', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
    }).then((response) => response.json())
        .then((data) => {
            return data
        })
}
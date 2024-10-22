// put get all rooms in use context
async function GetAllRooms() {
    const url = "/api/rooms/";
    const response = await fetch(url);
    let rooms = [];
    if (response.ok) {
        rooms = await response.json();
    } else {
        return await response.text();
    }
    return rooms;
}

export default GetAllRooms;
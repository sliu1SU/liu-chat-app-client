
async function GetCurUser() {
    //console.log("GetCurUser is called")
    const url = "/api/user";
    const response = await fetch(url);
    let user = null;
    if (response.ok) {
        user = await response.json();
    }
    return user;
}

export default GetCurUser;
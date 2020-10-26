const apiUrl = "http://localhost:3000/users";

export async function apiLoadData() {
    const response = await fetch(apiUrl);
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        return Promise.reject('something went wrong!')
    }
}

export async function apiAddUser(name, surname, email) {
    const response = await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify({
            first_name : name,
            last_name: surname,
            email : email
        }),
        headers: {
            "Content-Type" : "application/json;charset=utf-8"
        }
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        return Promise.reject('something went wrong!')
    }
}

export async function apiDeleteUser(id) {
    const response = await fetch(apiUrl + '/' + id, {
        method: "DELETE"
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        return Promise.reject('something went wrong!')
    }
}

export async function apiUpdateUser({id, name, surname, email}) {
    const response = await fetch(apiUrl + '/' + id, {
        method: "PATCH",
        body: JSON.stringify({ //takie sa klucze w bazie
            first_name: name,
            last_name: surname,
            email: email
        }),
        headers: {
            "Content-Type" : "application/json"
        }
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        return Promise.reject('something went wrong!')
    }
}
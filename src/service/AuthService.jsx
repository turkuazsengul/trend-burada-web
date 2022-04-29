import axios from "axios";

export const BASE_URL = 'http://localhost:40000/api/v1/user';

const login = async (username, password) => {

    let response = await axios.post(BASE_URL + `/auth/login`, {}, {
        auth: {
            username: username,
            password: password
        }
    })

    if (response.data) {
        localStorage.setItem("token", JSON.stringify(response.config.headers.Authorization));
        localStorage.setItem("user", JSON.stringify(response.data.returnData));
    }
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const getBearerToken = () => {
    return JSON.parse(localStorage.getItem("token"));
};

const checkRole = (role) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData.roleList.find(a => a.name === role) ? true : false
}

const revokeCurrentToken = () => {

    return axios.post(BASE_URL + `/auth/logout`, {
        headers: {'Authorization': getBearerToken()}
    }).then(response => {
        localStorage.clear()
    }).catch((error) => {
        console.log('error ' + error);
    });
}

export default {
    login,
    getCurrentUser,
    getBearerToken,
    checkRole,
    revokeCurrentToken
};

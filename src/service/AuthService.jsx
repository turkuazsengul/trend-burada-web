import axios from "axios";
import {KEYCLOAK_CLIENT_ID, KEYCLOAK_GRANT_TYPE, KEYCLOAK_TOKEN_URL, LOGIN_URL, LOGOUT_URL} from "../constants/UrlConstans";

// const login = (username, password) => {
//     const formData = new URLSearchParams();
//     formData.append('client_id', KEYCLOAK_CLIENT_ID);
//     formData.append('grant_type', KEYCLOAK_GRANT_TYPE);
//     formData.append('username', username);
//     formData.append('password', password);
//
//     return axios.post(KEYCLOAK_TOKEN_URL, formData, {
//         headers: {'Content-Type': 'application/x-www-form-urlencoded'}
//     });
// };

const login = (username, password) => {
    const credentials = `${username}:${password}`;
    const base64EncodedCredentials = btoa(credentials);

    return axios.post(LOGIN_URL, {}, {
        headers: {
            'Authorization': `Basic ${base64EncodedCredentials}`
        }
    });
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const getBearerToken = () => {
    return JSON.parse(localStorage.getItem("token"));
};

const checkRole = (role) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return !!userData.roleList.find(a => a.name === role)
}

// const revokeCurrentToken = () => {
//     const token = localStorage.getItem("token")
//     console.log(KEYCLOAK_LOGOUT_URL)
//     return axios.post(KEYCLOAK_LOGOUT_URL, {}, {
//         headers: {'Authorization': `Bearer ${token}`}
//     })
// }

const logout = (userId) => {
    const token = localStorage.getItem("token")
    console.log(userId)
    return axios.post(LOGOUT_URL, {userId:userId}, {
        headers: {'Authorization': `Bearer ${token}`}
    });
}

export default {
    login,
    getCurrentUser,
    getBearerToken,
    checkRole,
    logout
};

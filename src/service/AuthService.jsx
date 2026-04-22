import axios from "axios";
import {ACCOUNT_STATUS_URL, LOGIN_URL, LOGOUT_URL} from "../constants/UrlConstans";

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

const lookupAccountStatus = (email) => {
    return axios.get(ACCOUNT_STATUS_URL, {
        params: {email}
    }).then((response) => {
        return response?.data?.returnData?.[0];
    });
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const getBearerToken = () => {
    return localStorage.getItem("token");
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
    return axios.post(LOGOUT_URL, {userId:userId}, {
        headers: {'Authorization': `Bearer ${token}`}
    });
}

export default {
    lookupAccountStatus,
    login,
    getCurrentUser,
    getBearerToken,
    checkRole,
    logout
};

import axios from "axios";

export const BASE_URL = 'http://localhost:40000/api/v1/user';

const register = (data) => {

    return axios.post(BASE_URL + `/auth/register`, data).then(
        response => {
            return response;
        }
    ).catch((error) => {
        console.log('error ' + error)
        return 11;
    });

};

const confirm = (userId, confirmCode) => {
    return axios.post(BASE_URL + `/auth/confirm`,{},
        {params: {userId, confirmCode}}
    ).then(
        response => {
            return response;
        }
    ).catch((error) => {
        console.log('error ' + error)
        return 11;
    });
};

export default {
    register,
    confirm
};

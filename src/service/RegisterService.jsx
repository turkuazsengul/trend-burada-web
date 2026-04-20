import axios from "axios";
import {REGISTER_URL, REGISTER_CONFIRM_URL, REGISTER_CREATE_CONFIRM_URL} from "../constants/UrlConstans";

const register = (data) => {
    return axios.post(REGISTER_URL, data).then(
        response => {
            return response;
        }
    ).catch((error) => {
        console.log('error ' + error)
        return 11;
    });
};

const confirm = (userId, confirmCode) => {
    return axios.post(REGISTER_CONFIRM_URL, {},
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

const createConfirm = (userId) => {
    return axios.post(REGISTER_CREATE_CONFIRM_URL, {},
        {params: {userId}}
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
    confirm,
    createConfirm,
};

import axios from "axios";
import {USER_INFO_URL, USER_UPDATE_URL} from "../constants/UrlConstans";

const getUser =  (token) => {
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    return axios.get(USER_INFO_URL, {headers}).then((r)=>{
        return r.data.returnData[0]
    })
};

const updateUser =  (user) => {
    const token = localStorage.getItem("token")
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    return axios.put(USER_UPDATE_URL, user,{headers}).then((r)=>{
        return r.data.returnData[0]
    })

};

export default {
    getUser,
    updateUser,
};

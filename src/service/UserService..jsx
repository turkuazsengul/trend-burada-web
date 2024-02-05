import axios from "axios";
import {USER_INFO_URL} from "../constants/UrlConstans";

const getUser =  (token) => {
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    return axios.get(USER_INFO_URL, {headers}).then((r)=>{
        return r.data.returnData[0]
    })
};

export default {
    getUser,
};

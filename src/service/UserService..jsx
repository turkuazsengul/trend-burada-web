import axios from "axios";
import {USER_INFO_URL} from "../constants/UrlConstans";
import {BASE_URL} from "./AuthService";


const getUser = async () => {
    const token = localStorage.getItem("token");
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    let response = await axios.get(USER_INFO_URL, {headers})
        .then(response => {
            console.log(response.data)
            return response.data;
        }).catch((error) => {
            console.log('error ' + error);
        });
};

export default {
    getUser,
};

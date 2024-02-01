import axios from "axios";
import {USER_INFO_URL} from "../constants/UrlConstans";

const getUser =  (token) => {
    // const token = localStorage.getItem("token");
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    return  axios.get(USER_INFO_URL, {headers})
        // .then(response => {
        //     console.log(response.data)
        //     return response.data;
        // }).catch((error) => {
        //     if (error.response.status === 401){
        //         debugger;
        //         localStorage.removeItem("token");
        //         history.push("/login");
        //         window.location.reload()
        //     }
        //     console.log('error ' + error);
        // });
};

export default {
    getUser,
};

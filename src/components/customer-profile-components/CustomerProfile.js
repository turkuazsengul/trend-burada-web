import React from 'react';
import UserService from "../../service/UserService.";

export const CustomerProfile = () => {

    const getUserInfo = () => {
        // const response = UserService.getUser();
        // console.log(response)
    }

    const userPage = () => {
        if (localStorage.getItem("token")) {

            return <div>
                <h5>{getUserInfo()}</h5>
            </div>

        } else {
            return <h5>Login olunamadı</h5>
        }
    }

    return (
        <div>
            {userPage()}
        </div>
    )
}

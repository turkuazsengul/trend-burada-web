import React from 'react';

export const CustomerProfile = () => {

    const test = () =>{
        if(localStorage.getItem("token")){
           return <h5>{localStorage.getItem("user")}</h5>
        }else{
           return <h5>Login olunamadı</h5>
        }
    }

    return (
        <div>
            {test()}
        </div>
    )
}

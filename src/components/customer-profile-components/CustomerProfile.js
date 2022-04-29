import React, {useRef, useState, useEffect} from 'react';
import {Carousel} from 'primereact/carousel';
import {CampaignItems} from "../home-page-components/CampaignItems";
import AppContext from "../../AppContext";
import AuthService from "../../service/AuthService";

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

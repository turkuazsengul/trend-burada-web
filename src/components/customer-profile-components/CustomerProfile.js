import React, {useEffect, useState} from 'react';
import UserService from "../../service/UserService.";
import {Route, useHistory} from "react-router-dom";
import MyOrderComp from "./MyOrderComp";
import MyUserInfo from "./MyUserInfo";
import '../../css/customer-profile.css'


export const CustomerProfile = () => {
    const history = useHistory();
    const [user, setUser] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [activeComponent, setActiveComponent] = useState(null);

    // useEffect(() => {
    //     UserService.getUser().then(response => {
    //         setUser(response.data.returnData[0])
    //     }).catch((error) => {
    //         console.error('Error fetching data:', error);
    //         if (error.response.status === 401) {
    //             localStorage.removeItem("token");
    //             history.push("/login");
    //             window.location.reload()
    //         }
    //     })
    //
    // }, []);


    const handleHover = () => {
        setIsHovered(!isHovered);
    };

    const handleClick = () => {
        setIsClicked(!isClicked);
    };

    const handleToggle = (componentKey) => {
        setActiveComponent(componentKey);
    };

    return (
        <div className="catalog">
            <div className="container-items">
                <div className="my-account-page">

                    <div className="navigation-column">
                        <div className="navi-row">
                            <label>{user.name}</label>
                        </div>

                        <div className="navi-row">
                            <label>Siparişlerim</label>
                            <hr/>
                            <a href="/hesabım/siparişlerim" onClick={() => handleToggle('AllOrderComponent')}>
                                <div className={`navi-item ${isHovered ? 'hovered' : ''} ${isClicked ? 'clicked' : ''}`} onClick={handleClick} onMouseEnter={handleHover} onMouseLeave={handleHover}>
                                    <i className="pi pi-box" style={{color: '#708090'}}></i>
                                    <span>Tüm Siparişlerim</span>
                                </div>
                            </a>

                            <a href="#" onClick={() => handleToggle('AllOrderComponent')}>
                                <div className={`navi-item ${isHovered ? 'hovered' : ''} ${isClicked ? 'clicked' : ''}`} onClick={handleClick} onMouseEnter={handleHover} onMouseLeave={handleHover}>
                                    <i className="pi pi-inbox" style={{color: '#708090'}}></i>
                                    <span>Satıcı Mesajları</span>
                                </div>
                            </a>

                        </div>

                        <div className="navi-row">
                            <span>TEST</span>
                            <div className="personel-box">

                            </div>
                        </div>

                        <a href="#" onClick={() => handleToggle('UserAccountComponent')}>
                            <div className={`navi-row ${isHovered ? 'hovered' : ''} ${isClicked ? 'clicked' : ''}`} onClick={handleClick} onMouseEnter={handleHover} onMouseLeave={handleHover}>
                                <div className="">
                                    TEST-ACCOUNT
                                </div>
                            </div>
                        </a>

                    </div>

                    <div className="process-column">
                        {/*<AllOrderComponent*/}
                        {/*    user={user}*/}
                        {/*    isActive={activeComponent === 'AllOrderComponent'}*/}
                        {/*/>*/}
                        {/*<UserAccountComponent*/}
                        {/*    user={user}*/}
                        {/*    isActive={activeComponent === 'UserAccountComponent'}*/}
                        {/*/>*/}
                    </div>

                </div>
            </div>
        </div>
    )
}

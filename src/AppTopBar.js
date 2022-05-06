import React from 'react';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Badge} from 'primereact/badge';
import {useHistory} from "react-router-dom";
import {Tooltip} from 'primereact/tooltip';
import './css/ToolTipDemo.css'
import AuthService from "./service/AuthService";
import 'primeicons/primeicons.css';

export const AppTopBar = () => {
    const history = useHistory();

    const topMenuItems = [
        {
            id: 1,
            value: "Kampanyalar",
            to: "/",
        },
        {
            id: 2,
            value: "Siparişlerim",
            to: "/login",
        },
        {
            id: 3,
            value: "Hakkımızda",
            to: "/",
        },
        {
            id: 4,
            value: "Yeni Sezon Ürünleri",
            to: "/",
        },
    ]

    const profileToolItem = [
        {
            id: 1,
            value: "Hesabım",
            icon: "pi pi-user",
            to: "/profile",
        },
        {
            id: 2,
            value: "Siparişlerim",
            icon: "pi pi-box",
            to: "/login",
        },
        {
            id: 3,
            value: "Adreslerim",
            icon: "pi pi-map",
            to: "/adress",
        },
    ]

    const categoryHeaderData = [
        {
            id: 1,
            value: "Kadın",
        },
        {
            id: 1,
            value: "Erkek"
        },
        {
            id: 1,
            value: "Çocuk",
        },
        {
            id: 1,
            value: "Spor & Eğlence",
        },
        {
            id: 1,
            value: "Yapı Malzemeleri & Aksesuar",
        },

    ]

    const clickLoginButton = () => {
        if (!localStorage.getItem("token")) {
            history.push("/login")
        } else {
            history.push("/profile")
        }
    }

    const clickBoxButton = () => {
        localStorage.clear();
    }

    const topMenuItemBody = () => {

        const topMenuItemBodyList = topMenuItems.map((x) => {
            return (
                <a href={x.to}>{x.value}</a>
            )
        })
        return topMenuItemBodyList
    }

    const categoryHeaderBody = () => {
        const categoryHeaderBodyList = categoryHeaderData.map((x) => {
            return (
                <div className="menu-bar">
                    <nav>
                        <a href="">{x.value}</a>
                    </nav>
                </div>
            )
        })
        return categoryHeaderBodyList
    }

    const getLoginButtonLabel = () => {
        if (localStorage.getItem("token")) {
            return (
                <Button
                    onClick={clickLoginButton}
                    icon="pi pi-user"
                    label={"Hesabım"}
                    className="session-in top-bar-login-button p-button-text top-bar-button p-button-secondary p-button-outlined mr-3 mb-2"
                />
            )
        } else {
            return (
                <Button
                    onClick={clickLoginButton}
                    icon="pi pi-user"
                    label={"Giriş Yap"}
                    className="session-out top-bar-login-button p-button-text top-bar-button p-button-secondary p-button-outlined mr-3 mb-2"
                />
            )
        }
    }

    const profileActionList = () => {
        debugger;
        if (localStorage.getItem("token")) {
            const profileMenuItems = profileToolItem.map((x) => {
                return (
                    <div className="content">
                        <a className={x.icon}/>
                        <a href={x.to}>{x.value}</a>
                    </div>
                )
            })
            return profileMenuItems
        }
    }

    const logoutButtonBody = () => {
        if (localStorage.getItem("token")) {
            return (
                <div className="content">
                    <a className="pi pi-sign-out"/>
                    <a onClick={logOutClick} href="/">{"Çıkış Yap"}</a>
                </div>
            )
        } else {
            return null;
        }
    }

    const logOutClick = () => {
        AuthService.revokeCurrentToken();
        localStorage.clear();
    }

    const tooltipBody = {
        backgroundColor: '#ffffff',
        textAlign: "center",
    }

    return (
        <div className="top-bar">
            <div className="top-bar-items">
                <div className="top-menu">
                    <ul>
                        {topMenuItemBody()}
                    </ul>
                </div>
                <div className="top-bar-item">
                    <div className="top-bar-search">
                        <div className="top-bar-logo">
                            <span>TREND BURADA</span>
                        </div>
                        <div>
                            <div className="col-12 md:col-4">
                                <div className="p-inputgroup" style={{height: '4.5rem', marginTop: '2rem'}}>
                                    <InputText placeholder="Dilediğinizi Arayın"/>
                                    <Button icon="pi pi-search" className="p-button-secondary p-button-text"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="test">
                        {getLoginButtonLabel()}
                        <Tooltip target=".session-in" position={"bottom"} style={tooltipBody} autoHide={false}>
                            <div className="tool-tip-item">
                                {profileActionList()}
                                {logoutButtonBody()}
                            </div>
                        </Tooltip>
                    </div>
                    <div>
                        <Button className="top-bar-button p-button-secondary p-button-text" icon="pi pi-shopping-cart" onClick={clickBoxButton} label="Sepetim">
                            <i className="mr-4 p-overlay-badge" style={{marginLeft: '1.5rem'}}>
                                <Badge value="2" severity="info" className="p-badge-lg"/>
                            </i>
                        </Button>
                    </div>

                </div>
                <div className="tab-menu-category">
                    {categoryHeaderBody()}
                </div>
            </div>

            <div className="hr-style">

            </div>

            <div className="profile-toogle-menu">

            </div>
        </div>
    )
}

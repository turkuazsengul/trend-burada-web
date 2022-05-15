import React, {useContext, useEffect, useState} from 'react';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Badge} from 'primereact/badge';
import {useHistory} from "react-router-dom";
import {Tooltip} from 'primereact/tooltip';
import './css/ToolTipDemo.css'
import AuthService from "./service/AuthService";
import 'primeicons/primeicons.css';
import AppContext from "./AppContext";
import CategoryService from "./service/CategoryService";
import {MenuTool} from "./components/MenuTool";

export const AppTopBar = () => {
    const history = useHistory();
    const myContext = useContext(AppContext)

    const [categoryHeaderData, setCategoryHeaderData] = useState([]);
    const [categoryMenuVisible, setCategoryMenuVisible] = useState("hidden");

    useEffect(() => {
        CategoryService.getCategory().then(response => {
            setCategoryHeaderData(response);
        })
    },[]);

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
            name: "Hesabım",
            icon: "pi pi-user",
            to: "/profile",
        },
        {
            id: 2,
            name: "Siparişlerim",
            icon: "pi pi-box",
            to: "/login",
        },
        {
            id: 3,
            name: "Adreslerim",
            icon: "pi pi-map",
            to: "/adress",
        },
    ]

    // const categoryHeaderDataMock = [
    //     {
    //         id: 1,
    //         name: "Kadın",
    //         order: 1
    //     },
    //     {
    //         id: 2,
    //         name: "Erkek",
    //         order: 2
    //     },
    //     {
    //         id: 3,
    //         name: "Çocuk",
    //         order: 3
    //     },
    //     {
    //         id: 4,
    //         name: "Spor & Eğlence",
    //         order: 4
    //     },
    //     {
    //         id: 5,
    //         name: "Yapı Malzemeleri & Aksesuar",
    //         order: 5
    //     },
    //
    // ]

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
        return topMenuItems.map((x) => {
            return (
                <a key={x.id} href={x.to}>{x.value}</a>
            )
        })
    }

    const categoryHeaderBody = () => {
        categoryHeaderData.sort((a, b) => a.sortOrder - b.sortOrder)
        return categoryHeaderData.map((x) => {
            return (
                <div key={x.id} className="menu-bar">
                    <nav>
                        <a id="test"
                           onMouseOutCapture={(e) => {
                               onFocusCategory(x)
                           }}
                           // onMouseLeave={setCategoryMenuVisible("hidden")}
                           href={"/product/" + x.name.toLowerCase()}>{x.name}</a>
                    </nav>
                </div>
            )
        })
    }

    const onFocusCategory = (headerData) => {
        // const list = headerData.filter(x => x.name.toLowerCase() === e.target.text.toLowerCase())
        // const list = categoryHeaderData.filter(x => x.name.toLowerCase() === e.target.text.toLowerCase())
        console.log(headerData)
        setCategoryMenuVisible("visibility");
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
        if (localStorage.getItem("token")) {
            return profileToolItem.map((x) => {
                return (
                    <div className="content">
                        <a className={x.icon}/>
                        <a href={x.to}>{x.name}</a>
                    </div>
                )
            })
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

    const tooltipBodyCategory = {
        backgroundColor: '#ffffff',
        textAlign: "left",
        width: '130rem',
        marginTop: '-1rem',
        // marginRight:'15%',
        borderRadius: '0px',
    }

    const toolTipMenuStyle = {
        visible: 'hidden'
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
                            <span><a href="/">TREND BURADA</a></span>
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

                    <div>
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
                                <Badge value={myContext.orderCount} severity="info" className="p-badge-lg"/>
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

            {/*<div className="tooltip-area">*/}
            {/*    <div id="tooltip" className="profile-toogle-menu" hidden={false}>*/}

            {/*    </div>*/}
            {/*</div>*/}


            {/*<div className="category-tooltip">*/}
            {/*    <Tooltip className="tooltip-body-category" target=".tab-menu-category" position={"bottom"} autoHide={false}>*/}
            {/*        <div className="tool-tip-item-category">*/}
            {/*            {profileActionList()}*/}
            {/*            {logoutButtonBody()}*/}
            {/*        </div>*/}
            {/*    </Tooltip>*/}
            {/*</div>*/}

        </div>
    )
}

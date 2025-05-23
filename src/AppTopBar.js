import React, {useContext, useEffect, useState} from 'react';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Badge} from 'primereact/badge';
import {useHistory} from "react-router-dom";
import {Tooltip} from 'primereact/tooltip';
import './css/ToolTipDemo.css'
import 'primeicons/primeicons.css';
import AppContext from "./AppContext";

export const AppTopBar = () => {
    const history = useHistory();
    const myContext = useContext(AppContext)

    const [userFullName, setUserFullName] = useState("");
    const [categoryHeaderData, setCategoryHeaderData] = useState([]);
    const [categoryMenuVisible, setCategoryMenuVisible] = useState("hidden");

    useEffect(() => {
        if(localStorage.getItem("token")){
            const storedUserStr = localStorage.getItem("user");
            const user = JSON.parse(storedUserStr);

            setUserFullName(user.name + ' ' + user.surname)
        }
        setCategoryHeaderData(categoryHeaderDataMock);
    }, []);

    const topMenuItems = [
        {
            id: 1,
            value: "Kampanyalar",
            to: "/",
        },
        {
            id: 2,
            value: "Siparişlerim",
            to: "/hesabım/Siparislerim",
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
            to: "/hesabım/KullaniciBilgilerim",
        },
        {
            id: 2,
            name: "Siparişlerim",
            icon: "pi pi-box",
            to: "/hesabım/Siparislerim",
        },
        {
            id: 3,
            name: "Adreslerim",
            icon: "pi pi-map",
            to: "/adress",
        },
        {
            id: 4,
            name: "Değerlendirmelerim",
            icon: "pi pi-comment",
            to: "/adress",
        },
        {
            id: 5,
            name: "Satıcı Mesajlarım",
            icon: "pi pi-envelope",
            to: "/adress",
        },
    ]

    const categoryHeaderDataMock = [
        {
            id: 1,
            name: "Kadın",
            order: 1
        },
        {
            id: 2,
            name: "Erkek",
            order: 2
        },
        {
            id: 3,
            name: "Çocuk",
            order: 3
        },
        {
            id: 4,
            name: "Spor & Eğlence",
            order: 4
        },
        {
            id: 5,
            name: "Yapı Malzemeleri & Aksesuar",
            order: 5
        },
        {
            id: 6,
            name: "Kozmetik",
            order: 6
        },
        {
            id: 7,
            name: "Elektronik",
            order: 7
        },
        {
            id: 8,
            name: "Anne & Çocuk",
            order: 8
        },
        {
            id: 9,
            name: "Ev & Yaşam",
            order: 9
        },
        {
            id: 10,
            name: "Çok Satanlar",
            order: 10
        },

    ]

    const clickLoginButton = () => {
        if (!localStorage.getItem("token")) {
            history.push("/login")
        } else {
            history.push("/hesabım/KullaniciBilgilerim")
        }
    }

    const clickBoxButton = () => {
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
        const token = localStorage.getItem("token")
        if (token) {
            return profileToolItem.map((x) => {
                return (
                    <div className="content">
                        <a className={x.icon} style={{fontWeight:"bold"}}/>
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
                    <a className="pi pi-sign-out" style={{fontWeight:"bold"}}/>
                    <a onClick={logOutClick} href="/">{"Çıkış Yap"}</a>
                </div>
            )
        } else {
            return null;
        }
    }

    const logOutClick = () => {
        localStorage.clear();
        window.location.reload();
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
                                <div className="content-item">
                                    <div className="content-header">{userFullName}<hr/></div>
                                    {profileActionList()}
                                    {logoutButtonBody()}
                                </div>
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

        </div>
    )
}

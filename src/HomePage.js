import React, {useState} from 'react';
import {AppTopBar} from "./AppTopBar";
import {AppFooter} from "./AppFooter";
import AppContext from "./AppContext";
import {CampaignItems} from "./components/home-page-components/CampaignItems";
import {Route, Switch} from "react-router-dom";
import {LoginPage} from "./components/login-register-page-components/LoginPage";

import "./css/publicPage.css"
import "./css/topBar.css"
import "./css/footer.css"
import "./css/campaignItem.css"
import "./css/login.css"
import './css/dialog.css'
import './css/register-confirm.css'
import './css/product.css'
import {AuthenticatedRoute} from "./AuthenticatedRoute";
import {ProductPage} from "./components/product-components/ProductPage";
import {ProductDetail} from "./components/product-components/ProductDetail";
import MyOrderComp from "./components/customer-profile-components/MyOrderComp";
import UserDetailComp from "./components/customer-profile-components/MyUserInfo";
import MyUserInfo from "./components/customer-profile-components/MyUserInfo";
import AllOrderComp from "./components/customer-profile-components/MyOrderComp";
import {PrimeReactProvider} from "primereact/api";


export const HomePage = () => {
    const [component, setComponent] = useState(<CampaignItems/>);
    const [orderCount, setOrderCount] = useState(0);
    const [authenticated, setAuthenticated] = useState();
    const [timer, setTimer] = useState(null);

    const userSettings = {
        component: component,
        orderCount: orderCount,
        timer: timer,
        authenticated: authenticated,
        setOrderCount,
        setComponent,
        setAuthenticated,
        setTimer,
    };

    return (
        <div className="home-layout">
            <PrimeReactProvider>
                <AppContext.Provider value={userSettings}>
                    <AppTopBar/>
                    <div className="container-items">
                        <div className="container">
                            <Switch>
                                <Route path="/" exact component={CampaignItems}/>
                                <Route path="/login" exact component={LoginPage}/>
                                <Route path="/product/:id" exact component={ProductPage}/>
                                <Route path="/detail/:id" exact component={ProductDetail}/>
                                <AuthenticatedRoute key="profile" exact path="/hesabım/KullaniciBilgilerim" component={MyUserInfo}/>
                                <AuthenticatedRoute key="order" exact path="/hesabım/Siparislerim" component={AllOrderComp}/>
                            </Switch>
                        </div>
                    </div>
                    <AppFooter/>
                </AppContext.Provider>
            </PrimeReactProvider>

        </div>
    );
}

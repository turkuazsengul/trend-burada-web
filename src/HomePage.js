import React, {useState} from 'react';
import {AppTopBar} from "./AppTopBar";
import {AppFooter} from "./AppFooter";
import AppContext from "./AppContext";
import {CampaignItems} from "./components/home-page-components/CampaignItems";
import {Route, Switch} from "react-router-dom";
import {LoginPage} from "./components/login-register-page-components/LoginPage";
import {CustomerProfile} from "./components/customer-profile-components/CustomerProfile";

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


export const HomePage = () => {
    const [component, setComponent] = useState(<CampaignItems/>);
    const [orderCount, setOrderCount] = useState(0);
    const [timer, setTimer] = useState(null);

    const userSettings = {
        component: component,
        orderCount: orderCount,
        timer:timer,
        setOrderCount,
        setComponent,
        setTimer,
    };

    return (
        <div className="home-layout">
            <AppContext.Provider value={userSettings}>
                <AppTopBar/>
                    <div className="container-items">
                        <div className="container">
                            <Switch>
                            <Route path="/" exact component={CampaignItems}/>
                            <Route path="/login" exact component={LoginPage}/>
                            <Route path="/product/:id" exact component={ProductPage}/>
                            <Route path="/detail/:id" exact component={ProductDetail}/>
                            <AuthenticatedRoute key="profile" exact path="/profile" component={CustomerProfile}/>
                            </Switch>
                        </div>
                    </div>
                <AppFooter/>
            </AppContext.Provider>

        </div>
    );
}

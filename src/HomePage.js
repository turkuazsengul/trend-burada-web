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
import {AuthenticatedRoute} from "./components/AuthenticatedRoute";


export const HomePage = () => {
    const [component, setComponent] = useState(<CampaignItems/>);

    const userSettings = {
        component: component,
        setComponent,
    };

    return (
        <div className="home-layout">
            <AppContext.Provider value={userSettings}>
                <AppTopBar/>
                <Switch>
                    <div className="container-items">
                        <div className="container">
                            <Route path="/" exact component={CampaignItems}/>
                            <Route path="/login" exact component={LoginPage}/>
                            <AuthenticatedRoute key="profile" exact path="/profile" component={<CustomerProfile/>}/>
                        </div>
                    </div>
                </Switch>
                <AppFooter/>
            </AppContext.Provider>

        </div>
    );
}

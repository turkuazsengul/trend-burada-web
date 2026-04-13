import React, {useEffect, useState} from 'react';
import {AppTopBar} from "./AppTopBar";
import {AppFooter} from "./AppFooter";
import AppContext from "./AppContext";
import {CampaignItems} from "./components/home-page-components/CampaignItems";
import {Redirect, Route, Switch, useLocation} from "react-router-dom";
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
import {FavoritesPage} from "./components/FavoritesPage";
import CartService, {CART_UPDATED_EVENT} from "./service/CartService";
import {CartPage} from "./components/CartPage";

const AddressRedirect = () => <Redirect to="/hesabım/KullaniciBilgilerim?section=address"/>;

export const HomePage = () => {
    const location = useLocation();
    const [component, setComponent] = useState(<CampaignItems/>);
    const [orderCount, setOrderCount] = useState(0);
    const [authenticated, setAuthenticated] = useState();
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        const syncCartCount = () => {
            setOrderCount(CartService.getCartCount());
        };

        syncCartCount();
        window.addEventListener(CART_UPDATED_EVENT, syncCartCount);
        return () => window.removeEventListener(CART_UPDATED_EVENT, syncCartCount);
    }, []);

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

    const isCartRoute = (location?.pathname || '').startsWith('/sepetim');

    return (
        <div className="home-layout">
            <AppContext.Provider value={userSettings}>
                <AppTopBar/>
                <div className="container-items">
                    <div className={`container ${isCartRoute ? 'container-full' : ''}`}>
                        <Switch>
                            <Route path="/" exact component={CampaignItems}/>
                            <Route path="/login" exact component={LoginPage}/>
                            <Route path="/product/:id" exact component={ProductPage}/>
                            <AuthenticatedRoute key="favorites" exact path="/favoriler" component={FavoritesPage}/>
                            <Route path="/detail/:id" exact component={ProductDetail}/>
                            <Route path="/sepetim" exact component={CartPage}/>
                            <AuthenticatedRoute key="profile" exact path="/hesabım/KullaniciBilgilerim" component={MyUserInfo}/>
                            <AuthenticatedRoute key="order" exact path="/hesabım/Siparislerim" component={AllOrderComp}/>
                            <AuthenticatedRoute key="address" exact path="/hesabım/Adreslerim" component={AddressRedirect}/>
                        </Switch>
                    </div>
                </div>
                <AppFooter/>
            </AppContext.Provider>

        </div>
    );
}

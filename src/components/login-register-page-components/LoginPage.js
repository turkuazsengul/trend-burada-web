import React, {useContext, useState} from 'react';
import {TabView, TabPanel} from 'primereact/tabview';
import {Register} from "./Register";
import {Login} from "./Login";
import '../../css/loader.css'
import AppContext from "../../AppContext";

export const LoginPage = () => {
    const {t = (key) => key} = useContext(AppContext) || {};

    const [activeIndex,setActiveIndex] = useState(0);

    return (
        <div className="catalog login-page-shell">
            <div className="container-items">
                <div className="login-card-wrap">
                    <div className="login-page-headline">
                        <h1>{t('loginPage.title')}</h1>
                        <p>{t('loginPage.subtitle')}</p>
                    </div>

                    <div className="login-card-panel">
                        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                            <TabPanel header={t('loginPage.loginTab')}>
                                <Login/>
                            </TabPanel>

                            <TabPanel header={t('loginPage.registerTab')}>
                                <Register/>
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </div>
        </div>
    );
}

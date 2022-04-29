import React, {useContext, useEffect, useState} from 'react';
import AppContext from "../../AppContext";
import {TabView, TabPanel} from 'primereact/tabview';
import {Register} from "../Register";
import {Login} from "../Login";

export const LoginPage = (props) => {

    const myContext = useContext(AppContext)

    const [activeIndex,setActiveIndex] = useState(0);

    return (
        <div className="catalog">
            <div className="container-items">
                <div className="login-card-wrap">
                    <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                        <TabPanel header="Giriş Yap">
                            <Login/>
                        </TabPanel>

                        <TabPanel header="Üye Ol">
                            <Register/>
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>
    );
}

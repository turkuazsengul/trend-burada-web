import React, {useState} from 'react';
import {TabView, TabPanel} from 'primereact/tabview';
import {Register} from "./Register";
import {Login} from "./Login";
import '../../css/loader.css'

export const LoginPage = () => {

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

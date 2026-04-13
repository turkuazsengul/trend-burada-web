import React, {useState} from 'react';
import {TabView, TabPanel} from 'primereact/tabview';
import {Register} from "./Register";
import {Login} from "./Login";
import '../../css/loader.css'

export const LoginPage = () => {

    const [activeIndex,setActiveIndex] = useState(0);

    return (
        <div className="catalog login-page-shell">
            <div className="container-items">
                <div className="login-card-wrap">
                    <div className="login-page-headline">
                        <h1>Hesabına Giriş Yap</h1>
                        <p>Siparişlerini takip et, favorilerini kaydet ve sana özel kampanyaları kaçırma.</p>
                    </div>

                    <div className="login-card-panel">
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
        </div>
    );
}

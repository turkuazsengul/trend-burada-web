import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch} from 'react-router-dom'
import ScrollToTop from './ScrollToTop';
import {PublicHome} from "./PublicHome";
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './layout/flags/flags.css';
import './layout/layout.scss';


import {HomePage} from "./HomePage";

ReactDOM.render(
    <BrowserRouter>
        <ScrollToTop>
            <Switch>
                {/*<PublicHome/>*/}
                <HomePage/>
            </Switch>
        </ScrollToTop>
    </BrowserRouter>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();

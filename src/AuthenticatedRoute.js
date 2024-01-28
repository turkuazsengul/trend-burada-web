import React, {useEffect, useState} from "react";
import {Redirect, Route} from "react-router-dom";

export const AuthenticatedRoute = ({component: Component, ...rest}) => {

    const [pageData, setPageData] = useState();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setPageData(Component)
        } else {
            setPageData(<Redirect to="/login"/>)
        }
    }, []);

    return (
        <Route {...rest} render={props => (pageData)}/>
    )
}

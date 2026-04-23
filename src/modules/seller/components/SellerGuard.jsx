import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import AuthService from '../../../service/AuthService';

export const SellerGuard = ({component: Component, ...rest}) => (
    <Route
        {...rest}
        render={(props) => {
            const user = AuthService.getCurrentUser();
            const roles = Array.isArray(user?.roleList) ? user.roleList : [];
            const hasSession = Boolean(AuthService.getBearerToken() && user);
            const hasSellerRole = roles.some((role) => role?.name === 'SELLER' || role?.name === 'ADMIN');

            if (!hasSession || !hasSellerRole) {
                return <Redirect to={`/seller/login?redirect=${encodeURIComponent(props.location.pathname)}`}/>;
            }

            return <Component {...props} />;
        }}
    />
);

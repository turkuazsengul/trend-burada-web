import React from 'react';
import {NavLink, useHistory} from 'react-router-dom';
import {Button} from 'primereact/button';
import AuthService from '../../../service/AuthService';
import {getSellerProfile} from '../data/sellerCatalogConfig';

const menuItems = [
    {to: '/seller', exact: true, icon: 'pi pi-home', label: 'Genel Bakis'},
    {to: '/seller/products', icon: 'pi pi-box', label: 'Urunler'},
    {to: '/seller/products/new', icon: 'pi pi-plus-circle', label: 'Yeni Urun'},
    {to: '/seller/orders', icon: 'pi pi-shopping-bag', label: 'Siparisler'}
];

export const SellerLayout = ({title, subtitle, actions, children}) => {
    const history = useHistory();
    const sellerProfile = getSellerProfile(AuthService.getCurrentUser());

    const handleLogout = async () => {
        const currentUser = AuthService.getCurrentUser();
        try {
            if (currentUser?.pkId || currentUser?.id) {
                await AuthService.logout(currentUser.pkId || currentUser.id).catch(() => null);
            }
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            history.push('/seller/login');
            window.location.reload();
        }
    };

    return (
        <div className="seller-shell">
            <aside className="seller-sidebar">
                <div className="seller-brand-block">
                    <span className="seller-brand-kicker">Trend Burada</span>
                    <strong>Seller Studio</strong>
                    <p>Magaza operasyonlari, urun yonetimi ve panel akislarini tek yerden yonet.</p>
                </div>

                <div className="seller-context-card">
                    <span className="seller-context-label">Aktif seller</span>
                    <strong>{sellerProfile.panelLabel}</strong>
                    <p>{sellerProfile.email}</p>
                </div>

                <nav className="seller-nav">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            exact={item.exact}
                            className="seller-nav-link"
                            activeClassName="is-active"
                        >
                            <i className={item.icon}/>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <Button label="Cikis yap" icon="pi pi-sign-out" className="seller-logout-button p-button-outlined" onClick={handleLogout}/>
            </aside>

            <main className="seller-main">
                <header className="seller-topbar">
                    <div>
                        <span className="seller-topbar-eyebrow">Seller Panel</span>
                        <h1>{title}</h1>
                        {subtitle ? <p>{subtitle}</p> : null}
                    </div>
                    {actions ? <div className="seller-topbar-actions">{actions}</div> : null}
                </header>

                <section className="seller-content">
                    {children}
                </section>
            </main>
        </div>
    );
};

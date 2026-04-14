import React, {useContext, useMemo} from 'react';
import '../../css/customer-profile/customer-profile.css'
import AppContext from "../../AppContext";

export const buildProfileSections = (t) => ([
    {
        group: t('profile.groupAccount'),
        items: [
            {key: 'user-info', icon: 'pi pi-user', label: t('profile.userInfo')},
            {key: 'address', icon: 'pi pi-map-marker', label: t('profile.addresses')},
            {key: 'saved-cards', icon: 'pi pi-credit-card', label: t('profile.cards')}
        ]
    },
    {
        group: t('profile.groupOrders'),
        items: [
            {key: 'orders', icon: 'pi pi-box', label: t('profile.allOrders')},
            {key: 'seller-messages', icon: 'pi pi-envelope', label: t('profile.sellerMessages')},
            {key: 'reviews', icon: 'pi pi-comment', label: t('profile.myReviews')},
            {key: 'buy-again', icon: 'pi pi-shopping-cart', label: t('profile.buyAgain')}
        ]
    },
    {
        group: t('profile.groupSpecial'),
        items: [
            {key: 'coupons', icon: 'pi pi-tags', label: t('profile.coupons')},
            {key: 'history', icon: 'pi pi-clock', label: t('profile.history')},
            {key: 'followed-stores', icon: 'pi pi-shopping-bag', label: t('profile.followedStores')}
        ]
    }
]);

const ProfileNavigation = ({userFullName, activeSection, onChangeSection}) => {
    const {t = (key) => key} = useContext(AppContext) || {};
    const profileSections = useMemo(() => buildProfileSections(t), [t]);

    return (
        <div className="navigation-column">
            <div className="navi-row">
                <label>{userFullName || t('profile.accountFallback')}</label>
            </div>

            {profileSections.map((sectionGroup) => (
                <div key={sectionGroup.group} className="navi-row">
                    <label>{sectionGroup.group}</label>
                    <hr/>
                    {sectionGroup.items.map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            className={`navi-item navi-item-button ${activeSection === item.key ? 'is-active' : ''}`}
                            onClick={() => onChangeSection && onChangeSection(item.key)}
                        >
                            <i className={item.icon} style={{color: '#708090'}}/>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default ProfileNavigation;

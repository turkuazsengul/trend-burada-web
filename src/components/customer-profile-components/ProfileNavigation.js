import React, {useContext, useEffect, useMemo, useState} from 'react';
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

const ProfileNavigation = ({userFullName, activeSection, onChangeSection, compact = false}) => {
    const {t = (key) => key} = useContext(AppContext) || {};
    const profileSections = useMemo(() => buildProfileSections(t), [t]);
    const flatItems = useMemo(
        () => profileSections.flatMap((sectionGroup) => sectionGroup.items),
        [profileSections]
    );
    const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

    const text = (key, fallback) => {
        const value = t(key);
        return value === key ? fallback : value;
    };

    const activeItem = useMemo(
        () => flatItems.find((item) => item.key === activeSection),
        [flatItems, activeSection]
    );

    useEffect(() => {
        if (!mobileSheetOpen) {
            return undefined;
        }

        const onEscape = (event) => {
            if (event.key === 'Escape') {
                setMobileSheetOpen(false);
            }
        };

        document.addEventListener('keydown', onEscape);
        return () => document.removeEventListener('keydown', onEscape);
    }, [mobileSheetOpen]);

    useEffect(() => {
        if (!mobileSheetOpen) {
            return undefined;
        }

        const currentOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = currentOverflow;
        };
    }, [mobileSheetOpen]);

    if (compact) {
        return (
            <div className="navigation-column navigation-column-compact">
                <div className="navi-row navi-compact-header">
                    <label>{userFullName || t('profile.accountFallback')}</label>
                </div>
                <div className="navi-row navi-compact-trigger-row">
                    <button
                        type="button"
                        className="navi-compact-trigger"
                        onClick={() => setMobileSheetOpen(true)}
                        aria-haspopup="dialog"
                        aria-expanded={mobileSheetOpen}
                    >
                        <span className="navi-compact-trigger-title">{text('profile.sectionsTitle', 'Bölümler')}</span>
                        <span className="navi-compact-trigger-value">{activeItem?.label || text('profile.accountInfoTitle', 'Hesabım')}</span>
                        <i className="pi pi-chevron-down"/>
                    </button>
                </div>

                {mobileSheetOpen && (
                    <div className="profile-mobile-sheet-backdrop" onClick={() => setMobileSheetOpen(false)}>
                        <div
                            className="profile-mobile-sheet"
                            role="dialog"
                            aria-modal="true"
                            aria-label={text('profile.sectionsTitle', 'Bölümler')}
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="profile-mobile-sheet-handle"/>
                            <div className="profile-mobile-sheet-header">
                                <strong>{text('profile.sectionsTitle', 'Bölümler')}</strong>
                                <button
                                    type="button"
                                    className="profile-mobile-sheet-close"
                                    onClick={() => setMobileSheetOpen(false)}
                                    aria-label={text('common.close', 'Kapat')}
                                >
                                    <i className="pi pi-times"/>
                                </button>
                            </div>
                            <div className="profile-mobile-sheet-content">
                                {profileSections.map((sectionGroup) => (
                                    <div key={sectionGroup.group} className="profile-mobile-sheet-group">
                                        <div className="profile-mobile-sheet-group-title">{sectionGroup.group}</div>
                                        {sectionGroup.items.map((item) => (
                                            <button
                                                key={item.key}
                                                type="button"
                                                className={`navi-item navi-item-button navi-item-mobile-sheet ${activeSection === item.key ? 'is-active' : ''}`}
                                                onClick={() => {
                                                    onChangeSection && onChangeSection(item.key);
                                                    setMobileSheetOpen(false);
                                                }}
                                            >
                                                <i className={item.icon} style={{color: '#708090'}}/>
                                                <span>{item.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

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

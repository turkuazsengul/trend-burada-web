import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {useHistory, useLocation} from "react-router-dom";
import 'primeicons/primeicons.css';
import AppContext from "./AppContext";
import PromoService from "./service/PromoService";
import {USE_STATIC_PROMO_IMAGES} from "./constants/UrlConstans";
import {getParentCategoryIdBySlug, MEGA_MENU_CATEGORIES} from "./data/demoProductData";

const megaMenuCategories = MEGA_MENU_CATEGORIES;

const staticMegaMenuPromoImages = [
    "https://cdn.dsmcdn.com/ty403/campaign/banners/original/603949/e03b7e086a_1.jpg",
    "https://cdn.dsmcdn.com/ty1157/pimWidgetApi/mobile_20240201202326_2522913EvYasamMobile202402011501.jpg",
    "https://cdn.dsmcdn.com/ty1158/pimWidgetApi/mobile_20240205071956_2524256ElektronikMobile202402021201.jpg",
    "https://cdn.dsmcdn.com/ty1137/pimWidgetApi/mobile_20240118070002_mobile20240108065243mobile2023.jpg",
    "https://cdn.dsmcdn.com/ty1143/pimWidgetApi/mobile_20240124071226_2401147KadinMobile202401231802.jpg",
    "https://cdn.dsmcdn.com/ty1138/pimWidgetApi/mobile_20240118065730_columbia.jpg",
    "https://cdn.dsmcdn.com/ty1129/pimWidgetApi/mobile_20240111153218_2249025KadinMobile202401111801.jpg",
    "https://cdn.dsmcdn.com/ty1155/pimWidgetApi/mobile_20240202153542_2527400ElektronikMobile202402021801.jpg",
    "https://cdn.dsmcdn.com/ty1111/pimWidgetApi/mobile_20231229092657_2397375ElektronikMobile202312.jpg",
    "https://cdn.dsmcdn.com/ty1153/pimWidgetApi/mobile_20240131064937_SevginiziGosterenTakilar1.jpg",
    "https://cdn.dsmcdn.com/ty1120/pimWidgetApi/mobile_20240105130028_2414392ElektronikMobile202401041901.jpg",
    "https://cdn.dsmcdn.com/ty1082/pimWidgetApi/mobile_20231207122821_2357602SupermarketMobile202312071302.jpg"
];

export const AppTopBar = () => {
    const history = useHistory();
    const location = useLocation();
    const myContext = useContext(AppContext);
    const closeTimerRef = useRef(null);
    const profileMenuCloseTimerRef = useRef(null);
    const cartButtonAnchorRef = useRef(null);
    const cartBounceTimerRef = useRef(null);
    const lastCartCountRef = useRef(0);

    const [userFullName, setUserFullName] = useState('');
    const [activeMegaCategoryId, setActiveMegaCategoryId] = useState(megaMenuCategories[0].id);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [promoImages, setPromoImages] = useState(staticMegaMenuPromoImages);
    const [promoImageIndex, setPromoImageIndex] = useState(0);
    const [isCartBadgeBouncing, setIsCartBadgeBouncing] = useState(false);

    useEffect(() => {
        const path = location?.pathname || '';
        if (!path.startsWith('/product/')) {
            return;
        }

        const slug = decodeURIComponent(path.replace('/product/', '')).trim().toLowerCase();
        if (!slug) {
            return;
        }

        const parentId = getParentCategoryIdBySlug(slug);
        if (parentId) {
            setActiveMegaCategoryId(parentId);
        }
    }, [location]);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            const storedUserStr = localStorage.getItem('user');
            const user = JSON.parse(storedUserStr);
            setUserFullName(user.name + ' ' + user.surname);
        }
    }, []);

    useEffect(() => {
        return () => {
            if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current);
            }
            if (profileMenuCloseTimerRef.current) {
                clearTimeout(profileMenuCloseTimerRef.current);
            }
            if (cartBounceTimerRef.current) {
                clearTimeout(cartBounceTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (USE_STATIC_PROMO_IMAGES) {
            setPromoImages(staticMegaMenuPromoImages);
            return;
        }

        PromoService.getPromoImages().then((imageUrls) => {
            if (Array.isArray(imageUrls) && imageUrls.length > 0) {
                setPromoImages(imageUrls);
                setPromoImageIndex(0);
            } else {
                setPromoImages(staticMegaMenuPromoImages);
            }
        });
    }, []);

    useEffect(() => {
        if (!isMegaMenuOpen || !promoImages || promoImages.length <= 1) {
            return;
        }

        const intervalId = setInterval(() => {
            setPromoImageIndex((prev) => (prev + 1) % promoImages.length);
        }, 3200);

        return () => clearInterval(intervalId);
    }, [promoImages, isMegaMenuOpen]);

    const topMenuItems = [
        {
            id: 1,
            value: 'Kampanyalar',
            to: '/'
        },
        {
            id: 2,
            value: 'Siparişlerim',
            to: '/hesabım/Siparislerim'
        },
        {
            id: 3,
            value: 'Hakkımızda',
            to: '/'
        },
        {
            id: 4,
            value: 'Yeni Sezon Ürünleri',
            to: '/'
        }
    ];

    const profileToolItem = [
        {
            id: 1,
            name: 'Hesabım',
            icon: 'pi pi-user',
            to: '/hesabım/KullaniciBilgilerim?section=user-info'
        },
        {
            id: 2,
            name: 'Siparişlerim',
            icon: 'pi pi-box',
            to: '/hesabım/KullaniciBilgilerim?section=orders'
        },
        {
            id: 3,
            name: 'Adreslerim',
            icon: 'pi pi-map',
            to: '/hesabım/KullaniciBilgilerim?section=address'
        },
        {
            id: 4,
            name: 'Değerlendirmelerim',
            icon: 'pi pi-comment',
            to: '/hesabım/KullaniciBilgilerim?section=reviews'
        },
        {
            id: 5,
            name: 'Satıcı Mesajlarım',
            icon: 'pi pi-envelope',
            to: '/hesabım/KullaniciBilgilerim?section=seller-messages'
        }
    ];

    const clearCloseTimer = () => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    };

    const openMegaMenu = (categoryId) => {
        clearCloseTimer();
        setActiveMegaCategoryId(categoryId);
        setIsMegaMenuOpen(true);
    };

    const scheduleCloseMegaMenu = () => {
        clearCloseTimer();
        closeTimerRef.current = setTimeout(() => {
            setIsMegaMenuOpen(false);
        }, 180);
    };

    const handleMegaMenuBlur = (event) => {
        const nextFocused = event.relatedTarget;
        if (!event.currentTarget.contains(nextFocused)) {
            scheduleCloseMegaMenu();
        }
    };

    const clearProfileMenuCloseTimer = () => {
        if (profileMenuCloseTimerRef.current) {
            clearTimeout(profileMenuCloseTimerRef.current);
            profileMenuCloseTimerRef.current = null;
        }
    };

    const openProfileMenu = () => {
        if (!localStorage.getItem('token')) {
            return;
        }
        clearProfileMenuCloseTimer();
        setIsProfileMenuOpen(true);
    };

    const scheduleCloseProfileMenu = () => {
        clearProfileMenuCloseTimer();
        profileMenuCloseTimerRef.current = setTimeout(() => {
            setIsProfileMenuOpen(false);
        }, 160);
    };

    const handleProfileMenuBlur = (event) => {
        const nextFocused = event.relatedTarget;
        if (!event.currentTarget.contains(nextFocused)) {
            scheduleCloseProfileMenu();
        }
    };

    const clickLoginButton = () => {
        if (!localStorage.getItem('token')) {
            history.push('/login');
        } else {
            history.push('/hesabım/KullaniciBilgilerim');
        }
    };

    const clickBoxButton = () => {
        history.push('/sepetim');
    };

    const clickFavoriteButton = () => {
        if (!localStorage.getItem('token')) {
            history.push('/login');
            return;
        }

        history.push('/favoriler');
    };

    const topMenuItemBody = () => {
        return topMenuItems.map((x) => {
            return (
                <a key={x.id} href={x.to}>{x.value}</a>
            );
        });
    };

    const getLoginButtonLabel = () => {
        if (localStorage.getItem('token')) {
            return (
                <Button
                    onClick={clickLoginButton}
                    onFocus={openProfileMenu}
                    icon="pi pi-user"
                    label={'Hesabım'}
                    className="session-in top-bar-login-button p-button-text top-bar-button p-button-secondary p-button-outlined mr-3 mb-2"
                />
            );
        }

        return (
            <Button
                onClick={clickLoginButton}
                icon="pi pi-user"
                label={'Giriş Yap'}
                className="session-out top-bar-login-button p-button-text top-bar-button p-button-secondary p-button-outlined mr-3 mb-2"
            />
        );
    };

    const profileActionList = () => {
        const token = localStorage.getItem('token');
        if (token) {
            return profileToolItem.map((x) => {
                return (
                    <a key={x.id} className="account-dropdown-item" href={x.to}>
                        <i className={x.icon} style={{fontWeight: 'bold'}}/>
                        <span>{x.name}</span>
                    </a>
                );
            });
        }
        return null;
    };

    const logoutButtonBody = () => {
        if (localStorage.getItem('token')) {
            return (
                <button type="button" className="account-dropdown-item is-logout" onClick={logOutClick}>
                    <i className="pi pi-sign-out" style={{fontWeight: 'bold'}}/>
                    <span>Çıkış Yap</span>
                </button>
            );
        }
        return null;
    };

    const logOutClick = () => {
        localStorage.clear();
        window.location.reload();
    };

    const cartCount = Number(myContext?.orderCount || 0);
    const cartBadgeLabel = cartCount > 99 ? '99+' : String(cartCount);

    const triggerCartBounce = useCallback(() => {
        setIsCartBadgeBouncing(false);
        window.requestAnimationFrame(() => {
            setIsCartBadgeBouncing(true);
            if (cartBounceTimerRef.current) {
                clearTimeout(cartBounceTimerRef.current);
            }
            cartBounceTimerRef.current = setTimeout(() => {
                setIsCartBadgeBouncing(false);
            }, 760);
        });
    }, []);

    const playFlyToCartAnimation = useCallback(({startX, startY, imageUrl}) => {
        const anchor = cartButtonAnchorRef.current;
        if (!anchor || typeof startX !== 'number' || typeof startY !== 'number') {
            triggerCartBounce();
            return;
        }

        const iconEl = anchor.querySelector('.top-cart-icon-wrap') || anchor.querySelector('.p-button-icon') || anchor;
        const iconRect = iconEl.getBoundingClientRect();
        const endX = iconRect.left + (iconRect.width / 2);
        const endY = iconRect.top + (iconRect.height / 2);

        const flyEl = document.createElement('div');
        flyEl.className = 'cart-fly-item';
        flyEl.style.left = `${startX - 18}px`;
        flyEl.style.top = `${startY - 18}px`;
        flyEl.style.setProperty('--fly-x', `${endX - startX}px`);
        flyEl.style.setProperty('--fly-y', `${endY - startY}px`);
        if (imageUrl) {
            flyEl.style.backgroundImage = `url('${imageUrl}')`;
            flyEl.classList.add('has-image');
        }

        document.body.appendChild(flyEl);

        window.requestAnimationFrame(() => {
            flyEl.classList.add('is-animating');
        });

        window.setTimeout(() => {
            if (flyEl.parentNode) {
                flyEl.parentNode.removeChild(flyEl);
            }
            triggerCartBounce();
        }, 760);
    }, [triggerCartBounce]);

    useEffect(() => {
        const hasIncreased = cartCount > Number(lastCartCountRef.current || 0);
        if (hasIncreased) {
            triggerCartBounce();
        }
        lastCartCountRef.current = cartCount;
    }, [cartCount, triggerCartBounce]);

    useEffect(() => {
        const handleCartFly = (event) => {
            const detail = event?.detail || {};
            playFlyToCartAnimation({
                startX: Number(detail.startX),
                startY: Number(detail.startY),
                imageUrl: detail.imageUrl || ''
            });
        };

        window.addEventListener('cart:add:fly', handleCartFly);
        return () => window.removeEventListener('cart:add:fly', handleCartFly);
    }, [playFlyToCartAnimation]);

    const activeCategory = megaMenuCategories.find((category) => category.id === activeMegaCategoryId) || megaMenuCategories[0];
    const orderedMegaMenuCategories = [
        activeCategory,
        ...megaMenuCategories.filter((category) => category.id !== activeCategory.id)
    ];

    return (
        <div className="top-bar">
            <div className="top-bar-items">
                <div className="top-menu">
                    <ul>
                        {topMenuItemBody()}
                    </ul>
                </div>
                <div className="top-bar-item">
                    <div className="top-bar-search">
                        <div className="top-bar-logo">
                            <span><a href="/">TREND BURADA</a></span>
                        </div>
                        <div className="top-bar-search-input">
                            <div className="col-12 md:col-4">
                                <div className="p-inputgroup search-input-group">
                                    <InputText className="search-input" placeholder="Dilediğinizi Arayın"/>
                                    <Button icon="pi pi-search" className="search-button p-button-secondary p-button-text"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div
                            className="account-menu-wrapper"
                            onMouseEnter={openProfileMenu}
                            onMouseLeave={scheduleCloseProfileMenu}
                            onBlur={handleProfileMenuBlur}
                        >
                            {getLoginButtonLabel()}

                            {localStorage.getItem('token') && (
                                <div className={`account-dropdown-panel ${isProfileMenuOpen ? 'is-open' : ''}`}>
                                    <div className="account-dropdown-header">{userFullName}</div>
                                    <div className="account-dropdown-list">
                                        {profileActionList()}
                                        {logoutButtonBody()}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <Button
                            className="top-bar-button top-favorite-button p-button-secondary p-button-text"
                            icon="pi pi-heart"
                            onClick={clickFavoriteButton}
                            label="Favoriler"
                        />
                    </div>

                    <div ref={cartButtonAnchorRef} className="top-cart-button-anchor">
                        <button
                            type="button"
                            className="top-bar-button top-cart-button top-cart-custom"
                            onClick={clickBoxButton}
                            aria-label="Sepetim"
                        >
                            <span className="top-cart-icon-wrap" aria-hidden="true">
                                <i className="pi pi-shopping-cart"/>
                                {cartCount > 0 && (
                                    <span
                                        className={`top-cart-count-badge ${isCartBadgeBouncing ? 'is-bouncing' : ''}`}
                                        aria-label={`Sepette ${cartCount} urun var`}
                                    >
                                        {cartBadgeLabel}
                                    </span>
                                )}
                            </span>
                            <span className="top-cart-label">Sepetim</span>
                        </button>
                    </div>

                </div>

                <div
                    className="mega-menu-wrapper"
                    onMouseEnter={clearCloseTimer}
                    onMouseLeave={scheduleCloseMegaMenu}
                    onBlur={handleMegaMenuBlur}
                    onKeyDown={(event) => {
                        if (event.key === 'Escape') {
                            setIsMegaMenuOpen(false);
                        }
                    }}
                >
                    <div className="tab-menu-category" role="menubar" aria-label="Ürün kategorileri">
                        {megaMenuCategories.map((category) => {
                            const isActive = activeMegaCategoryId === category.id;
                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    className={`category-tab ${isActive ? 'is-active' : ''}`}
                                    onMouseEnter={() => openMegaMenu(category.id)}
                                    onFocus={() => openMegaMenu(category.id)}
                                    aria-expanded={isMegaMenuOpen}
                                    aria-controls="fashion-mega-menu-panel"
                                >
                                    {category.label}
                                </button>
                            );
                        })}
                    </div>

                    <div
                        id="fashion-mega-menu-panel"
                        className={`fashion-mega-menu-panel ${isMegaMenuOpen ? 'is-open' : ''}`}
                        aria-hidden={!isMegaMenuOpen}
                    >
                        <div className="mega-menu-main">
                            <div className="mega-menu-header">
                                <span className="mega-menu-label">{activeCategory.label} Koleksiyonu</span>
                                <a href="/" className="mega-menu-view-all">Tümünü Gör</a>
                            </div>

                            <div className="mega-menu-columns">
                                {orderedMegaMenuCategories.map((category) => {
                                    const isColumnActive = category.id === activeMegaCategoryId;
                                    return (
                                        <div key={category.id} className={`mega-menu-column ${isColumnActive ? 'is-active' : ''}`}>
                                            <a href="/" className="mega-menu-column-title">{category.label}</a>
                                            <ul>
                                                {category.items.map((subCategory) => (
                                                    <li key={subCategory.slug}>
                                                        <a href={`/product/${encodeURIComponent(subCategory.slug)}`}>{subCategory.label}</a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <aside className="mega-menu-promo">
                            <div className="mega-menu-promo-image-wrapper">
                                <img
                                    key={promoImageIndex}
                                    className="mega-menu-promo-image"
                                    src={promoImages[promoImageIndex]}
                                    alt="Yeni sezon kampanya görseli"
                                    loading="eager"
                                    decoding="async"
                                />
                            </div>
                            <span className="promo-badge">Yeni Sezon</span>
                            <h4>Şehir Stiline Yeni Dokunuş</h4>
                            <p>Premium kumaşlar, zamansız kesimler ve sınırlı stok fırsatlarıyla sezonun öne çıkan parçalarını keşfedin.</p>
                            <a href="/" className="promo-cta">Koleksiyonu İncele</a>
                        </aside>
                    </div>
                </div>
            </div>

            <div className="hr-style">

            </div>

        </div>
    );
};

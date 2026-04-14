import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {useHistory, useLocation} from "react-router-dom";
import 'primeicons/primeicons.css';
import AppContext from "./AppContext";
import PromoService from "./service/PromoService";
import {USE_STATIC_PROMO_IMAGES} from "./constants/UrlConstans";
import {getParentCategoryIdBySlug, MEGA_MENU_CATEGORIES} from "./data/demoProductData";
import {supportedLanguages} from "./i18n/i18n";

const megaMenuCategories = MEGA_MENU_CATEGORIES;
const CATEGORY_LABEL_TRANSLATIONS = {
    kadin: {tr: 'Kadın', en: 'Women'},
    erkek: {tr: 'Erkek', en: 'Men'},
    cocuk: {tr: 'Çocuk', en: 'Kids'},
    ayakkabi: {tr: 'Ayakkabı', en: 'Shoes'},
    aksesuar: {tr: 'Aksesuar', en: 'Accessories'},
    'spor-giyim': {tr: 'Spor Giyim', en: 'Sportswear'}
};
const SUBCATEGORY_LABEL_TRANSLATIONS = {
    elbise: {tr: 'Elbise', en: 'Dress'},
    tisort: {tr: 'Tişört', en: 'T-Shirt'},
    gomlek: {tr: 'Gömlek', en: 'Shirt'},
    pantolon: {tr: 'Pantolon', en: 'Pants'},
    ceket: {tr: 'Ceket', en: 'Jacket'},
    triko: {tr: 'Triko', en: 'Knitwear'},
    'erkek-tisort': {tr: 'Tişört', en: 'T-Shirt'},
    'erkek-gomlek': {tr: 'Gömlek', en: 'Shirt'},
    jean: {tr: 'Jean', en: 'Jeans'},
    'erkek-pantolon': {tr: 'Pantolon', en: 'Pants'},
    sweatshirt: {tr: 'Sweatshirt', en: 'Sweatshirt'},
    mont: {tr: 'Mont', en: 'Coat'},
    'kiz-cocuk': {tr: 'Kız Çocuk', en: 'Girls'},
    'erkek-cocuk': {tr: 'Erkek Çocuk', en: 'Boys'},
    'bebek-giyim': {tr: 'Bebek Giyim', en: 'Baby Clothing'},
    'okul-kombinleri': {tr: 'Okul Kombinleri', en: 'School Outfits'},
    sneaker: {tr: 'Sneaker', en: 'Sneakers'},
    bot: {tr: 'Bot', en: 'Boots'},
    'topuklu-ayakkabi': {tr: 'Topuklu Ayakkabı', en: 'Heels'},
    loafer: {tr: 'Loafer', en: 'Loafers'},
    sandalet: {tr: 'Sandalet', en: 'Sandals'},
    canta: {tr: 'Çanta', en: 'Bag'},
    kemer: {tr: 'Kemer', en: 'Belt'},
    cuzdan: {tr: 'Cüzdan', en: 'Wallet'},
    taki: {tr: 'Takı', en: 'Jewelry'},
    sapka: {tr: 'Şapka', en: 'Hat'},
    esofman: {tr: 'Eşofman', en: 'Tracksuit'},
    tayt: {tr: 'Tayt', en: 'Leggings'},
    'spor-sutyeni': {tr: 'Spor Sütyeni', en: 'Sports Bra'},
    hoodie: {tr: 'Hoodie', en: 'Hoodie'},
    'kosu-urunleri': {tr: 'Koşu Ürünleri', en: 'Running Products'}
};

const staticMegaMenuPromoImages = [
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=2200&q=86",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2200&q=86",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2200&q=86",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2200&q=86",
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=2200&q=86",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=2200&q=86",
    "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=2200&q=86",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2200&q=86",
    "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=2200&q=86",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=2200&q=86",
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2200&q=86",
    "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=2200&q=86"
];

export const AppTopBar = () => {
    const history = useHistory();
    const location = useLocation();
    const myContext = useContext(AppContext);
    const t = myContext?.t || ((key) => key);
    const language = myContext?.language || 'tr';
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
            const user = storedUserStr ? JSON.parse(storedUserStr) : null;
            if (user) {
                setUserFullName(`${user.name || ''} ${user.surname || ''}`.trim());
            }
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
            value: t('topbar.campaigns'),
            to: '/'
        },
        {
            id: 2,
            value: t('topbar.orders'),
            to: '/hesabım/Siparislerim'
        },
        {
            id: 3,
            value: t('topbar.about'),
            to: '/'
        },
        {
            id: 4,
            value: t('topbar.newSeason'),
            to: '/'
        }
    ];

    const profileToolItem = [
        {
            id: 1,
            name: t('topbar.profileAccount'),
            icon: 'pi pi-user',
            to: '/hesabım/KullaniciBilgilerim?section=user-info'
        },
        {
            id: 2,
            name: t('topbar.profileOrders'),
            icon: 'pi pi-box',
            to: '/hesabım/KullaniciBilgilerim?section=orders'
        },
        {
            id: 3,
            name: t('topbar.profileAddresses'),
            icon: 'pi pi-map',
            to: '/hesabım/KullaniciBilgilerim?section=address'
        },
        {
            id: 4,
            name: t('topbar.profileReviews'),
            icon: 'pi pi-comment',
            to: '/hesabım/KullaniciBilgilerim?section=reviews'
        },
        {
            id: 5,
            name: t('topbar.profileMessages'),
            icon: 'pi pi-envelope',
            to: '/hesabım/KullaniciBilgilerim?section=seller-messages'
        }
    ];
    const localizedMegaMenuCategories = megaMenuCategories.map((category) => ({
        ...category,
        label: CATEGORY_LABEL_TRANSLATIONS[category.id]?.[language] || category.label,
        items: category.items.map((item) => ({
            ...item,
            label: SUBCATEGORY_LABEL_TRANSLATIONS[item.slug]?.[language] || item.label
        }))
    }));

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
                    label={t('topbar.account')}
                    className="session-in top-bar-login-button p-button-text top-bar-button p-button-secondary p-button-outlined mr-3 mb-2"
                />
            );
        }

        return (
            <Button
                onClick={clickLoginButton}
                icon="pi pi-user"
                label={t('topbar.login')}
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
                    <span>{t('topbar.logout')}</span>
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

    const activeCategory = localizedMegaMenuCategories.find((category) => category.id === activeMegaCategoryId) || localizedMegaMenuCategories[0];
    const orderedMegaMenuCategories = [
        activeCategory,
        ...localizedMegaMenuCategories.filter((category) => category.id !== activeCategory.id)
    ];

    return (
        <div className="top-bar">
            <div className="top-bar-items">
                <div className="top-menu">
                    <ul>{topMenuItemBody()}</ul>
                    <div className="language-switcher" role="group" aria-label={t('topbar.language')}>
                        <i className="pi pi-globe" aria-hidden="true"/>
                        {supportedLanguages.map((lang) => (
                            <button
                                key={lang.value}
                                type="button"
                                className={`language-switcher-btn ${myContext?.language === lang.value ? 'is-active' : ''}`}
                                onClick={() => myContext?.setLanguage && myContext.setLanguage(lang.value)}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="top-bar-item">
                    <div className="top-bar-search">
                        <div className="top-bar-logo">
                            <span><a href="/">TREND BURADA</a></span>
                        </div>
                        <div className="top-bar-search-input">
                            <div className="col-12 md:col-4">
                                <div className="p-inputgroup search-input-group">
                                    <InputText className="search-input" placeholder={t('topbar.searchPlaceholder')}/>
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
                                label={t('topbar.favorites')}
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
                                        aria-label={t('topbar.cartAria', {count: cartCount})}
                                    >
                                        {cartBadgeLabel}
                                    </span>
                                )}
                            </span>
                            <span className="top-cart-label">{t('topbar.cart')}</span>
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
                    <div className="tab-menu-category" role="menubar" aria-label={t('topbar.categoriesAria')}>
                        {localizedMegaMenuCategories.map((category) => {
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
                                <span className="mega-menu-label">{activeCategory.label} {t('topbar.collectionSuffix')}</span>
                                <a href="/" className="mega-menu-view-all">{t('topbar.viewAll')}</a>
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
                                    alt={t('topbar.promoImageAlt')}
                                    loading="eager"
                                    decoding="async"
                                />
                            </div>
                            <span className="promo-badge">{t('topbar.promoBadge')}</span>
                            <h4>{t('topbar.promoTitle')}</h4>
                            <p>{t('topbar.promoText')}</p>
                            <a href="/" className="promo-cta">{t('topbar.promoCta')}</a>
                        </aside>
                    </div>
                </div>
            </div>

            <div className="hr-style">

            </div>

        </div>
    );
};

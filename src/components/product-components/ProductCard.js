import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Rating} from 'primereact/rating';
import {FAVORITES_UPDATED_EVENT, initFavorites, isFavorite, toggleFavorite} from "../../service/FavoriteService";
import AppContext from "../../AppContext";
import CartService from "../../service/CartService";

const formatPrice = (price, locale = 'tr-TR') => `${Number(price || 0).toLocaleString(locale)} TL`;

const hashCode = (value = '') => {
    return String(value).split('').reduce((acc, char) => ((acc * 31) + char.charCodeAt(0)) >>> 0, 0);
};

const FAVORITE_HEART_SHAPE = [
    {x: -34, y: -22, size: 'sm', color: 'violet'},
    {x: -16, y: -34, size: 'md', color: 'pink'},
    {x: 0, y: -38, size: 'sm', color: 'fuchsia'},
    {x: 16, y: -34, size: 'md', color: 'rose'},
    {x: 34, y: -22, size: 'sm', color: 'violet'},
    {x: -46, y: -4, size: 'sm', color: 'pink'},
    {x: -24, y: -6, size: 'md', color: 'rose'},
    {x: 0, y: 0, size: 'lg', color: 'fuchsia'},
    {x: 24, y: -6, size: 'md', color: 'pink'},
    {x: 46, y: -4, size: 'sm', color: 'violet'},
    {x: -28, y: 20, size: 'sm', color: 'rose'},
    {x: -12, y: 36, size: 'md', color: 'pink'},
    {x: 12, y: 36, size: 'md', color: 'fuchsia'},
    {x: 28, y: 20, size: 'sm', color: 'rose'},
    {x: 0, y: 58, size: 'lg', color: 'violet'}
];

const buildEngagementContent = (type, value, language) => {
    if (type === 'favorites') {
        return (
            <>
                <strong>{value}</strong>
                <span>{language === 'en' ? ' people favorited this' : ' kişi favoriledi'}</span>
            </>
        );
    }

    if (type === 'views') {
        return (
            <>
                <strong>24</strong>
                <span>{language === 'en' ? 'h ' : ' saatte '}</span>
                <strong>{value}</strong>
                <span>{language === 'en' ? ' people viewed' : ' kişi inceledi'}</span>
            </>
        );
    }

    return <strong>{language === 'en' ? 'Fast Delivery' : 'Hızlı Teslimat'}</strong>;
};

export const ProductCard = ({product}) => {
    const {t = (key) => key, language = 'tr'} = useContext(AppContext) || {};
    const [favorite, setFavorite] = useState(false);
    const [insightIndex, setInsightIndex] = useState(0);
    const [favoriteBurstActive, setFavoriteBurstActive] = useState(false);
    const productId = product?.id;
    const locale = language === 'en' ? 'en-US' : 'tr-TR';
    const favoriteCount = product?.favoriteCount;
    const viewedLast24h = product?.viewedLast24h;
    const isFastDelivery = product?.isFastDelivery;

    useEffect(() => {
        const sync = () => setFavorite(isFavorite(productId));
        sync();
        initFavorites().then(sync);
        window.addEventListener(FAVORITES_UPDATED_EVENT, sync);
        return () => window.removeEventListener(FAVORITES_UPDATED_EVENT, sync);
    }, [productId]);

    const engagementInsights = useMemo(() => {
        const seed = hashCode(productId);
        const safeFavoriteCount = favoriteCount || 120 + (seed % 880);
        const safeViewedLast24h = viewedLast24h || 40 + (seed % 360);

        return [
            {
                key: 'favorites',
                symbolType: 'rocket',
                content: buildEngagementContent('favorites', safeFavoriteCount, language)
            },
            {
                key: 'views',
                icon: 'pi pi-eye',
                iconClassName: 'is-viewed',
                content: buildEngagementContent('views', safeViewedLast24h, language)
            },
            isFastDelivery ? {
                key: 'delivery',
                symbolType: 'delivery',
                content: buildEngagementContent('delivery', null, language)
            } : null
        ].filter(Boolean);
    }, [favoriteCount, viewedLast24h, isFastDelivery, productId, language]);

    useEffect(() => {
        if (engagementInsights.length <= 1) {
            return undefined;
        }

        const intervalId = window.setInterval(() => {
            setInsightIndex((prev) => (prev + 1) % engagementInsights.length);
        }, 2200);

        return () => window.clearInterval(intervalId);
    }, [engagementInsights]);

    useEffect(() => {
        if (!favoriteBurstActive) {
            return undefined;
        }

        const timeoutId = window.setTimeout(() => {
            setFavoriteBurstActive(false);
        }, 1100);

        return () => window.clearTimeout(timeoutId);
    }, [favoriteBurstActive]);

    const onFavoriteClick = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const next = await toggleFavorite({
            ...product,
            priceLabel: product.priceLabel,
            oldPriceLabel: product.oldPriceLabel
        });
        setFavorite(next);

        if (next) {
            setFavoriteBurstActive(false);
            window.requestAnimationFrame(() => setFavoriteBurstActive(true));
        }
    };

    const onAddToCart = (event) => {
        event.preventDefault();
        event.stopPropagation();

        CartService.addToCart({
            product,
            quantity: 1,
            selectedSize: product?.sizeOptions?.[0] || product?.size || '',
            selectedColor: product?.colorOptions?.[0]?.name || product?.color || ''
        });

        const clickTarget = event?.currentTarget || event?.target;
        if (clickTarget && typeof window !== 'undefined') {
            const rect = clickTarget.getBoundingClientRect();
            window.dispatchEvent(new CustomEvent('cart:add:fly', {
                detail: {
                    startX: rect.left + (rect.width / 2),
                    startY: rect.top + (rect.height / 2),
                    imageUrl: product?.img || ''
                }
            }));
        }
    };

    return (
        <div className="product-card">
            <div className="product-image-shell">
                <a href={`/detail/${product.id}`} className="product-card-media-link">
                    <div className="product-image-area">
                        {product.discountRate > 0 && <span className="product-discount-badge">%{product.discountRate}</span>}
                        <img className="product-img" src={product.img} alt={product.title} loading="lazy" decoding="async"/>
                    </div>
                </a>
                <button
                    type="button"
                    className={`product-favorite-toggle ${favorite ? 'is-active' : ''} ${favoriteBurstActive ? 'is-bursting' : ''}`}
                    onClick={onFavoriteClick}
                    aria-label={favorite ? t('productCard.removeFavorite') : t('productCard.addFavorite')}
                >
                    <span className="product-favorite-toggle-glow" aria-hidden="true"/>
                    <span className="product-favorite-toggle-ring" aria-hidden="true"/>
                    <i className={`pi ${favorite ? 'pi-heart-fill' : 'pi-heart'}`} aria-hidden="true"/>
                </button>
                <span className={`product-favorite-figure ${favoriteBurstActive ? 'is-visible' : ''}`} aria-hidden="true">
                    {FAVORITE_HEART_SHAPE.map((item, index) => (
                        <span
                            key={`${productId}-heart-figure-${index}`}
                            className={`product-favorite-figure-particle is-${item.size} is-${item.color}`}
                            style={{
                                '--heart-x': `${item.x}px`,
                                '--heart-y': `${item.y}px`,
                                '--heart-delay': `${index * 18}ms`
                            }}
                        >
                            ♥
                        </span>
                    ))}
                </span>
            </div>

            <a href={`/detail/${product.id}`} className="product-card-content-link">
                <div className="product-card-title">
                    <span className="product-brand">{product.mark}</span>
                    <span>{product.title}</span>
                </div>

                <div className="product-rating-row">
                    <span className="product-rating-average">{Number(product.rating || 0).toFixed(1)}</span>
                    <div className="product-rating">
                        <Rating value={product.rating} readOnly cancel={false}/>
                    </div>
                    <span className="product-review-count">({product.reviewCount || 0})</span>
                </div>

                <div className="product-engagement-ticker" aria-live="polite">
                    <span key={`${productId}-${engagementInsights[insightIndex]?.key || insightIndex}`}>
                        {engagementInsights[insightIndex]?.symbolType && (
                            <span
                                className={`product-engagement-symbol is-${engagementInsights[insightIndex].symbolType || ''}`}
                                aria-hidden="true"
                            />
                        )}
                        {engagementInsights[insightIndex]?.icon && (
                            <i
                                className={`${engagementInsights[insightIndex].icon} ${engagementInsights[insightIndex].iconClassName || ''}`}
                                aria-hidden="true"
                            />
                        )}
                        <span className={`product-engagement-text ${engagementInsights[insightIndex]?.key === 'delivery' ? 'is-delivery' : ''}`}>
                            {engagementInsights[insightIndex]?.content || null}
                        </span>
                    </span>
                </div>
            </a>

            <div className="product-card-footer">
                <div className="product-price-wrap">
                    {product.oldPriceLabel && <span className="old-price">{product.oldPriceLabel}</span>}
                    <div className="product-price">
                        <span>{product.priceLabel || formatPrice(product.price, locale)}</span>
                    </div>
                    <span className="installment-text">{product.installmentText}</span>
                </div>

                <button type="button" className="product-add-cart-button" onClick={onAddToCart}>
                    <i className="pi pi-shopping-cart" aria-hidden="true"/>
                    {t('productCard.addToCart')}
                </button>
            </div>
        </div>
    );
};

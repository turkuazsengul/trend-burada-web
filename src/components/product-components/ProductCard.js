import React, {useContext, useEffect, useState} from 'react';
import {Rating} from 'primereact/rating';
import {FAVORITES_UPDATED_EVENT, initFavorites, isFavorite, toggleFavorite} from "../../service/FavoriteService";
import AppContext from "../../AppContext";

export const ProductCard = ({product}) => {
    const {t = (key) => key} = useContext(AppContext) || {};
    const [favorite, setFavorite] = useState(false);
    const productId = product?.id;

    useEffect(() => {
        const sync = () => setFavorite(isFavorite(productId));
        sync();
        initFavorites().then(sync);
        window.addEventListener(FAVORITES_UPDATED_EVENT, sync);
        return () => window.removeEventListener(FAVORITES_UPDATED_EVENT, sync);
    }, [productId]);

    const onFavoriteClick = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const next = await toggleFavorite({
            ...product,
            priceLabel: product.priceLabel,
            oldPriceLabel: product.oldPriceLabel
        });
        setFavorite(next);
    };

    return (
        <div className="product-card">
            <a href={`/detail/${product.id}`}>
                <div className="product-image-area">
                    {product.discountRate > 0 && <span className="product-discount-badge">%{product.discountRate}</span>}
                    {product.isFastDelivery && <span className="product-fast-badge">{t('productCard.fastDelivery')}</span>}
                    <button
                        type="button"
                        className={`product-favorite-toggle ${favorite ? 'is-active' : ''}`}
                        onClick={onFavoriteClick}
                        aria-label={favorite ? t('productCard.removeFavorite') : t('productCard.addFavorite')}
                    >
                        <i className={`pi ${favorite ? 'pi-heart-fill' : 'pi-heart'}`} aria-hidden="true"/>
                    </button>
                    <img className="product-img" src={product.img} alt={product.title} loading="lazy" decoding="async"/>
                </div>

                <div className="product-card-title">
                    <span className="product-brand">{product.mark}</span>
                    <span>{product.title}</span>
                </div>

                <div className="product-rating-row">
                    <div className="product-rating">
                        <Rating value={product.rating} readOnly cancel={false}/>
                    </div>
                    <span className="product-review-count">({product.reviewCount || 0})</span>
                </div>

                <div className="product-meta-row">
                    <span className="seller-score">{t('productCard.sellerScore')}: {product.sellerScore || '-'}</span>
                    {product.isFreeCargo && <span className="free-cargo">{t('productCard.freeCargo')}</span>}
                </div>

                <div className="product-price-wrap">
                    {product.oldPriceLabel && <span className="old-price">{product.oldPriceLabel}</span>}
                    <div className="product-price">
                        <span>{product.priceLabel || product.price}</span>
                    </div>
                    <span className="installment-text">{product.installmentText}</span>
                </div>
            </a>
        </div>
    );
};

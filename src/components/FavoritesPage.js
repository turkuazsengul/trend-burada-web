import React, {useEffect, useMemo, useState} from "react";
import {ProductCard} from "./product-components/ProductCard";
import {FAVORITES_UPDATED_EVENT, getFavorites, getFavoritesFromService} from "../service/FavoriteService";

const formatPrice = (price) => `${Number(price || 0).toLocaleString('tr-TR')} TL`;

export const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const syncFavorites = () => {
            setFavorites(getFavorites());
        };

        syncFavorites();
        getFavoritesFromService().then(syncFavorites).finally(() => setLoading(false));
        window.addEventListener('storage', syncFavorites);
        window.addEventListener(FAVORITES_UPDATED_EVENT, syncFavorites);

        return () => {
            window.removeEventListener('storage', syncFavorites);
            window.removeEventListener(FAVORITES_UPDATED_EVENT, syncFavorites);
        };
    }, []);

    const favoriteProducts = useMemo(() => {
        return favorites.map((item) => ({
            ...item,
            priceLabel: item.priceLabel || formatPrice(item.price),
            oldPriceLabel: item.oldPriceLabel || formatPrice(item.oldPrice)
        }));
    }, [favorites]);

    return (
        <div className="catalog favorites-page">
            <div className="favorites-header">
                <h1>Favorilerim</h1>
                <span>{favoriteProducts.length} ürün</span>
            </div>

            {loading && (
                <div className="favorites-empty-state">
                    <h3>Favoriler yükleniyor...</h3>
                </div>
            )}

            {!loading && favoriteProducts.length === 0 && (
                <div className="favorites-empty-state">
                    <h3>Henüz favori ürününüz yok</h3>
                    <p>Beğendiğiniz ürünlerin kalp ikonuna tıklayarak bu alana ekleyebilirsiniz.</p>
                    <a href="/" className="favorites-empty-cta">Alışverişe Başla</a>
                </div>
            )}

            {!loading && favoriteProducts.length > 0 && (
                <div className="product-list favorites-list">
                    {favoriteProducts.map((product) => (
                        <div key={product.id} className="product-card-items">
                            <ProductCard product={product}/>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

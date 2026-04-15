import React, {useContext, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {ProductFilter} from "./ProductFilter";
import {ProductCard} from "./ProductCard";
import ProductService from "../../service/ProductService";
import AppContext from "../../AppContext";
import {
    getCategoryFacets,
    getMenuItemsByCategory,
    PRICE_RANGES,
} from "../../data/demoProductData";

const normalizeSlug = (raw = '') => {
    return decodeURIComponent(raw)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ı/g, 'i')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

const normalizeCategoryKey = (rawSlug) => {
    const slug = normalizeSlug(rawSlug);
    const aliases = {
        'ti-sort': 'tisort',
        'tisort': 'tisort',
        't-shirt': 'tisort',
        'gomlek': 'gomlek'
    };

    return aliases[slug] || slug;
};

const formatPrice = (price, locale) => `${Number(price || 0).toLocaleString(locale)} TL`;

const matchesPriceRange = (price, rangeValue) => {
    const range = PRICE_RANGES.find((x) => x.value === rangeValue);
    return range ? range.check(price) : true;
};

export const ProductPage = ({match}) => {
    const {t = (key) => key, language = 'tr'} = useContext(AppContext) || {};
    const locale = language === 'en' ? 'en-US' : 'tr-TR';
    const categoryKey = normalizeCategoryKey(match.params.id || 'elbise');
    const menuItems = useMemo(() => getMenuItemsByCategory(categoryKey), [categoryKey]);
    const catalogRef = useRef(null);
    const productContentRef = useRef(null);

    const [products, setProducts] = useState([]);
    const [serviceFacets, setServiceFacets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const [selectedFilters, setSelectedFilters] = useState({
        mark: [],
        size: [],
        color: [],
        priceRange: [],
        rating: [],
        sellerScore: [],
        discountRate: [],
        isFastDelivery: [],
        isFreeCargo: [],
        installmentText: []
    });

    useEffect(() => {
        setLoading(true);
        setSelectedFilters({});
        setIsMobileFilterOpen(false);

        Promise.all([
            ProductService.getProductsByCategory(categoryKey),
            ProductService.getFacetsByCategory(categoryKey)
        ]).then(([productList, facetList]) => {
            setProducts(Array.isArray(productList) ? productList : []);
            setServiceFacets(Array.isArray(facetList) ? facetList : []);
        }).finally(() => setLoading(false));
    }, [categoryKey]);

    useLayoutEffect(() => {
        const updateFooterVisibility = () => {
            const content = productContentRef.current;
            if (!content) {
                document.body.classList.remove('hide-global-footer');
                return;
            }

            const hasOverflow = content.scrollHeight > content.clientHeight + 4;
            const isAtBottom = content.scrollTop + content.clientHeight >= content.scrollHeight - 8;

            // Footer appears only when product stream is fully consumed.
            if (hasOverflow && !isAtBottom) {
                document.body.classList.add('hide-global-footer');
            } else {
                document.body.classList.remove('hide-global-footer');
            }
        };

        // Hide footer immediately on mount to prevent first-paint flicker.
        document.body.classList.add('hide-global-footer');

        const content = productContentRef.current;
        const catalog = catalogRef.current;
        let resizeObserver;
        let raf1;
        let raf2;

        updateFooterVisibility();
        raf1 = window.requestAnimationFrame(updateFooterVisibility);
        raf2 = window.requestAnimationFrame(updateFooterVisibility);

        if (content) {
            content.addEventListener('scroll', updateFooterVisibility, {passive: true});
            content.addEventListener('load', updateFooterVisibility, true);
        }

        window.addEventListener('resize', updateFooterVisibility, {passive: true});

        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(updateFooterVisibility);
            if (content) {
                resizeObserver.observe(content);
            }
            if (catalog) {
                resizeObserver.observe(catalog);
            }
        }

        return () => {
            if (raf1) {
                window.cancelAnimationFrame(raf1);
            }
            if (raf2) {
                window.cancelAnimationFrame(raf2);
            }
            if (content) {
                content.removeEventListener('scroll', updateFooterVisibility);
                content.removeEventListener('load', updateFooterVisibility, true);
            }
            window.removeEventListener('resize', updateFooterVisibility);
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
            document.body.classList.remove('hide-global-footer');
        };
    }, [categoryKey, loading, products.length]);

    const filters = useMemo(() => {
        if (serviceFacets.length > 0) {
            return serviceFacets;
        }

        return getCategoryFacets(categoryKey);
    }, [serviceFacets, categoryKey]);

    const filteredProducts = useMemo(() => {
        const matchesFilter = (product, key, value) => {
            if (key === 'priceRange') {
                return matchesPriceRange(product.price, value);
            }

            if (key === 'rating') {
                if (value === '4.5+') return Number(product.rating || 0) >= 4.5;
                if (value === '4.0+') return Number(product.rating || 0) >= 4.0;
                if (value === '3.5+') return Number(product.rating || 0) >= 3.5;
                return true;
            }

            if (key === 'sellerScore') {
                const score = Number(product.sellerScore || 0);
                if (value === '9.5+') return score >= 9.5;
                if (value === '9.0-9.4') return score >= 9.0 && score < 9.5;
                if (value === '8.5-8.9') return score >= 8.5 && score < 9.0;
                return true;
            }

            if (key === 'discountRate') {
                const discount = Number(product.discountRate || 0);
                if (value === '10+') return discount >= 10;
                if (value === '20+') return discount >= 20;
                if (value === '30+') return discount >= 30;
                return true;
            }

            if (key === 'isFastDelivery' || key === 'isFreeCargo') {
                const boolValue = value === 'true';
                return Boolean(product[key]) === boolValue;
            }

            return String(product[key] || '').toLowerCase() === String(value || '').toLowerCase();
        };

        return products.filter((product) => {
            return Object.entries(selectedFilters).every(([key, values]) => {
                if (!Array.isArray(values) || values.length === 0) {
                    return true;
                }

                return values.some((value) => matchesFilter(product, key, value));
            });
        });
    }, [products, selectedFilters]);

    const handleFilterChange = (filterKey, value) => {
        setSelectedFilters((prev) => {
            const currentValues = prev[filterKey] || [];
            const exists = currentValues.includes(value);
            const nextValues = exists
                ? currentValues.filter((item) => item !== value)
                : [...currentValues, value];

            return {
                ...prev,
                [filterKey]: nextValues
            };
        });
    };

    const clearAllFilters = () => {
        setSelectedFilters({});
    };

    const hasActiveFilter = Object.values(selectedFilters || {}).some((values) => Array.isArray(values) && values.length > 0);

    return (
        <div className="catalog product-page-shell">
            <div
                ref={catalogRef}
                className="product-catalog"
            >
                <aside className={`product-filter ${isMobileFilterOpen ? 'is-mobile-open' : ''}`}>
                    <ProductFilter
                        filterItemList={filters}
                        selectedFilters={selectedFilters}
                        onFilterChange={handleFilterChange}
                        menuItems={menuItems}
                        activeMenuKey={categoryKey}
                    />
                </aside>

                <section ref={productContentRef} className="product-content">
                    <div className="product-toolbar">
                        <div className="product-toolbar-left">
                            <button
                                type="button"
                                className="product-filter-toggle-btn"
                                onClick={() => setIsMobileFilterOpen((prev) => !prev)}
                            >
                                <i className={`pi ${isMobileFilterOpen ? 'pi-sliders-h' : 'pi-filter'}`}/>
                                <span>
                                    {isMobileFilterOpen ? t('productFilter.hideFilters') : t('productFilter.showFilters')}
                                </span>
                            </button>
                            {hasActiveFilter && (
                                <button
                                    type="button"
                                    className="product-filter-clear-btn"
                                    onClick={clearAllFilters}
                                >
                                    {t('productFilter.clearFilters')}
                                </button>
                            )}
                        </div>
                        <span>{t('productList.listingCount', {count: filteredProducts.length})}</span>
                    </div>

                    {loading && <div className="product-empty-state">{t('productList.loading')}</div>}

                    {!loading && (
                        <div className="product-list">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="product-card-items">
                                    <ProductCard
                                        product={{
                                            ...product,
                                            priceLabel: formatPrice(product.price, locale),
                                            oldPriceLabel: formatPrice(product.oldPrice, locale)
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && filteredProducts.length === 0 && (
                        <div className="product-empty-state">
                            {t('productList.empty')}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

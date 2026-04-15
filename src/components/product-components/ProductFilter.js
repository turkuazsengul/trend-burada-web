import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Accordion, AccordionTab} from 'primereact/accordion';
import AppContext from "../../AppContext";

const MENU_ITEM_EN_LABELS = {
    elbise: 'Dress',
    tisort: 'T-Shirt',
    gomlek: 'Shirt',
    pantolon: 'Pants',
    ceket: 'Jacket',
    triko: 'Knitwear',
    'erkek-tisort': 'T-Shirt',
    'erkek-gomlek': 'Shirt',
    jean: 'Jeans',
    'erkek-pantolon': 'Pants',
    sweatshirt: 'Sweatshirt',
    mont: 'Coat',
    'kiz-cocuk': 'Girls',
    'erkek-cocuk': 'Boys',
    'bebek-giyim': 'Baby Clothing',
    'okul-kombinleri': 'School Outfits',
    sneaker: 'Sneakers',
    bot: 'Boots',
    'topuklu-ayakkabi': 'Heels',
    loafer: 'Loafers',
    sandalet: 'Sandals',
    canta: 'Bag',
    kemer: 'Belt',
    cuzdan: 'Wallet',
    taki: 'Jewelry',
    sapka: 'Hat',
    esofman: 'Tracksuit',
    tayt: 'Leggings',
    'spor-sutyeni': 'Sports Bra',
    hoodie: 'Hoodie',
    'kosu-urunleri': 'Running Products'
};

const FACET_TITLE_I18N_KEYS = {
    mark: 'productFilter.brand',
    brand: 'productFilter.brand',
    size: 'productFilter.size',
    color: 'productFilter.color',
    priceRange: 'productFilter.price',
    rating: 'productFilter.rating',
    sellerScore: 'productFilter.sellerScore',
    discountRate: 'productFilter.discount',
    isFastDelivery: 'productFilter.delivery',
    isFreeCargo: 'productFilter.shipping',
    installmentText: 'productFilter.paymentOption',
    __categories: 'productFilter.categories'
};

export const ProductFilter = ({
    filterItemList = [],
    selectedFilters = {},
    onFilterChange,
    onReplaceFilterGroup,
    onClearAllFilters,
    menuItems = [],
    activeMenuKey = '',
    mobileMode = false
}) => {
    const {t = (key) => key, language = 'tr'} = useContext(AppContext) || {};

    const allGroups = useMemo(() => {
        const base = [...filterItemList].map((group) => {
            const i18nKey = FACET_TITLE_I18N_KEYS[group.key];
            return {
                ...group,
                title: i18nKey ? t(i18nKey) : group.title
            };
        });

        if (menuItems.length > 0) {
            return [
                {
                    key: '__categories',
                    title: t('productFilter.categories'),
                    options: menuItems.map((item) => ({
                        value: item.slug,
                        label: language === 'en' ? (MENU_ITEM_EN_LABELS[item.slug] || item.label) : item.label
                    }))
                },
                ...base
            ];
        }

        return base;
    }, [filterItemList, menuItems, t, language]);

    const defaultActiveIndexes = useMemo(() => {
        const alwaysOpenKeys = new Set(['__categories', 'mark', 'brand']);
        return allGroups
            .map((group, index) => (alwaysOpenKeys.has(group.key) ? index : -1))
            .filter((index) => index !== -1);
    }, [allGroups]);

    const [activeIndexes, setActiveIndexes] = useState(defaultActiveIndexes);
    const [groupSearchTerms, setGroupSearchTerms] = useState({});
    const [activeMobileGroupKey, setActiveMobileGroupKey] = useState('');
    const [mobileDraftValues, setMobileDraftValues] = useState([]);

    useEffect(() => {
        setActiveIndexes(defaultActiveIndexes);
    }, [defaultActiveIndexes]);

    useEffect(() => {
        setGroupSearchTerms((prev) => {
            const next = {};
            allGroups.forEach((group) => {
                next[group.key] = prev[group.key] || '';
            });
            return next;
        });
    }, [allGroups]);

    useEffect(() => {
        if (!mobileMode) {
            return;
        }

        if (!activeMobileGroupKey) {
            setMobileDraftValues([]);
            return;
        }

        if (activeMobileGroupKey === '__categories') {
            setMobileDraftValues(activeMenuKey ? [activeMenuKey] : []);
            return;
        }

        setMobileDraftValues(selectedFilters[activeMobileGroupKey] || []);
    }, [mobileMode, activeMobileGroupKey, selectedFilters, activeMenuKey]);

    const hasActiveFilter = Object.values(selectedFilters || {}).some((values) => Array.isArray(values) && values.length > 0);

    const handleGroupSearchChange = (groupKey, value) => {
        setGroupSearchTerms((prev) => ({
            ...prev,
            [groupKey]: value
        }));
    };

    const renderOptions = (group, options, selectedValues, onToggleValue) => {
        return (
            <>
                {options.map((option) => {
                    const inputId = `${group.key}-${option.value}`;
                    const isChecked = selectedValues.includes(option.value);

                    return (
                        <div key={inputId} className="field-checkbox filter-checkbox-row">
                            <input
                                id={inputId}
                                type="checkbox"
                                name={group.key}
                                value={option.value}
                                checked={isChecked}
                                className="filter-checkbox-input"
                                onChange={() => onToggleValue(option.value)}
                            />
                            <label className="filter-option-label" htmlFor={inputId}>
                                <span className="filter-option-text">{option.label}</span>
                            </label>
                        </div>
                    );
                })}

                {options.length === 0 && (
                    <div className="facet-empty-result">{t('productFilter.noResult')}</div>
                )}
            </>
        );
    };

    if (mobileMode) {
        const activeGroup = allGroups.find((group) => group.key === activeMobileGroupKey);
        const activeSearchTerm = (groupSearchTerms[activeMobileGroupKey] || '').trim().toLowerCase();
        const visibleOptions = activeGroup
            ? (activeSearchTerm
                ? activeGroup.options.filter((option) => String(option.label || '').toLowerCase().includes(activeSearchTerm))
                : activeGroup.options)
            : [];

        const toggleMobileDraftValue = (value) => {
            setMobileDraftValues((prev) => {
                if (activeMobileGroupKey === '__categories') {
                    return [value];
                }

                return prev.includes(value)
                    ? prev.filter((item) => item !== value)
                    : [...prev, value];
            });
        };

        const applyMobileGroup = () => {
            if (!activeMobileGroupKey) {
                return;
            }

            if (activeMobileGroupKey === '__categories') {
                const selectedCategory = mobileDraftValues[0] || '';
                if (selectedCategory && selectedCategory !== activeMenuKey) {
                    window.location.href = `/product/${selectedCategory}`;
                }
                setActiveMobileGroupKey('');
                return;
            }

            if (onReplaceFilterGroup) {
                onReplaceFilterGroup(activeMobileGroupKey, mobileDraftValues);
            }
            setActiveMobileGroupKey('');
        };

        return (
            <div className="mobile-filter-shell">
                <div className="mobile-filter-strip" role="tablist" aria-label={t('productFilter.mobileFilterAria')}>
                    {allGroups.map((group) => {
                        const count = group.key === '__categories'
                            ? (activeMenuKey ? 1 : 0)
                            : (selectedFilters[group.key] || []).length;

                        return (
                            <button
                                key={group.key}
                                type="button"
                                className={`mobile-filter-chip ${activeMobileGroupKey === group.key ? 'is-active' : ''}`}
                                onClick={() => setActiveMobileGroupKey((prev) => (prev === group.key ? '' : group.key))}
                            >
                                <span>{group.title}</span>
                                {count > 0 && <b>{count}</b>}
                            </button>
                        );
                    })}

                    {hasActiveFilter && (
                        <button type="button" className="mobile-filter-reset" onClick={onClearAllFilters}>
                            {t('productFilter.clearFilters')}
                        </button>
                    )}
                </div>

                {activeGroup && (
                    <div
                        className="mobile-filter-overlay"
                        onClick={() => setActiveMobileGroupKey('')}
                    >
                        <div
                            className="mobile-filter-panel"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="mobile-filter-panel-head">
                                <strong>{activeGroup.title}</strong>
                                <button type="button" onClick={() => setActiveMobileGroupKey('')}>
                                    <i className="pi pi-times"/>
                                </button>
                            </div>

                            <div className="facet-search-area">
                                <input
                                    type="text"
                                    className="facet-search-input"
                                    placeholder={t('productFilter.searchPlaceholder', {title: activeGroup.title})}
                                    value={groupSearchTerms[activeGroup.key] || ''}
                                    onChange={(event) => handleGroupSearchChange(activeGroup.key, event.target.value)}
                                />
                            </div>

                            <div className="facet-options-scroll mobile-facet-options-scroll">
                                <div className="filter-options-list">
                                    {renderOptions(activeGroup, visibleOptions, mobileDraftValues, toggleMobileDraftValue)}
                                </div>
                            </div>

                            <div className="mobile-filter-panel-actions">
                                <button type="button" className="mobile-filter-cancel" onClick={() => setActiveMobileGroupKey('')}>
                                    {t('productFilter.cancel')}
                                </button>
                                <button type="button" className="mobile-filter-apply" onClick={applyMobileGroup}>
                                    {t('productFilter.apply')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div>
            <div className="product-filter-panel">
                <Accordion
                    multiple
                    activeIndex={activeIndexes}
                    expandIcon="pi pi-chevron-down"
                    collapseIcon="pi pi-chevron-down"
                    onTabChange={(event) => setActiveIndexes(event.index)}
                >
                    {allGroups.map((group) => {
                        const searchTerm = (groupSearchTerms[group.key] || '').trim().toLowerCase();
                        const visibleOptions = searchTerm
                            ? group.options.filter((option) => String(option.label || '').toLowerCase().includes(searchTerm))
                            : group.options;

                        const checkedValues = group.key === '__categories'
                            ? (activeMenuKey ? [activeMenuKey] : [])
                            : (selectedFilters[group.key] || []);

                        return (
                            <AccordionTab key={group.key} header={group.title} className="product-filter-items">
                                <div className="facet-search-area">
                                    <input
                                        type="text"
                                        className="facet-search-input"
                                        placeholder={t('productFilter.searchPlaceholder', {title: group.title})}
                                        value={groupSearchTerms[group.key] || ''}
                                        onChange={(event) => handleGroupSearchChange(group.key, event.target.value)}
                                    />
                                </div>
                                <div className="facet-options-scroll">
                                    <div className="filter-options-list">
                                        {renderOptions(group, visibleOptions, checkedValues, (value) => {
                                            if (group.key === '__categories') {
                                                if (value !== activeMenuKey) {
                                                    window.location.href = `/product/${value}`;
                                                }
                                                return;
                                            }
                                            onFilterChange(group.key, value);
                                        })}
                                    </div>
                                </div>
                            </AccordionTab>
                        );
                    })}
                </Accordion>
            </div>
        </div>
    );
};

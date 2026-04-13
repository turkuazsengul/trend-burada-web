import React, {useEffect, useMemo, useState} from 'react';
import {Accordion, AccordionTab} from 'primereact/accordion';

export const ProductFilter = ({
    filterItemList = [],
    selectedFilters = {},
    onFilterChange,
    menuItems = [],
    activeMenuKey = ''
}) => {
    const allGroups = useMemo(() => {
        const base = [...filterItemList];
        if (menuItems.length > 0) {
            return [
                {
                    key: '__categories',
                    title: 'Kategoriler',
                    options: menuItems.map((item) => ({
                        value: item.slug,
                        label: item.label
                    }))
                },
                ...base
            ];
        }
        return base;
    }, [filterItemList, menuItems]);

    const defaultActiveIndexes = useMemo(() => {
        const alwaysOpenKeys = new Set(['__categories', 'mark', 'brand']);
        return allGroups
            .map((group, index) => (alwaysOpenKeys.has(group.key) ? index : -1))
            .filter((index) => index !== -1);
    }, [allGroups]);
    const [activeIndexes, setActiveIndexes] = useState(defaultActiveIndexes);
    const [groupSearchTerms, setGroupSearchTerms] = useState({});

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

    const handleGroupSearchChange = (groupKey, value) => {
        setGroupSearchTerms((prev) => ({
            ...prev,
            [groupKey]: value
        }));
    };

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

                        return (
                        <AccordionTab key={group.key} header={group.title} className="product-filter-items">
                            <div className="facet-search-area">
                                <input
                                    type="text"
                                    className="facet-search-input"
                                    placeholder={`${group.title} ara`}
                                    value={groupSearchTerms[group.key] || ''}
                                    onChange={(event) => handleGroupSearchChange(group.key, event.target.value)}
                                />
                            </div>
                            <div className="facet-options-scroll">
                                <div className="filter-options-list">
                                {visibleOptions.map((option) => {
                                if (group.key === '__categories') {
                                    const isActive = option.value === activeMenuKey;
                                    return (
                                        <div key={`cat-${option.value}`} className="field-checkbox filter-checkbox-row">
                                            <input
                                                id={`cat-${option.value}`}
                                                type="checkbox"
                                                className="filter-checkbox-input"
                                                checked={isActive}
                                                onChange={() => {
                                                    if (!isActive) {
                                                        window.location.href = `/product/${option.value}`;
                                                    }
                                                }}
                                            />
                                            <label className="filter-option-label" htmlFor={`cat-${option.value}`}>
                                                <span className="filter-option-text">{option.label}</span>
                                            </label>
                                        </div>
                                    );
                                }

                                const checkedValues = selectedFilters[group.key] || [];
                                const isChecked = checkedValues.includes(option.value);
                                const inputId = `${group.key}-${option.value}`;

                                return (
                                    <div key={inputId} className="field-checkbox filter-checkbox-row">
                                        <input
                                            id={inputId}
                                            type="checkbox"
                                            name={group.key}
                                            value={option.value}
                                            checked={isChecked}
                                            className="filter-checkbox-input"
                                            onChange={() => onFilterChange(group.key, option.value)}
                                        />
                                        <label className="filter-option-label" htmlFor={inputId}>
                                            <span className="filter-option-text">{option.label}</span>
                                        </label>
                                    </div>
                                );
                                })}
                                {visibleOptions.length === 0 && (
                                    <div className="facet-empty-result">Sonuc bulunamadi</div>
                                )}
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

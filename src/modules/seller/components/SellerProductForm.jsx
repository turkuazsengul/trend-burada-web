import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Button} from 'primereact/button';
import {Dropdown} from 'primereact/dropdown';
import {InputText} from 'primereact/inputtext';
import AuthService from '../../../service/AuthService';
import {
    categoryPathLooksComplete,
    findCategoryPathByValue,
    getBrandOptionsForSeller,
    getCategoryLevelOptions,
    getCategoryPathPreview,
    getCategoryValueFromPath,
    getSellerProfile
} from '../data/sellerCatalogConfig';

const levelLabels = ['Ana kategori', 'Alt kategori', 'Detay kategori', 'Son kategori'];
const installmentOptions = [
    {label: 'Pesin fiyatina', value: 'Pesin fiyatina'},
    {label: '2 taksit', value: '2 taksit'},
    {label: '3 taksit', value: '3 taksit'},
    {label: '4 taksit', value: '4 taksit'},
    {label: '6 taksit', value: '6 taksit'}
];

const normalizeInitialForm = (initialForm) => {
    const incomingPath = Array.isArray(initialForm?.categoryPath) ? initialForm.categoryPath.filter(Boolean) : [];
    const derivedPath = incomingPath.length ? incomingPath : findCategoryPathByValue(initialForm?.category);

    return {
        title: initialForm?.title || '',
        category: initialForm?.category || '',
        categoryPath: derivedPath,
        brand: initialForm?.brand || '',
        productCode: initialForm?.productCode || '',
        imageUrl: initialForm?.imageUrl || '',
        price: initialForm?.price || '',
        oldPrice: initialForm?.oldPrice || '',
        discountRate: initialForm?.discountRate || '',
        color: initialForm?.color || '',
        size: initialForm?.size || '',
        installmentText: initialForm?.installmentText || 'Pesin fiyatina',
        freeCargo: Boolean(initialForm?.freeCargo),
        fastDelivery: Boolean(initialForm?.fastDelivery)
    };
};

const requiredFieldOrder = ['title', 'brand', 'categoryPath', 'imageUrl', 'price', 'installmentText'];

const getValidationErrors = (form) => {
    const errors = {};

    if (!String(form.title || '').trim()) {
        errors.title = 'Urun basligi zorunludur.';
    }
    if (!String(form.brand || '').trim()) {
        errors.brand = 'Marka secimi zorunludur.';
    }
    if (!categoryPathLooksComplete(form.categoryPath)) {
        errors.categoryPath = 'Kategori secimi tamamlanmalidir.';
    }
    if (!String(form.imageUrl || '').trim()) {
        errors.imageUrl = 'Gorsel URL zorunludur.';
    }
    if (!String(form.price || '').trim()) {
        errors.price = 'Fiyat zorunludur.';
    }
    if (!String(form.installmentText || '').trim()) {
        errors.installmentText = 'Taksit secimi zorunludur.';
    }

    return errors;
};

const formatPricePreview = (value) => `${Number(value || 0).toLocaleString('tr-TR')} TL`;

export const SellerProductForm = ({
    initialForm,
    submitting = false,
    errorMessage = '',
    submitLabel,
    submitIcon = 'pi pi-check',
    onCancel,
    onSubmit,
    submitDisabled = false
}) => {
    const currentUser = AuthService.getCurrentUser();
    const sellerProfile = useMemo(() => getSellerProfile(currentUser), [currentUser]);
    const brandOptions = useMemo(() => getBrandOptionsForSeller(currentUser), [currentUser]);
    const [form, setForm] = useState(() => normalizeInitialForm(initialForm));
    const [validationErrors, setValidationErrors] = useState({});
    const [isDetailPreviewOpen, setIsDetailPreviewOpen] = useState(false);
    const fieldRefs = useRef({});

    useEffect(() => {
        setForm(normalizeInitialForm(initialForm));
        setValidationErrors({});
    }, [initialForm]);

    const categoryLevels = useMemo(() => {
        const levels = [];
        let prefix = [];

        for (let index = 0; index < 4; index += 1) {
            const options = getCategoryLevelOptions(prefix);
            if (!options.length) {
                break;
            }

            levels.push({
                index,
                label: levelLabels[index] || `Seviye ${index + 1}`,
                options,
                value: form.categoryPath[index] || null
            });

            const selectedValue = form.categoryPath[index];
            if (!selectedValue) {
                break;
            }

            prefix = [...prefix, selectedValue];
        }

        return levels;
    }, [form.categoryPath]);

    const selectedCategoryPreview = useMemo(() => getCategoryPathPreview(form.categoryPath), [form.categoryPath]);
    const previewBrand = form.brand || sellerProfile.allowedBrands[0] || 'Marka';
    const previewTitle = form.title || 'Urun basligi burada gorunecek';
    const previewPrice = formatPricePreview(form.price || 0);
    const previewOldPrice = Number(form.oldPrice || 0) > 0 ? formatPricePreview(form.oldPrice) : null;
    const previewDiscount = Number(form.discountRate || 0);

    const registerFieldRef = (fieldKey, node) => {
        if (node) {
            fieldRefs.current[fieldKey] = node;
        }
    };

    const focusFirstInvalidField = (errors) => {
        const targetKey = requiredFieldOrder.find((fieldKey) => errors[fieldKey]);
        if (!targetKey) {
            return;
        }

        const node = fieldRefs.current[targetKey];
        if (!node) {
            return;
        }

        if (typeof node.focus === 'function') {
            node.focus();
            return;
        }

        const focusable = node.querySelector?.('input, button, [tabindex]');
        if (focusable && typeof focusable.focus === 'function') {
            focusable.focus();
        }
    };

    const clearValidationFor = (key) => {
        setValidationErrors((prev) => {
            if (!prev[key]) {
                return prev;
            }
            const next = {...prev};
            delete next[key];
            return next;
        });
    };

    const updateField = (key, value) => {
        setForm((prev) => ({...prev, [key]: value}));
        clearValidationFor(key);
    };

    const updateCategoryLevel = (levelIndex, value) => {
        setForm((prev) => {
            const nextPath = prev.categoryPath.slice(0, levelIndex);
            if (value) {
                nextPath[levelIndex] = value;
            }

            return {
                ...prev,
                categoryPath: nextPath,
                category: getCategoryValueFromPath(nextPath)
            };
        });
        clearValidationFor('categoryPath');
    };

    const handleSubmit = () => {
        const errors = getValidationErrors(form);
        setValidationErrors(errors);

        if (Object.keys(errors).length > 0) {
            focusFirstInvalidField(errors);
        }

        const payload = {
            ...form,
            category: getCategoryValueFromPath(form.categoryPath)
        };

        if (onSubmit) {
            onSubmit({form: payload, isValid: Object.keys(errors).length === 0});
        }
    };

    const renderCategoryFieldError = (index) => (
        validationErrors.categoryPath && index === 0 ? <small>{validationErrors.categoryPath}</small> : <small>Kategori breadcrumb ve urun konumunu belirler.</small>
    );

    return (
        <>
            <div className="seller-form-card">
                <div className="seller-form-header-grid">
                    <div>
                        <span className="seller-form-header-label">Satici baglami</span>
                        <strong>{sellerProfile.panelLabel}</strong>
                        <p>{sellerProfile.notes}</p>
                    </div>
                    <div>
                        <span className="seller-form-header-label">Marka havuzu</span>
                        <strong>{sellerProfile.allowedBrands.join(', ')}</strong>
                        <p>Marka secimi seller'a atanmis marka listesiyle sinirli tutulur.</p>
                    </div>
                </div>

                <div className="seller-form-preview-toolbar">
                    <div>
                        <span className="seller-form-header-label">Canli onizleme</span>
                        <strong>Liste karti gorunumu</strong>
                    </div>
                    <Button label="Detay onizle" className="p-button-outlined" icon="pi pi-external-link" onClick={() => setIsDetailPreviewOpen(true)}/>
                </div>

                <div className="seller-product-card-preview">
                    <div className="seller-product-card-media">
                        {form.imageUrl ? <img src={form.imageUrl} alt={previewTitle}/> : <div className="seller-product-card-placeholder">Gorsel</div>}
                        {previewDiscount > 0 ? <span className="seller-product-card-discount">%{previewDiscount}</span> : null}
                    </div>
                    <div className="seller-product-card-body">
                        <div className="seller-product-card-title">
                            <span>{previewBrand}</span>
                            <strong>{previewTitle}</strong>
                        </div>
                        <div className="seller-product-card-price">
                            {previewOldPrice ? <span className="seller-product-card-old">{previewOldPrice}</span> : null}
                            <strong>{previewPrice}</strong>
                        </div>
                        <div className="seller-product-card-installment">{form.installmentText || 'Pesin fiyatina'}</div>
                    </div>
                </div>

                <div className="seller-form-grid">
                    <label className={`seller-form-field ${validationErrors.title ? 'is-invalid' : ''}`}>
                        <span>Urun basligi <em>*</em></span>
                        <InputText ref={(node) => registerFieldRef('title', node)} value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder="Orn. Premium Kruvaze Midi Elbise"/>
                        {validationErrors.title ? <small>{validationErrors.title}</small> : <small>Urun kartinda ve detay sayfasinda gorunur.</small>}
                    </label>

                    <label className={`seller-form-field ${validationErrors.brand ? 'is-invalid' : ''}`}>
                        <span>Marka <em>*</em></span>
                        <Dropdown
                            inputRef={(node) => registerFieldRef('brand', node)}
                            value={form.brand || null}
                            options={brandOptions}
                            onChange={(e) => updateField('brand', e.value || '')}
                            placeholder="Marka sec"
                            className="seller-dropdown seller-dropdown-compact"
                        />
                        {validationErrors.brand ? <small>{validationErrors.brand}</small> : <small>Liste karti ve detay basliginda marka olarak gorunur.</small>}
                    </label>

                    {categoryLevels.map((level, index) => (
                        <label key={level.index} className={`seller-form-field ${validationErrors.categoryPath && index === 0 ? 'is-invalid' : ''}`}>
                            <span>{level.label}{index === 0 ? ' *' : ''}</span>
                            <Dropdown
                                inputRef={(node) => index === 0 ? registerFieldRef('categoryPath', node) : undefined}
                                value={level.value}
                                options={level.options}
                                onChange={(e) => updateCategoryLevel(level.index, e.value || '')}
                                placeholder={`${level.label} sec`}
                                className="seller-dropdown seller-dropdown-compact"
                            />
                            {renderCategoryFieldError(index)}
                        </label>
                    ))}

                    <label className="seller-form-field">
                        <span>Urun kodu</span>
                        <InputText value={form.productCode} onChange={(e) => updateField('productCode', e.target.value)} placeholder="Opsiyonel"/>
                        <small>Yonetim tarafinda referans icin kullanilir.</small>
                    </label>

                    <label className={`seller-form-field ${validationErrors.imageUrl ? 'is-invalid' : ''}`}>
                        <span>Gorsel URL <em>*</em></span>
                        <InputText ref={(node) => registerFieldRef('imageUrl', node)} value={form.imageUrl} onChange={(e) => updateField('imageUrl', e.target.value)} placeholder="https://..."/>
                        {validationErrors.imageUrl ? <small>{validationErrors.imageUrl}</small> : <small>Liste karti ve detay galerisi burada kullanilir.</small>}
                    </label>

                    <label className={`seller-form-field ${validationErrors.price ? 'is-invalid' : ''}`}>
                        <span>Satis fiyati <em>*</em></span>
                        <InputText ref={(node) => registerFieldRef('price', node)} value={form.price} onChange={(e) => updateField('price', e.target.value)} placeholder="1899.90"/>
                        {validationErrors.price ? <small>{validationErrors.price}</small> : <small>Liste ve detay ekraninin ana fiyat alanidir.</small>}
                    </label>

                    <label className="seller-form-field">
                        <span>Eski fiyat</span>
                        <InputText value={form.oldPrice} onChange={(e) => updateField('oldPrice', e.target.value)} placeholder="2199.90"/>
                        <small>Varsa ustu cizili fiyat olarak gorunur.</small>
                    </label>

                    <label className="seller-form-field">
                        <span>Indirim orani</span>
                        <InputText value={form.discountRate} onChange={(e) => updateField('discountRate', e.target.value)} placeholder="15"/>
                        <small>Liste kartinda indirim etiketi olur.</small>
                    </label>

                    <label className="seller-form-field">
                        <span>Renk</span>
                        <InputText value={form.color} onChange={(e) => updateField('color', e.target.value)} placeholder="Siyah"/>
                        <small>Detay sayfasindaki renk secimi icin kullanilir.</small>
                    </label>

                    <label className="seller-form-field">
                        <span>Beden</span>
                        <InputText value={form.size} onChange={(e) => updateField('size', e.target.value)} placeholder="S"/>
                        <small>Detay sayfasindaki beden secimi icin kullanilir.</small>
                    </label>

                    <label className={`seller-form-field ${validationErrors.installmentText ? 'is-invalid' : ''}`}>
                        <span>Taksit secenegi <em>*</em></span>
                        <Dropdown
                            inputRef={(node) => registerFieldRef('installmentText', node)}
                            value={form.installmentText || null}
                            options={installmentOptions}
                            onChange={(e) => updateField('installmentText', e.value || '')}
                            placeholder="Taksit sec"
                            className="seller-dropdown seller-dropdown-compact"
                        />
                        {validationErrors.installmentText ? <small>{validationErrors.installmentText}</small> : <small>Urun karti ve detay sayfasinda odeme secenegi olarak gorunur.</small>}
                    </label>
                </div>

                <div className="seller-checkbox-row">
                    <label><input type="checkbox" checked={form.freeCargo} onChange={(e) => updateField('freeCargo', e.target.checked)}/> Kargo bedava</label>
                    <label><input type="checkbox" checked={form.fastDelivery} onChange={(e) => updateField('fastDelivery', e.target.checked)}/> Hizli teslimat</label>
                </div>

                {errorMessage ? <div className="seller-inline-error">{errorMessage}</div> : null}
                {Object.keys(validationErrors).length > 0 ? <div className="seller-inline-warning">Zorunlu alanlari tamamlayip tekrar deneyin. Ilk eksik alana odaklanildi.</div> : null}

                <div className="seller-form-actions">
                    <Button label="Listeye don" className="p-button-text" onClick={onCancel}/>
                    <Button label={submitLabel} icon={submitIcon} loading={submitting} disabled={submitDisabled} onClick={handleSubmit}/>
                </div>
            </div>

            {isDetailPreviewOpen ? (
                <div className="seller-preview-modal-backdrop" onClick={() => setIsDetailPreviewOpen(false)}>
                    <div className="seller-preview-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="seller-preview-modal-head">
                            <div>
                                <span className="seller-form-header-label">Detay ekran onizleme</span>
                                <strong>Urun kaydedildiginde customer detail ekraninda hissedilecek yapi</strong>
                            </div>
                            <Button icon="pi pi-times" className="p-button-rounded p-button-text" onClick={() => setIsDetailPreviewOpen(false)}/>
                        </div>
                        <div className="seller-detail-preview-layout">
                            <div className="seller-detail-preview-gallery">
                                {form.imageUrl ? <img src={form.imageUrl} alt={previewTitle}/> : <div className="seller-product-card-placeholder">Gorsel</div>}
                            </div>
                            <div className="seller-detail-preview-info">
                                <h2 className="seller-detail-preview-title">
                                    <span>{previewBrand}</span>
                                    <strong>{previewTitle}</strong>
                                </h2>
                                <div className="seller-detail-preview-rating">
                                    <span>0.0</span>
                                    <div className="seller-detail-preview-stars">Henüz yorum yok</div>
                                </div>
                                <div className="seller-detail-preview-price">
                                    {previewOldPrice ? <span>{previewOldPrice}</span> : null}
                                    <strong>{previewPrice}</strong>
                                    {previewDiscount > 0 ? <em>%{previewDiscount}</em> : null}
                                </div>
                                <div className="seller-detail-preview-badges">
                                    {form.fastDelivery ? <span>Hizli teslimat</span> : null}
                                    {form.freeCargo ? <span>Kargo bedava</span> : null}
                                    <span>{form.installmentText || 'Pesin fiyatina'}</span>
                                </div>
                                <div className="seller-detail-preview-options">
                                    <div>
                                        <label>Renk</label>
                                        <strong>{form.color || 'Secilmedi'}</strong>
                                    </div>
                                    <div>
                                        <label>Beden</label>
                                        <strong>{form.size || 'Secilmedi'}</strong>
                                    </div>
                                </div>
                                <div className="seller-detail-preview-panels">
                                    <div>
                                        <label>Satici</label>
                                        <strong>{previewBrand} Magazasi</strong>
                                    </div>
                                    <div>
                                        <label>Teslimat</label>
                                        <strong>Yarin kargoda</strong>
                                    </div>
                                </div>
                                <div className="seller-detail-preview-summary">
                                    <h3>Urun ozellikleri</h3>
                                    <ul>
                                        <li>Kategori: {selectedCategoryPreview || 'Secilmedi'}</li>
                                        <li>Renk: {form.color || 'Belirtilmedi'}</li>
                                        <li>Beden: {form.size || 'Belirtilmedi'}</li>
                                        <li>Odeme secenegi: {form.installmentText || 'Pesin fiyatina'}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

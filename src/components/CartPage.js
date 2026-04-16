import React, {useContext, useEffect, useMemo, useState} from 'react';
import CartService, {CART_UPDATED_EVENT} from "../service/CartService";
import ProductService from "../service/ProductService";
import {useHistory} from "react-router-dom";
import AppContext from "../AppContext";
import UserActivityService from "../service/UserActivityService";

const formatPrice = (price, locale) => `${Number(price || 0).toLocaleString(locale, {minimumFractionDigits: 2, maximumFractionDigits: 2})} TL`;

const normalizeCardNumber = (value = '') => value.replace(/\D/g, '').slice(0, 16);
const formatCardNumber = (value = '') => normalizeCardNumber(value).replace(/(\d{4})(?=\d)/g, '$1 ');

const getInstallmentOptions = (total = 0, t) => {
    return [1, 2, 3, 4, 5, 6].map((count) => ({
        value: count,
        label: count === 1 ? t('cart.cash') : t('cart.installmentLabel', {count}),
        amount: total / count
    }));
};

export const CartPage = () => {
    const {t = (key) => key, language = 'tr'} = useContext(AppContext) || {};
    const text = (key, fallback) => {
        const value = t(key);
        return value === key ? fallback : value;
    };
    const locale = language === 'en' ? 'en-US' : 'tr-TR';
    const history = useHistory();
    const addressFallbackOptions = useMemo(() => ([]), []);
    const paymentOptions = useMemo(() => ([
        {
            id: 'card',
            label: t('cart.creditCard'),
            detail: t('cart.cardDetail')
        },
        {
            id: 'transfer',
            label: t('cart.transfer'),
            detail: t('cart.transferDetail')
        },
        {
            id: 'door',
            label: t('cart.door'),
            detail: t('cart.doorDetail')
        }
    ]), [t]);
    const [items, setItems] = useState([]);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [recentlyViewedFallback, setRecentlyViewedFallback] = useState([]);
    const [campaignProducts, setCampaignProducts] = useState([]);
    const discountRates = [10, 20, 30, 40];
    const [addressOptions, setAddressOptions] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [selectedPayment, setSelectedPayment] = useState(paymentOptions[0].id);
    const [completed, setCompleted] = useState(false);
    const [selectedInstallment, setSelectedInstallment] = useState(1);
    const [isInstallmentOpen, setIsInstallmentOpen] = useState(false);
    const [bankModalOpen, setBankModalOpen] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [otpError, setOtpError] = useState('');
    const [checkoutStep, setCheckoutStep] = useState(1);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [newAddressForm, setNewAddressForm] = useState({
        title: '',
        city: '',
        district: '',
        phone: '',
        fullAddress: '',
        type: 'home'
    });
    const [cardForm, setCardForm] = useState({
        cardNumber: '',
        holderName: '',
        expiry: '',
        cvv: ''
    });
    const [viewedStart, setViewedStart] = useState(0);
    const [recoStart, setRecoStart] = useState(0);
    const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);
    const [mobileCheckoutOpen, setMobileCheckoutOpen] = useState(false);

    const reloadCart = () => {
        setItems(CartService.getCartItems());
    };

    useEffect(() => {
        reloadCart();
        const onCartUpdate = () => {
            reloadCart();
        };

        window.addEventListener(CART_UPDATED_EVENT, onCartUpdate);
        return () => window.removeEventListener(CART_UPDATED_EVENT, onCartUpdate);
    }, []);

    useEffect(() => {
        setRecentlyViewed(UserActivityService.getViewedProducts());
    }, []);

    useEffect(() => {
        ProductService.getProductsByCategory('kadin').then((list) => {
            if (Array.isArray(list) && list.length > 0) {
                setRecentlyViewedFallback(list.slice(0, 12));
            } else {
                setRecentlyViewedFallback([]);
            }
        }).catch(() => setRecentlyViewedFallback([]));
    }, []);

    useEffect(() => {
        ProductService.getAllProducts().then((list) => {
            const safeList = Array.isArray(list) ? list : [];
            const sorted = [...safeList].sort((a, b) => Number(b?.discountRate || 0) - Number(a?.discountRate || 0));
            setCampaignProducts(sorted.slice(0, 12));
        }).catch(() => setCampaignProducts([]));
    }, []);

    useEffect(() => {
        const onResize = () => setViewportWidth(window.innerWidth);
        window.addEventListener('resize', onResize, {passive: true});
        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        const userRaw = localStorage.getItem('user');
        let userId = 'guest';
        if (userRaw) {
            try {
                const parsedUser = JSON.parse(userRaw);
                userId = parsedUser?.pkId || parsedUser?.id || 'guest';
            } catch (e) {
                userId = 'guest';
            }
        }

        const addressStorageKey = `tb_addresses_${userId}`;
        const addressRaw = localStorage.getItem(addressStorageKey);
        if (!addressRaw) {
            setAddressOptions([]);
            return;
        }

        try {
            const parsedAddresses = JSON.parse(addressRaw);
            if (!Array.isArray(parsedAddresses) || parsedAddresses.length === 0) {
                setAddressOptions([]);
                return;
            }

            const mapTypeLabel = (type) => type === 'work' ? t('cart.workAddress') : t('cart.homeAddress');

            const mapped = parsedAddresses.map((item, index) => {
                const city = String(item?.city || '').trim();
                const district = String(item?.district || '').trim();
                const fullAddress = String(item?.fullAddress || '').trim();
                const location = [district, city].filter(Boolean).join(' / ');
                const detail = [fullAddress, location].filter(Boolean).join(' - ');
                const title = String(item?.title || '').trim();

                return {
                    id: item?.id || `saved-address-${index}`,
                    label: title || mapTypeLabel(item?.type),
                    detail: detail || t('cart.addressDetailFallback'),
                    isDefault: Boolean(item?.isDefault)
                };
            });

            setAddressOptions(mapped);
        } catch (e) {
            setAddressOptions([]);
        }
    }, [addressFallbackOptions, t]);

    useEffect(() => {
        if (addressOptions.length === 0) {
            setSelectedAddress('');
            return;
        }

        const stillExists = addressOptions.some((option) => option.id === selectedAddress);
        if (stillExists) {
            return;
        }

        const defaultOption = addressOptions.find((option) => option.isDefault) || addressOptions[0];
        setSelectedAddress(defaultOption.id);
    }, [addressOptions, selectedAddress]);

    useEffect(() => {
        const firstItem = items[0];
        if (!firstItem?.id) {
            setSuggestedProducts([]);
            return;
        }

        ProductService.getRelatedProductsByProductId(firstItem.id, 8).then((list) => {
            setSuggestedProducts(Array.isArray(list) ? list : []);
        });
    }, [items]);

    const summary = CartService.getCartSummary();
    const installmentOptions = getInstallmentOptions(Number(summary.total || 0), t);
    const selectedInstallmentLabel = installmentOptions.find((item) => item.value === selectedInstallment)?.label || t('cart.cash');
    const isCardFormValid = normalizeCardNumber(cardForm.cardNumber).length === 16
        && String(cardForm.holderName || '').trim().length >= 4
        && String(cardForm.expiry || '').trim().length >= 5
        && String(cardForm.cvv || '').trim().length >= 3;
    const isPaymentContinueDisabled = selectedPayment === 'card' ? !isCardFormValid : false;

    useEffect(() => {
        const hasSelected = installmentOptions.some((item) => item.value === selectedInstallment);
        if (!hasSelected) {
            setSelectedInstallment(installmentOptions[0]?.value || 1);
        }
    }, [installmentOptions, selectedInstallment]);

    const increase = (lineId, currentQty) => {
        CartService.updateCartItemQuantity(lineId, Number(currentQty || 1) + 1);
    };

    const decrease = (lineId, currentQty) => {
        const nextQty = Math.max(1, Number(currentQty || 1) - 1);
        CartService.updateCartItemQuantity(lineId, nextQty);
    };

    const removeItem = (lineId) => {
        CartService.removeCartItem(lineId);
    };

    const completePurchase = () => {
        if (items.length === 0) {
            return;
        }

        if (!localStorage.getItem('token')) {
            history.push('/login?redirect=/sepetim');
            return;
        }

        if (selectedPayment === 'card') {
            if (!isCardFormValid) {
                return;
            }
        }

        setOtpCode('');
        setOtpError('');
        setBankModalOpen(true);
    };

    const handleGoToAddressStep = () => {
        if (items.length === 0) {
            return;
        }
        setCheckoutStep(2);
    };

    const handleAddressContinue = () => {
        if (!selectedAddress) {
            return;
        }
        setCheckoutStep(3);
    };

    const handlePaymentContinue = () => {
        if (selectedPayment === 'card') {
            if (!isCardFormValid) {
                return;
            }
        }

        setCheckoutStep(4);
    };

    const handleNewAddressField = (field, value) => {
        setNewAddressForm((prev) => ({...prev, [field]: value}));
    };

    const handleCreateAddress = () => {
        if (!newAddressForm.title || !newAddressForm.city || !newAddressForm.district || !newAddressForm.phone || !newAddressForm.fullAddress) {
            return;
        }

        const userRaw = localStorage.getItem('user');
        let userId = 'guest';
        if (userRaw) {
            try {
                const parsedUser = JSON.parse(userRaw);
                userId = parsedUser?.pkId || parsedUser?.id || 'guest';
            } catch (e) {
                userId = 'guest';
            }
        }

        const addressStorageKey = `tb_addresses_${userId}`;
        const currentRaw = localStorage.getItem(addressStorageKey);
        let current = [];
        if (currentRaw) {
            try {
                const parsed = JSON.parse(currentRaw);
                if (Array.isArray(parsed)) {
                    current = parsed;
                }
            } catch (e) {
                current = [];
            }
        }

        const created = {
            id: `saved-address-${Date.now()}`,
            title: newAddressForm.title,
            fullName: 'Teslimat',
            phone: newAddressForm.phone,
            city: newAddressForm.city,
            district: newAddressForm.district,
            fullAddress: newAddressForm.fullAddress,
            type: newAddressForm.type,
            isDefault: current.length === 0
        };

        const nextStorage = [...current, created];
        localStorage.setItem(addressStorageKey, JSON.stringify(nextStorage));

        const detail = `${created.fullAddress} - ${created.district} / ${created.city}`;
        const mapped = {
            id: created.id,
            label: created.title,
            detail,
            isDefault: created.isDefault
        };

        setAddressOptions((prev) => [...prev, mapped]);
        setSelectedAddress(created.id);
        setShowNewAddressForm(false);
        setNewAddressForm({
            title: '',
            city: '',
            district: '',
            phone: '',
            fullAddress: '',
            type: 'home'
        });
    };

    const closeBankModal = () => {
        setBankModalOpen(false);
        setOtpError('');
    };

    const approveDemoPayment = () => {
        if (otpCode !== '867245') {
            setOtpError(t('cart.otpInvalid'));
            return;
        }

        const selectedAddressOption = addressOptions.find((item) => item.id === selectedAddress);
        UserActivityService.addOrder({
            items: items.map((item) => ({
                id: item.id,
                title: item.title,
                mark: item.mark,
                img: item.img,
                quantity: item.quantity,
                price: item.price,
                selectedSize: item.selectedSize,
                selectedColor: item.selectedColor
            })),
            summary,
            paymentType: selectedPayment,
            installment: selectedInstallment,
            address: selectedAddressOption || null,
            status: 'prepared'
        });

        CartService.clearCart();
        setCompleted(true);
        setBankModalOpen(false);
        setMobileCheckoutOpen(false);
        setOtpCode('');
        setOtpError('');
    };

    const onCardFieldChange = (key, value) => {
        if (key === 'cardNumber') {
            setCardForm((prev) => ({...prev, cardNumber: formatCardNumber(value)}));
            return;
        }

        if (key === 'expiry') {
            const raw = value.replace(/\D/g, '').slice(0, 4);
            const formatted = raw.length > 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw;
            setCardForm((prev) => ({...prev, expiry: formatted}));
            return;
        }

        if (key === 'cvv') {
            setCardForm((prev) => ({...prev, cvv: value.replace(/\D/g, '').slice(0, 4)}));
            return;
        }

        setCardForm((prev) => ({...prev, [key]: value}));
    };

    const recentItemTemplate = (product) => {
        return (
            <a href={`/detail/${product.id}`} className="cart-suggest-card">
                <img src={product.img} alt={product.title}/>
                <strong>{product.mark}</strong>
                <span>{product.title}</span>
                <b>{formatPrice(product.price, locale)}</b>
            </a>
        );
    };

    const isMobileViewport = viewportWidth <= 768;
    const selectedAddressOption = addressOptions.find((item) => item.id === selectedAddress);
    const visibleRecentlyViewed = recentlyViewed.length > 0 ? recentlyViewed : recentlyViewedFallback;
    const baseViewedItems = visibleRecentlyViewed.slice(0, 12);
    const baseRecommendationProducts = (suggestedProducts.length > 0 ? suggestedProducts : campaignProducts).slice(0, 12);
    const fillToMin = (list, pool, min = 2) => {
        const base = Array.isArray(list) ? [...list] : [];
        const source = Array.isArray(pool) ? pool : [];
        if (base.length >= min) {
            return base;
        }
        const used = new Set(base.map((item) => String(item?.id)));
        for (let i = 0; i < source.length; i += 1) {
            const candidate = source[i];
            const key = String(candidate?.id);
            if (!candidate?.id || used.has(key)) {
                continue;
            }
            base.push(candidate);
            used.add(key);
            if (base.length >= min) {
                break;
            }
        }
        return base;
    };
    const viewedItems = isMobileViewport
        ? fillToMin(baseViewedItems, baseRecommendationProducts, 2).slice(0, 12)
        : baseViewedItems;
    const recommendationProducts = isMobileViewport
        ? fillToMin(baseRecommendationProducts, campaignProducts, 2).slice(0, 12)
        : baseRecommendationProducts;
    const hasSideRoomForRecommendations = viewedItems.length > 0 && viewedItems.length <= 3;
    const viewedVisibleCount = viewportWidth <= 768 ? 2 : (viewportWidth <= 1200 ? 2 : (hasSideRoomForRecommendations ? 2 : 4));
    const recoVisibleCount = viewportWidth <= 768 ? 2 : (hasSideRoomForRecommendations ? 2 : 4);
    const enableViewedSlider = viewedItems.length > viewedVisibleCount;
    const enableRecoSlider = recommendationProducts.length > recoVisibleCount;
    const viewedPanelStyle = viewedItems.length > 0
        ? {
            maxWidth: `calc(${viewedItems.length} * 17.2rem + ${Math.max(viewedItems.length - 1, 0)} * 0.65rem + 2.1rem)`
        }
        : undefined;
    const buildLoopWindow = (list, start, visibleCount) => {
        const safeList = Array.isArray(list) ? list : [];
        if (safeList.length <= visibleCount) {
            return safeList;
        }
        return Array.from({length: visibleCount}).map((_, index) => safeList[(start + index) % safeList.length]);
    };
    const viewedWindow = buildLoopWindow(viewedItems, viewedStart, viewedVisibleCount);
    const recoWindow = buildLoopWindow(recommendationProducts, recoStart, recoVisibleCount);
    const shiftLoop = (setter, list, step) => {
        const length = Array.isArray(list) ? list.length : 0;
        if (length === 0) {
            return;
        }
        setter((prev) => (prev + step + length) % length);
    };
    const renderCheckoutPanel = () => (
        <>
            {checkoutStep === 1 && (
                <div className="checkout-panel-card cart-summary-card">
                    <h3>{t('cart.summaryTitle')}</h3>
                    <div className="summary-row"><span>{t('cart.subtotal')}</span><strong>{formatPrice(summary.subtotal, locale)}</strong></div>
                    <div className="summary-row"><span>{t('cart.cargo')}</span><strong>{summary.cargo === 0 ? t('cart.free') : formatPrice(summary.cargo, locale)}</strong></div>
                    <div className="summary-row"><span>{t('cart.discount')}</span><strong>- {formatPrice(summary.discount, locale)}</strong></div>
                    <div className="summary-row total"><span>{t('cart.total')}</span><strong>{formatPrice(summary.total, locale)}</strong></div>
                    <button
                        type="button"
                        className="checkout-complete-button"
                        onClick={handleGoToAddressStep}
                        disabled={items.length === 0}
                    >
                        {t('cart.buy')}
                    </button>
                </div>
            )}

            {checkoutStep === 2 && (
                <div className="checkout-panel-card">
                    <h3>{t('cart.addressTitle')}</h3>
                    {addressOptions.length === 0 ? (
                        <div className="cart-address-empty-box">
                            <span>{t('cart.noAddressInAccount')}</span>
                        </div>
                    ) : (
                        <div className="checkout-option-list">
                            {addressOptions.map((option) => (
                                <label key={option.id} className={`checkout-option ${selectedAddress === option.id ? 'is-active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="address"
                                        value={option.id}
                                        checked={selectedAddress === option.id}
                                        onChange={() => setSelectedAddress(option.id)}
                                    />
                                    <span className="checkout-option-text">
                                        <strong>{option.label}</strong>
                                        <small>{option.detail}</small>
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}

                    <div className="checkout-step-actions">
                        <button type="button" className="checkout-outline-btn" onClick={() => setShowNewAddressForm((prev) => !prev)}>
                            {text('cart.addAddressInline', 'Yeni Adres Ekle')}
                        </button>
                        <button
                            type="button"
                            className="checkout-complete-button"
                            onClick={handleAddressContinue}
                            disabled={!selectedAddress}
                        >
                            {text('cart.continuePayment', 'Ödemeye Geç')}
                        </button>
                    </div>

                    {showNewAddressForm && (
                        <div className="inline-address-form">
                            <div className="inline-address-grid">
                                <label>
                                    <span>{text('cart.addressFormTitle', 'Adres Başlığı')}</span>
                                    <input
                                        type="text"
                                        value={newAddressForm.title}
                                        onChange={(e) => handleNewAddressField('title', e.target.value)}
                                    />
                                </label>
                                <label>
                                    <span>{text('cart.addressPhone', 'Telefon')}</span>
                                    <input
                                        type="text"
                                        value={newAddressForm.phone}
                                        onChange={(e) => handleNewAddressField('phone', e.target.value)}
                                    />
                                </label>
                                <label>
                                    <span>{text('cart.addressCity', 'İl')}</span>
                                    <input
                                        type="text"
                                        value={newAddressForm.city}
                                        onChange={(e) => handleNewAddressField('city', e.target.value)}
                                    />
                                </label>
                                <label>
                                    <span>{text('cart.addressDistrict', 'İlçe')}</span>
                                    <input
                                        type="text"
                                        value={newAddressForm.district}
                                        onChange={(e) => handleNewAddressField('district', e.target.value)}
                                    />
                                </label>
                                <label className="full">
                                    <span>{text('cart.addressFull', 'Açık Adres')}</span>
                                    <input
                                        type="text"
                                        value={newAddressForm.fullAddress}
                                        onChange={(e) => handleNewAddressField('fullAddress', e.target.value)}
                                    />
                                </label>
                            </div>
                            <div className="checkout-step-actions">
                                <button type="button" className="checkout-outline-btn" onClick={() => setShowNewAddressForm(false)}>
                                    {text('cart.cancel', 'Vazgeç')}
                                </button>
                                <button type="button" className="checkout-complete-button" onClick={handleCreateAddress}>
                                    {text('cart.saveAddress', 'Adresi Kaydet')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {checkoutStep === 3 && (
                <div className="checkout-panel-card">
                    <h3>{t('cart.paymentTitle')}</h3>
                    <div className="checkout-option-list">
                        {paymentOptions.map((option) => (
                            <div key={option.id} className="checkout-option-item">
                                <label className={`checkout-option ${selectedPayment === option.id ? 'is-active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value={option.id}
                                        checked={selectedPayment === option.id}
                                        onChange={() => setSelectedPayment(option.id)}
                                    />
                                    <span className="checkout-option-text">
                                        <strong>{option.label}</strong>
                                        <small>{option.detail}</small>
                                    </span>
                                </label>

                                {option.id === 'card' && selectedPayment === 'card' && (
                                    <div className="checkout-option-extend">
                                        <div className="card-form-area">
                                            <div className="card-form-grid">
                                                <label className="card-form-field full">
                                                    <span>{t('cart.cardNo')}</span>
                                                    <input
                                                        type="text"
                                                        placeholder="0000 0000 0000 0000"
                                                        value={cardForm.cardNumber}
                                                        onChange={(event) => onCardFieldChange('cardNumber', event.target.value)}
                                                    />
                                                </label>

                                                <label className="card-form-field full">
                                                    <span>{t('cart.cardHolder')}</span>
                                                    <input
                                                        type="text"
                                                        placeholder="AD SOYAD"
                                                        value={cardForm.holderName}
                                                        onChange={(event) => onCardFieldChange('holderName', event.target.value)}
                                                    />
                                                </label>

                                                <label className="card-form-field">
                                                    <span>{t('cart.expiry')}</span>
                                                    <input
                                                        type="text"
                                                        placeholder="AA/YY"
                                                        value={cardForm.expiry}
                                                        onChange={(event) => onCardFieldChange('expiry', event.target.value)}
                                                    />
                                                </label>

                                                <label className="card-form-field">
                                                    <span>CVV</span>
                                                    <input
                                                        type="password"
                                                        placeholder="***"
                                                        value={cardForm.cvv}
                                                        onChange={(event) => onCardFieldChange('cvv', event.target.value)}
                                                    />
                                                </label>
                                            </div>

                                            <div className="installment-area">
                                                <button
                                                    type="button"
                                                    className="installment-toggle"
                                                    onClick={() => setIsInstallmentOpen((prev) => !prev)}
                                                >
                                                    <strong>
                                                        {t('cart.installments')}
                                                        <span className="installment-selected-label">({selectedInstallmentLabel})</span>
                                                    </strong>
                                                    <i className={`pi ${isInstallmentOpen ? 'pi-angle-up' : 'pi-angle-down'}`}/>
                                                </button>

                                                <div className={`installment-list ${isInstallmentOpen ? 'is-open' : ''}`}>
                                                    {installmentOptions.map((item) => (
                                                        <label key={item.value} className={`installment-option ${selectedInstallment === item.value ? 'is-active' : ''}`}>
                                                            <input
                                                                type="radio"
                                                                name="installment"
                                                                checked={selectedInstallment === item.value}
                                                                onChange={() => setSelectedInstallment(item.value)}
                                                            />
                                                            <span>{item.label}</span>
                                                            <small>{formatPrice(item.amount, locale)}</small>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="checkout-step-actions">
                        <button type="button" className="checkout-outline-btn" onClick={() => setCheckoutStep(2)}>
                            {text('cart.back', 'Geri')}
                        </button>
                        <button
                            type="button"
                            className="checkout-complete-button"
                            onClick={handlePaymentContinue}
                            disabled={isPaymentContinueDisabled}
                        >
                            {text('cart.continueConfirm', 'Onaya Geç')}
                        </button>
                    </div>
                </div>
            )}

            {checkoutStep === 4 && (
                <div className="checkout-panel-card cart-summary-card">
                    <h3>{text('cart.finalCheckTitle', 'Son Kontrol')}</h3>
                    <div className="checkout-review-box">
                        <div className="checkout-review-row">
                            <span>{t('cart.addressTitle')}</span>
                            <strong>{selectedAddressOption?.label || '-'}</strong>
                        </div>
                        <div className="checkout-review-row">
                            <span>{t('cart.paymentTitle')}</span>
                            <strong>{paymentOptions.find((item) => item.id === selectedPayment)?.label || '-'}</strong>
                        </div>
                        {selectedPayment === 'card' && (
                            <div className="checkout-review-row">
                                <span>{t('cart.card')}</span>
                                <strong>**** **** **** {normalizeCardNumber(cardForm.cardNumber).slice(-4) || '0000'}</strong>
                            </div>
                        )}
                    </div>
                    <div className="summary-row"><span>{t('cart.subtotal')}</span><strong>{formatPrice(summary.subtotal, locale)}</strong></div>
                    <div className="summary-row"><span>{t('cart.cargo')}</span><strong>{summary.cargo === 0 ? t('cart.free') : formatPrice(summary.cargo, locale)}</strong></div>
                    <div className="summary-row"><span>{t('cart.discount')}</span><strong>- {formatPrice(summary.discount, locale)}</strong></div>
                    <div className="summary-row total"><span>{t('cart.total')}</span><strong>{formatPrice(summary.total, locale)}</strong></div>

                    <div className="checkout-step-actions">
                        <button type="button" className="checkout-outline-btn" onClick={() => setCheckoutStep(3)}>
                            {text('cart.back', 'Geri')}
                        </button>
                        <button
                            type="button"
                            className="checkout-complete-button"
                            onClick={completePurchase}
                            disabled={items.length === 0}
                        >
                            {t('cart.buy')}
                        </button>
                    </div>
                </div>
            )}
        </>
    );

    return (
        <div className="cart-page">
            {completed && (
                <div className="cart-success-banner">
                    {t('cart.orderDone')}
                </div>
            )}

            <div className="cart-header">
                <div className="cart-header-left">
                    <h1>{t('cart.title')}</h1>
                    <span>{t('cart.productCount', {count: items.length})}</span>
                </div>
                {items.length > 0 && (
                    <div className="cart-header-right">
                        <div className="checkout-steps-chip">
                            <span className={checkoutStep >= 1 ? 'is-active' : ''}>{text('cart.stepSummary', 'Özet')}</span>
                            <span className={checkoutStep >= 2 ? 'is-active' : ''}>{text('cart.stepAddress', 'Adres')}</span>
                            <span className={checkoutStep >= 3 ? 'is-active' : ''}>{text('cart.stepPayment', 'Ödeme')}</span>
                            <span className={checkoutStep >= 4 ? 'is-active' : ''}>{text('cart.stepConfirm', 'Onay')}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className={`cart-layout ${items.length === 0 ? 'is-empty' : ''}`}>
                <section className="cart-items-section">
                    {items.length === 0 && (
                        <div className="cart-empty-state">
                            <div>{t('cart.empty')}</div>
                            <button
                                type="button"
                                className="cart-empty-cta"
                                onClick={() => history.push('/')}
                            >
                                {text('cart.startShopping', 'Alışverişe Başla')}
                            </button>
                        </div>
                    )}

                    {items.map((item) => (
                        <article key={item.lineId} className="cart-item-card">
                            <img src={item.img} alt={item.title}/>

                            <div className="cart-item-info">
                                <strong>{item.mark}</strong>
                                <h3>{item.title}</h3>
                                <div className="cart-item-meta">
                                    <span>{t('cart.size')}: {item.selectedSize || '-'}</span>
                                    <span>{t('cart.color')}: {item.selectedColor || '-'}</span>
                                </div>
                                <div className="cart-item-price-row">
                                    <span className="cart-item-price">{formatPrice(item.price, locale)}</span>
                                </div>
                            </div>

                            <div className="cart-item-qty">
                                <button type="button" onClick={() => decrease(item.lineId, item.quantity)}>-</button>
                                <span>{item.quantity}</span>
                                <button type="button" onClick={() => increase(item.lineId, item.quantity)}>+</button>
                                <button
                                    type="button"
                                    className="cart-remove-icon-button"
                                    onClick={() => removeItem(item.lineId)}
                                    aria-label={t('cart.removeAria')}
                                >
                                    <i className="pi pi-trash"/>
                                </button>
                            </div>
                        </article>
                    ))}
                </section>

                {items.length > 0 && !isMobileViewport && (
                    <aside className="cart-checkout-section">
                        {renderCheckoutPanel()}
                    </aside>
                )}
            </div>

            <section className={`cart-personalized-row ${hasSideRoomForRecommendations ? 'split' : 'stacked'}`}>
                <section className={`cart-suggest-section cart-viewed-panel ${hasSideRoomForRecommendations ? 'is-compact' : ''}`} style={hasSideRoomForRecommendations ? viewedPanelStyle : undefined}>
                    <div className="cart-suggest-head">{text('cart.recentlyViewedTitle', 'Önceden İncelediklerim')}</div>
                    {viewedItems.length > 0 ? (
                        <div className={`cart-viewed-track-shell ${enableViewedSlider ? 'is-slider' : ''}`}>
                            {enableViewedSlider && (
                                <button
                                    type="button"
                                    className="cart-viewed-nav prev"
                                    onClick={() => shiftLoop(setViewedStart, viewedItems, -1)}
                                    aria-label={text('cart.prev', 'Önceki')}
                                >
                                    <i className="pi pi-angle-left"/>
                                </button>
                            )}
                            <div className={`cart-viewed-grid is-loop`} style={{'--loop-col-count': viewedWindow.length}}>
                                {viewedWindow.map((product) => (
                                    <div key={product.id} className="cart-viewed-item">
                                        {recentItemTemplate(product)}
                                    </div>
                                ))}
                            </div>
                            {enableViewedSlider && (
                                <button
                                    type="button"
                                    className="cart-viewed-nav next"
                                    onClick={() => shiftLoop(setViewedStart, viewedItems, 1)}
                                    aria-label={text('cart.next', 'Sonraki')}
                                >
                                    <i className="pi pi-angle-right"/>
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="cart-empty-state">
                            {text('cart.recentlyViewedEmpty', 'Henüz incelediğin ürün yok. Ürünleri keşfettikçe burada listelenecek.')}
                        </div>
                    )}
                </section>

                {recommendationProducts.length > 0 && (
                    <section className="cart-suggest-section cart-reco-panel">
                        <div className="cart-suggest-head">{text('cart.suggestTitle', 'Sizin İçin Öneriler')}</div>
                        <div className={`cart-viewed-track-shell ${enableRecoSlider ? 'is-slider' : ''}`}>
                            {enableRecoSlider && (
                                <button
                                    type="button"
                                    className="cart-viewed-nav prev"
                                    onClick={() => shiftLoop(setRecoStart, recommendationProducts, -1)}
                                    aria-label={text('cart.prev', 'Önceki')}
                                >
                                    <i className="pi pi-angle-left"/>
                                </button>
                            )}
                            <div
                                className="cart-viewed-grid cart-reco-grid is-loop"
                                style={{'--loop-col-count': Math.max(recoWindow.length, 1)}}
                            >
                                {recoWindow.map((product) => (
                                    <div key={`reco-${product.id}`} className="cart-viewed-item">
                                        {recentItemTemplate(product)}
                                    </div>
                                ))}
                            </div>
                            {enableRecoSlider && (
                                <button
                                    type="button"
                                    className="cart-viewed-nav next"
                                    onClick={() => shiftLoop(setRecoStart, recommendationProducts, 1)}
                                    aria-label={text('cart.next', 'Sonraki')}
                                >
                                    <i className="pi pi-angle-right"/>
                                </button>
                            )}
                        </div>
                    </section>
                )}
            </section>

            <section className="cart-discount-circles">
                <div className="cart-suggest-head cart-discount-title">{text('cart.discountHubTitle', 'Size Özel İndirim Fırsatları')}</div>
                <div className="cart-discount-circle-row">
                    {discountRates.map((rate, index) => (
                        <a
                            key={rate}
                            href={`/product/indirim?discount=${rate}`}
                            className={`cart-discount-circle c${index + 1}`}
                        >
                            <strong>%{rate}</strong>
                            <span>{text('cart.discountCircleLabel', 'İndirim')}</span>
                        </a>
                    ))}
                </div>
            </section>

            <section className="cart-campaign-strip">
                {campaignProducts.slice(0, 6).map((product) => (
                    <a key={product.id} href={`/detail/${product.id}`} className="cart-campaign-card is-product">
                        <img src={product.img} alt={product.title}/>
                        <div className="cart-campaign-content">
                            <strong>{product.mark}</strong>
                            <span>{product.title}</span>
                            <b>{formatPrice(product.price, locale)}</b>
                        </div>
                    </a>
                ))}
            </section>

            {isMobileViewport && items.length > 0 && (
                <div className="cart-mobile-cta-bar">
                    <div className="cart-mobile-cta-price">
                        <span>{t('cart.total')}</span>
                        <strong>{formatPrice(summary.total, locale)}</strong>
                    </div>
                    <button
                        type="button"
                        className="cart-mobile-cta-button"
                        onClick={() => setMobileCheckoutOpen(true)}
                    >
                        {t('cart.buy')}
                    </button>
                </div>
            )}

            {isMobileViewport && mobileCheckoutOpen && (
                <div className="cart-mobile-checkout-backdrop" onClick={() => setMobileCheckoutOpen(false)}>
                    <div className="cart-mobile-checkout-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="cart-mobile-checkout-head">
                            <h3>{text('cart.mobileCheckoutTitle', 'Güvenli Ödeme')}</h3>
                            <button type="button" onClick={() => setMobileCheckoutOpen(false)}>{t('cart.close')}</button>
                        </div>
                        <div className="checkout-steps-chip">
                            <span className={checkoutStep >= 1 ? 'is-active' : ''}>{text('cart.stepSummary', 'Özet')}</span>
                            <span className={checkoutStep >= 2 ? 'is-active' : ''}>{text('cart.stepAddress', 'Adres')}</span>
                            <span className={checkoutStep >= 3 ? 'is-active' : ''}>{text('cart.stepPayment', 'Ödeme')}</span>
                            <span className={checkoutStep >= 4 ? 'is-active' : ''}>{text('cart.stepConfirm', 'Onay')}</span>
                        </div>
                        <div className="cart-mobile-checkout-content">
                            {renderCheckoutPanel()}
                        </div>
                    </div>
                </div>
            )}

            {bankModalOpen && (
                <div className="bank-demo-modal-backdrop" onClick={closeBankModal}>
                    <div className="bank-demo-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="bank-demo-head">
                            <h3>{t('cart.bankTitle')}</h3>
                            <button type="button" onClick={closeBankModal}>{t('cart.close')}</button>
                        </div>

                        <div className="bank-demo-content">
                            <div className="bank-demo-info">
                                {t('cart.bankInfo')}
                            </div>
                            <div className="bank-demo-row"><span>{t('cart.amount')}</span><strong>{formatPrice(summary.total, locale)}</strong></div>
                            <div className="bank-demo-row"><span>{t('cart.card')}</span><strong>**** **** **** {normalizeCardNumber(cardForm.cardNumber).slice(-4) || '0000'}</strong></div>
                            <div className="bank-demo-row"><span>{t('cart.installments')}</span><strong>{selectedInstallmentLabel}</strong></div>
                            <div className="bank-demo-row"><span>{t('cart.secureCode')}</span><strong>867245</strong></div>

                            <div className="bank-otp-area">
                                <label htmlFor="bank-otp-input">{t('cart.otp')}</label>
                                <input
                                    id="bank-otp-input"
                                    type="text"
                                    value={otpCode}
                                    onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder={t('cart.otpPlaceholder')}
                                />
                                {otpError && <div className="bank-otp-error">{otpError}</div>}
                            </div>

                            <p>{t('cart.demoText')}</p>
                        </div>

                        <div className="bank-demo-actions">
                            <button type="button" className="cancel" onClick={closeBankModal}>{t('cart.reject')}</button>
                            <button
                                type="button"
                                className="approve"
                                onClick={approveDemoPayment}
                                disabled={otpCode.length !== 6}
                            >
                                {t('cart.approveBuy')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

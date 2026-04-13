import React, {useEffect, useState} from 'react';
import CartService, {CART_UPDATED_EVENT} from "../service/CartService";
import ProductService from "../service/ProductService";
import {Carousel} from "primereact/carousel";
import {useHistory} from "react-router-dom";

const formatPrice = (price) => `${Number(price || 0).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} TL`;

const addressOptions = [
    {
        id: 'home',
        label: 'Ev Adresi',
        detail: 'Ataturk Mah. Cicek Sok. No:12 Kadikoy / Istanbul'
    },
    {
        id: 'office',
        label: 'Is Adresi',
        detail: 'Maslak Mah. Buyukdere Cad. No:201 Sariyer / Istanbul'
    }
];

const paymentOptions = [
    {
        id: 'card',
        label: 'Kredi / Banka Karti',
        detail: 'Tek cekim veya taksit secenekleri'
    },
    {
        id: 'transfer',
        label: 'Havale / EFT',
        detail: 'Siparis oncesi banka transferi ile odeme'
    },
    {
        id: 'door',
        label: 'Kapida Odeme',
        detail: 'Teslimatta odeme (ek hizmet bedeli uygulanabilir)'
    }
];

const normalizeCardNumber = (value = '') => value.replace(/\D/g, '').slice(0, 16);
const formatCardNumber = (value = '') => normalizeCardNumber(value).replace(/(\d{4})(?=\d)/g, '$1 ');

const getInstallmentOptions = (total = 0) => {
    return [1, 2, 3, 4, 5, 6].map((count) => ({
        value: count,
        label: count === 1 ? 'Pesin' : `${count} taksit`,
        amount: total / count
    }));
};

export const CartPage = () => {
    const history = useHistory();
    const [items, setItems] = useState([]);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(addressOptions[0].id);
    const [selectedPayment, setSelectedPayment] = useState(paymentOptions[0].id);
    const [completed, setCompleted] = useState(false);
    const [selectedInstallment, setSelectedInstallment] = useState(1);
    const [isInstallmentOpen, setIsInstallmentOpen] = useState(false);
    const [bankModalOpen, setBankModalOpen] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [otpError, setOtpError] = useState('');
    const [cardForm, setCardForm] = useState({
        cardNumber: '',
        holderName: '',
        expiry: '',
        cvv: ''
    });

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
    const installmentOptions = getInstallmentOptions(Number(summary.total || 0));
    const selectedInstallmentLabel = installmentOptions.find((item) => item.value === selectedInstallment)?.label || 'Pesin';

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
            const isCardValid = normalizeCardNumber(cardForm.cardNumber).length === 16
                && String(cardForm.holderName || '').trim().length >= 4
                && String(cardForm.expiry || '').trim().length >= 5
                && String(cardForm.cvv || '').trim().length >= 3;
            if (!isCardValid) {
                return;
            }
        }

        setOtpCode('');
        setOtpError('');
        setBankModalOpen(true);
    };

    const closeBankModal = () => {
        setBankModalOpen(false);
        setOtpError('');
    };

    const approveDemoPayment = () => {
        if (otpCode !== '867245') {
            setOtpError('Girdiginiz OTP kodu gecersiz. Demo kod: 867245');
            return;
        }

        CartService.clearCart();
        setCompleted(true);
        setBankModalOpen(false);
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

    const suggestedItemTemplate = (product) => {
        return (
            <a href={`/detail/${product.id}`} className="cart-suggest-card">
                <img src={product.img} alt={product.title}/>
                <strong>{product.mark}</strong>
                <span>{product.title}</span>
                <b>{formatPrice(product.price)}</b>
            </a>
        );
    };

    return (
        <div className="cart-page">
            <div className="cart-header">
                <h1>Sepetim</h1>
                <span>{items.length} urun</span>
            </div>

            {completed && (
                <div className="cart-success-banner">
                    Siparisiniz alindi. Tesekkur ederiz.
                </div>
            )}

            <div className="cart-layout">
                <section className="cart-items-section">
                    {items.length === 0 && (
                        <div className="cart-empty-state">
                            Sepetinizde urun bulunmuyor.
                        </div>
                    )}

                    {items.map((item) => (
                        <article key={item.lineId} className="cart-item-card">
                            <img src={item.img} alt={item.title}/>

                            <div className="cart-item-info">
                                <strong>{item.mark}</strong>
                                <h3>{item.title}</h3>
                                <div className="cart-item-meta">
                                    <span>Beden: {item.selectedSize || '-'}</span>
                                    <span>Renk: {item.selectedColor || '-'}</span>
                                </div>
                                <div className="cart-item-price-row">
                                    <span className="cart-item-price">{formatPrice(item.price)}</span>
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
                                    aria-label="Urunu sepetten kaldir"
                                >
                                    <i className="pi pi-trash"/>
                                </button>
                            </div>
                        </article>
                    ))}

                    {suggestedProducts.length > 0 && (
                        <section className="cart-suggest-section">
                            <div className="cart-suggest-head">Bunlara da bakmak isteyebilirsiniz</div>
                            <Carousel
                                value={suggestedProducts}
                                itemTemplate={suggestedItemTemplate}
                                numVisible={4}
                                numScroll={2}
                                circular
                                showIndicators={false}
                                responsiveOptions={[
                                    {breakpoint: '1280px', numVisible: 3, numScroll: 1},
                                    {breakpoint: '920px', numVisible: 2, numScroll: 1},
                                    {breakpoint: '640px', numVisible: 1, numScroll: 1}
                                ]}
                            />
                        </section>
                    )}
                </section>

                <aside className="cart-checkout-section">
                    <div className="checkout-panel-card">
                        <h3>Adres Secimi</h3>
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
                    </div>

                    <div className="checkout-panel-card">
                        <h3>Odeme Yontemi</h3>
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
                                                        <span>Kart Numarasi</span>
                                                        <input
                                                            type="text"
                                                            placeholder="0000 0000 0000 0000"
                                                            value={cardForm.cardNumber}
                                                            onChange={(event) => onCardFieldChange('cardNumber', event.target.value)}
                                                        />
                                                    </label>

                                                    <label className="card-form-field full">
                                                        <span>Kart Uzerindeki Isim Soyisim</span>
                                                        <input
                                                            type="text"
                                                            placeholder="AD SOYAD"
                                                            value={cardForm.holderName}
                                                            onChange={(event) => onCardFieldChange('holderName', event.target.value)}
                                                        />
                                                    </label>

                                                    <label className="card-form-field">
                                                        <span>Son Kullanma</span>
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
                                            Taksit Secenekleri
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
                                                <small>{formatPrice(item.amount)}</small>
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
                    </div>

                    <div className="checkout-panel-card cart-summary-card">
                        <h3>Siparis Ozeti</h3>
                        <div className="summary-row"><span>Ara Toplam</span><strong>{formatPrice(summary.subtotal)}</strong></div>
                        <div className="summary-row"><span>Kargo</span><strong>{summary.cargo === 0 ? 'Ucretsiz' : formatPrice(summary.cargo)}</strong></div>
                        <div className="summary-row"><span>Indirim</span><strong>- {formatPrice(summary.discount)}</strong></div>
                        <div className="summary-row total"><span>Toplam</span><strong>{formatPrice(summary.total)}</strong></div>

                        <button
                            type="button"
                            className="checkout-complete-button"
                            onClick={completePurchase}
                            disabled={items.length === 0}
                        >
                            Satin Al
                        </button>
                    </div>
                </aside>
            </div>

            {bankModalOpen && (
                <div className="bank-demo-modal-backdrop" onClick={closeBankModal}>
                    <div className="bank-demo-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="bank-demo-head">
                            <h3>TrendBank - Guvenli 3D Odeme</h3>
                            <button type="button" onClick={closeBankModal}>Kapat</button>
                        </div>

                        <div className="bank-demo-content">
                            <div className="bank-demo-info">
                                Isleminizi tamamlamak icin cep telefonunuza gelen tek kullanimlik sifreyi girin.
                            </div>
                            <div className="bank-demo-row"><span>Tutar</span><strong>{formatPrice(summary.total)}</strong></div>
                            <div className="bank-demo-row"><span>Kart</span><strong>**** **** **** {normalizeCardNumber(cardForm.cardNumber).slice(-4) || '0000'}</strong></div>
                            <div className="bank-demo-row"><span>Taksit</span><strong>{selectedInstallment === 1 ? 'Pesin' : `${selectedInstallment} taksit`}</strong></div>
                            <div className="bank-demo-row"><span>3D Secure Kodu</span><strong>867245</strong></div>

                            <div className="bank-otp-area">
                                <label htmlFor="bank-otp-input">OTP Kodu</label>
                                <input
                                    id="bank-otp-input"
                                    type="text"
                                    value={otpCode}
                                    onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="6 haneli kod"
                                />
                                {otpError && <div className="bank-otp-error">{otpError}</div>}
                            </div>

                            <p>Bu ekran demodur. Gercek banka islemi yapilmaz.</p>
                        </div>

                        <div className="bank-demo-actions">
                            <button type="button" className="cancel" onClick={closeBankModal}>Reddet</button>
                            <button
                                type="button"
                                className="approve"
                                onClick={approveDemoPayment}
                                disabled={otpCode.length !== 6}
                            >
                                Onayla ve Satin Al
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Button} from 'primereact/button';
import {Carousel} from 'primereact/carousel';
import {Rating} from 'primereact/rating';
import ProductService from "../../service/ProductService";
import {MEGA_MENU_CATEGORIES} from "../../data/demoProductData";
import {ProductFeedbackPanel} from "./ProductFeedbackPanel";
import CartService from "../../service/CartService";

const resolveCategoryKeyFromId = (productId = '') => {
    const normalized = String(productId).toLowerCase();
    const splitterIndex = normalized.indexOf('-');
    if (splitterIndex <= 0) {
        return 'elbise';
    }

    return normalized.slice(0, splitterIndex);
};

const formatPrice = (price) => `${Number(price || 0).toLocaleString('tr-TR')} TL`;

const buildDeliveryLabel = () => {
    const start = new Date();
    start.setDate(start.getDate() + 1);

    const end = new Date();
    end.setDate(end.getDate() + 3);

    const formatDate = (value) => value.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: 'long'
    });

    return `${formatDate(start)} - ${formatDate(end)} arası tahmini teslim`;
};

const buildReviews = (product) => {
    const productTitle = product?.title || 'Ürün';
    const mark = product?.mark || 'Satıcı';
    const names = [
        'Ayşe K.', 'Zeynep T.', 'Elif S.', 'Merve A.', 'Ceren B.', 'Ebru D.', 'Sena Y.', 'Büşra Ö.',
        'İrem Ç.', 'Nazlı E.', 'Derya M.', 'Sibel K.', 'Tuğçe P.', 'Aslı A.', 'Yasemin G.', 'Nisa U.',
        'Hande N.', 'Burcu V.', 'Selin R.', 'Mine F.'
    ];
    const comments = [
        `${productTitle} beklediğimden kaliteli geldi. Kumaş dokusu çok iyi, kalıbı da tam oldu.`,
        `Renk ve duruşu çok güzel. ${mark} mağazası hızlı gönderdi, paketleme de temizdi.`,
        'Fotoğraftaki gibi geldi. Günlük kullanımda çok rahat, fiyat/performans açısından başarılı.',
        'Dikiş kalitesi başarılı, kumaş ince değil. Kombinlemesi kolay bir ürün.',
        'Beden tablosuna göre aldım, tam oldu. İade ile uğraşmadım.',
        'Rengi ekrandakine çok yakın. İlk yıkamada çekme ya da solma görmedim.',
        'Kalıbı çok beğendim, ne çok dar ne bol. Gün boyu rahat hissettiriyor.',
        'Kargo hızlı ulaştı. Paketleme özenliydi, ürün sorunsuz geldi.',
        'İşçilik beklediğimden iyi. Özellikle omuz ve kol kısmı çok düzgün.',
        'Fiyatına göre çok iyi performans veriyor, ikinci rengini de alacağım.'
    ];
    const reviewPhotoPool = [
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=800&q=80"
    ];

    return Array.from({length: 20}, (_, index) => {
        const day = String(12 - (index % 10)).padStart(2, '0');
        const hasPhotos = index % 3 === 0 || index % 7 === 0;
        const photoStart = index % reviewPhotoPool.length;
        const photos = hasPhotos
            ? [
                reviewPhotoPool[photoStart],
                reviewPhotoPool[(photoStart + 1) % reviewPhotoPool.length]
            ]
            : [];

        return {
            id: `${product?.id || 'product'}-r${index + 1}`,
            user: names[index % names.length],
            rating: 4 + (index % 2),
            date: `${day} Nisan 2026`,
            text: comments[index % comments.length],
            photos
        };
    });
};

const buildQuestionAnswers = (product) => {
    const mark = product?.mark || 'Satıcı';
    return [
        {
            id: `${product?.id || 'product'}-qa1`,
            question: 'Kalıbı dar mı, normal kalıp mı?',
            answer: `${mark}: Ürün regular fit kalıptır. Kendi bedeninizi tercih edebilirsiniz.`,
            date: '09 Nisan 2026'
        },
        {
            id: `${product?.id || 'product'}-qa2`,
            question: 'Kumaş yapısı yaz için uygun mu?',
            answer: `${mark}: Hafif ve nefes alan kumaş kullanılmıştır, bahar-yaz için uygundur.`,
            date: '07 Nisan 2026'
        },
        {
            id: `${product?.id || 'product'}-qa3`,
            question: 'Renk yıkamada solma yapar mı?',
            answer: `${mark}: Yıkama talimatına uygun kullanımda renk canlılığı korunur.`,
            date: '05 Nisan 2026'
        },
        {
            id: `${product?.id || 'product'}-qa4`,
            question: 'Kargoya verilme süresi nedir?',
            answer: `${mark}: Siparişiniz aynı gün içinde hazırlanır ve en geç ertesi gün kargoya teslim edilir.`,
            date: '04 Nisan 2026'
        }
    ];
};

const relatedProductTemplate = (item) => {
    return (
        <div className="detail-related-card-wrap">
            <a href={`/detail/${item.id}`} className="detail-related-card">
                <img src={item.img} alt={item.title} loading="lazy" decoding="async"/>
                <div className="detail-related-brand">{item.mark}</div>
                <div className="detail-related-title">{item.title}</div>
                <div className="detail-related-price">{formatPrice(item.price)}</div>
            </a>
        </div>
    );
};

const normalizeAttributes = (product) => {
    const incoming = Array.isArray(product?.attributes) ? product.attributes : [];
    const validIncoming = incoming
        .filter((item) => item && typeof item === 'object')
        .map((item) => ({
            label: item.label || item.key || '',
            value: item.value || item.text || ''
        }))
        .filter((item) => item.label && item.value)
        .filter((item) => String(item.label).toLowerCase() !== 'beden');

    if (validIncoming.length > 0) {
        return validIncoming;
    }

    return [
        {label: 'Marka', value: product?.mark || '-'},
        {label: 'Renk', value: product?.color || '-'},
        {label: 'Satıcı Puanı', value: String(product?.sellerScore || '-')}
    ];
};

const normalizeColorOptions = (product) => {
    const incoming = Array.isArray(product?.colorOptions) ? product.colorOptions : [];
    const normalizedIncoming = incoming
        .map((item) => {
            if (typeof item === 'string') {
                return {name: item, image: product?.img || ''};
            }

            if (!item || typeof item !== 'object') {
                return null;
            }

            return {
                name: item.name || item.label || item.color || '',
                image: item.image || item.img || item.imageUrl || product?.img || ''
            };
        })
        .filter((item) => item && item.name);

    if (normalizedIncoming.length > 0) {
        return normalizedIncoming;
    }

    if (product?.color) {
        return [{name: product.color, image: product?.img || ''}];
    }

    return [];
};

const COLOR_HEX_MAP = {
    siyah: '#1f2937',
    beyaz: '#f8fafc',
    bej: '#d6c9af',
    lacivert: '#243b70',
    haki: '#6b7b4d',
    kirmizi: '#d53434',
    kırmızı: '#d53434',
    gri: '#9ca3af',
    mavi: '#3b82f6',
    krem: '#efe7d7',
    pembe: '#f59eb5'
};

const resolveColorHex = (colorName = '') => {
    const key = String(colorName).trim().toLowerCase();
    return COLOR_HEX_MAP[key] || '#cbd5e1';
};

export const ProductDetail = ({match}) => {
    const productId = match?.params?.id;
    const toastTimerRef = useRef(null);
    const feedbackSectionRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [cartMessageVisible, setCartMessageVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [activeFeedbackMode, setActiveFeedbackMode] = useState('reviews');

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setQuantity(1);
        setCartMessageVisible(false);
        setActiveFeedbackMode('reviews');

        Promise.all([
            ProductService.getProductById(productId),
            ProductService.getRelatedProductsByProductId(productId, 12)
        ]).then(([productData, relatedList]) => {
            if (!isMounted) {
                return;
            }

            setProduct(productData || null);
            setRelatedProducts(Array.isArray(relatedList) ? relatedList : []);
            setSelectedImage(productData?.img || '');
            const incomingSizes = Array.isArray(productData?.sizeOptions) ? productData.sizeOptions : [];
            setSelectedSize(incomingSizes[0] || productData?.size || '');
            const incomingColors = normalizeColorOptions(productData);
            setSelectedColor(incomingColors[0]?.name || productData?.color || '');
        }).finally(() => {
            if (isMounted) {
                setLoading(false);
            }
        });

        return () => {
            isMounted = false;
            if (toastTimerRef.current) {
                clearTimeout(toastTimerRef.current);
            }
        };
    }, [productId]);

    const categoryKey = useMemo(() => resolveCategoryKeyFromId(productId), [productId]);

    const parentCategoryLabel = useMemo(() => {
        const parent = MEGA_MENU_CATEGORIES.find((group) => group.items.some((item) => item.slug === categoryKey));
        return parent?.label || 'Kategoriler';
    }, [categoryKey]);

    const reviews = useMemo(() => buildReviews(product), [product]);
    const questionAnswers = useMemo(() => buildQuestionAnswers(product), [product]);
    const photoReviewCount = useMemo(() => {
        return reviews.filter((review) => Array.isArray(review.photos) && review.photos.length > 0).length;
    }, [reviews]);
    const sizeOptions = useMemo(() => {
        const fromProduct = Array.isArray(product?.sizeOptions) ? product.sizeOptions : [];
        if (fromProduct.length > 0) {
            return Array.from(new Set(fromProduct.filter(Boolean)));
        }
        return product?.size ? [product.size] : [];
    }, [product]);
    const productAttributes = useMemo(() => normalizeAttributes(product), [product]);
    const colorOptions = useMemo(() => normalizeColorOptions(product), [product]);
    const productHighlights = useMemo(() => {
        if (Array.isArray(product?.highlights) && product.highlights.length > 0) {
            return product.highlights;
        }

        return [
            'Yumuşak dokulu kumaş',
            'Günlük kullanıma uygun tasarım',
            'Sezon kombinleriyle kolay uyum'
        ];
    }, [product]);
    const galleryImages = useMemo(() => {
        const selectedColorImage = colorOptions.find((item) => item.name === selectedColor)?.image;
        const colorImages = colorOptions.map((item) => item.image);
        const pool = [selectedColorImage, product?.img, ...colorImages, ...(relatedProducts || []).slice(0, 5).map((item) => item.img)];
        return Array.from(new Set(pool.filter(Boolean)));
    }, [product, relatedProducts, colorOptions, selectedColor]);

    useEffect(() => {
        const imageForColor = colorOptions.find((item) => item.name === selectedColor)?.image;
        if (imageForColor) {
            setSelectedImage(imageForColor);
        }
    }, [selectedColor, colorOptions]);

    const increaseQuantity = () => setQuantity((prev) => Math.min(10, prev + 1));
    const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

    const openFeedbackSection = (mode) => {
        setActiveFeedbackMode(mode);
        window.setTimeout(() => {
            if (feedbackSectionRef.current) {
                feedbackSectionRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
        }, 10);
    };

    const addToCart = (event) => {
        const selectedQuantity = Math.max(1, Number(quantity) || 1);
        CartService.addToCart({
            product,
            quantity: selectedQuantity,
            selectedSize,
            selectedColor
        });

        const clickTarget = event?.currentTarget || event?.target;
        if (clickTarget && typeof window !== 'undefined') {
            const rect = clickTarget.getBoundingClientRect();
            const startX = rect.left + (rect.width / 2);
            const startY = rect.top + (rect.height / 2);

            window.dispatchEvent(new CustomEvent('cart:add:fly', {
                detail: {
                    startX,
                    startY,
                    imageUrl: product?.img || ''
                }
            }));
        }

        setCartMessageVisible(true);
        if (toastTimerRef.current) {
            clearTimeout(toastTimerRef.current);
        }

        toastTimerRef.current = setTimeout(() => {
            setCartMessageVisible(false);
        }, 1800);
    };

    if (loading) {
        return <div className="product-empty-state">Ürün detayları yükleniyor...</div>;
    }

    if (!product) {
        return <div className="product-empty-state">Ürün bulunamadı.</div>;
    }

    return (
        <div className="product-detail-page">
            <div className="product-detail-main">
                <div className="product-detail-gallery">
                    <img src={selectedImage || product.img} alt={product.title} className="product-detail-image"/>
                    <div className="product-detail-thumbs">
                        {galleryImages.map((imageUrl) => (
                            <button
                                key={imageUrl}
                                type="button"
                                className={`product-detail-thumb ${selectedImage === imageUrl ? 'is-active' : ''}`}
                                onClick={() => setSelectedImage(imageUrl)}
                                aria-label="Urun gorseli sec"
                            >
                                <img src={imageUrl} alt={product.title}/>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="product-detail-info">
                    <div className="product-detail-breadcrumb">
                        <a href="/">Anasayfa</a>
                        <span>/</span>
                        <a href={`/product/${categoryKey}`}>{parentCategoryLabel}</a>
                        <span>/</span>
                        <span>{product.title}</span>
                    </div>

                    <h1>{product.title}</h1>
                    <div className="product-detail-brand">{product.mark}</div>

                    <div className="product-detail-rating-row">
                        <Rating value={product.rating} readOnly cancel={false}/>
                        <span>{Number(product.rating || 0).toFixed(1)}</span>
                        <button
                            type="button"
                            className="detail-link-button product-detail-review-count"
                            onClick={() => openFeedbackSection('reviews')}
                        >
                            ({product.reviewCount || 0} değerlendirme
                            <span className="detail-photo-review-inline" aria-label={`${photoReviewCount} fotolu yorum`}>
                                <i className="pi pi-camera"/>
                                <span>{photoReviewCount}</span>
                            </span>
                            )
                        </button>
                        <button
                            type="button"
                            className="detail-link-button"
                            onClick={() => openFeedbackSection('qa')}
                        >
                            {questionAnswers.length} soru-cevap
                        </button>
                    </div>

                    <div className="product-detail-price-area">
                        <span className="detail-old-price">{formatPrice(product.oldPrice)}</span>
                        <div className="detail-current-price">{formatPrice(product.price)}</div>
                        {product.discountRate > 0 && <span className="detail-discount">%{product.discountRate} indirim</span>}
                    </div>

                    <div className="product-detail-badges">
                        {product.isFastDelivery && <span className="detail-badge fast">Hızlı Teslimat</span>}
                        {product.isFreeCargo && <span className="detail-badge cargo">Kargo Bedava</span>}
                        <span className="detail-badge neutral">{product.installmentText}</span>
                    </div>

                    {sizeOptions.length > 0 && (
                        <div className="product-detail-size-block">
                            <div className="product-detail-size-head">
                                <span>Beden</span>
                                {selectedSize && <strong>{selectedSize}</strong>}
                            </div>
                            <div className="product-detail-size-options">
                                {sizeOptions.map((sizeItem) => (
                                    <button
                                        key={sizeItem}
                                        type="button"
                                        className={`product-detail-size-option ${selectedSize === sizeItem ? 'is-active' : ''}`}
                                        onClick={() => setSelectedSize(sizeItem)}
                                        aria-pressed={selectedSize === sizeItem}
                                    >
                                        {sizeItem}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {colorOptions.length > 0 && (
                        <div className="product-detail-color-block">
                            <div className="product-detail-size-head">
                                <span>Renk</span>
                                {selectedColor && <strong>{selectedColor}</strong>}
                            </div>
                            <div className="product-detail-color-options">
                                {colorOptions.map((colorItem) => (
                                    <button
                                        key={colorItem.name}
                                        type="button"
                                        className={`product-detail-color-option ${selectedColor === colorItem.name ? 'is-active' : ''}`}
                                        onClick={() => setSelectedColor(colorItem.name)}
                                        aria-label={`Renk sec: ${colorItem.name}`}
                                        aria-pressed={selectedColor === colorItem.name}
                                    >
                                        <span
                                            className="product-detail-color-dot"
                                            style={{backgroundColor: resolveColorHex(colorItem.name)}}
                                            aria-hidden="true"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="product-detail-panel-grid">
                        <div className="product-detail-panel-item">
                            <div className="panel-label">Satıcı</div>
                            <div className="panel-value">{product.mark} Mağazası</div>
                            <div className="panel-sub">Satıcı puanı: {product.sellerScore || 0}</div>
                        </div>

                        <div className="product-detail-panel-item">
                            <div className="panel-label">Tahmini Teslimat</div>
                            <div className="panel-value">{buildDeliveryLabel()}</div>
                            <div className="panel-sub">İstanbul teslimat bölgesi için hesaplanmıştır.</div>
                        </div>
                    </div>

                    <div className="product-detail-cart-row">
                        <div className="product-detail-qty-selector">
                            <button type="button" onClick={decreaseQuantity} aria-label="Adet azalt">-</button>
                            <span>{quantity}</span>
                            <button type="button" onClick={increaseQuantity} aria-label="Adet arttır">+</button>
                        </div>

                        <Button
                            label="Sepete Ekle"
                            icon="pi pi-shopping-cart"
                            className="detail-add-cart-button"
                            onClick={addToCart}
                        />
                    </div>

                    {cartMessageVisible && <div className="detail-cart-feedback">Ürün sepete eklendi.</div>}

                    <section className="product-detail-features-block">
                        <h2>Ürün Özellikleri</h2>
                        <div className="product-detail-attributes-grid">
                            {productAttributes.map((attribute) => (
                                <div key={`${attribute.label}-${attribute.value}`} className="product-detail-attribute-item">
                                    <span className="attribute-key">{attribute.label}</span>
                                    <span className="attribute-value">{attribute.value}</span>
                                </div>
                            ))}
                        </div>
                        <ul className="product-detail-highlights">
                            {productHighlights.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </section>
                </div>

                <aside className="product-detail-side">
                    <div className="product-detail-side-card">
                        <h3>Ürün Kampanyaları</h3>
                        <a href="/" className="side-link-row">
                            <span>350 TL üzeri ücretsiz kargo</span>
                            <i className="pi pi-angle-right"/>
                        </a>
                        <a href="/" className="side-link-row">
                            <span>3 Al 2 Öde fırsatı</span>
                            <i className="pi pi-angle-right"/>
                        </a>
                    </div>

                    <div className="product-detail-side-card">
                        <h3>Satıcı</h3>
                        <div className="side-seller-row">
                            <strong>{product.mark}</strong>
                            <span className="seller-score-chip">{product.sellerScore || 0}</span>
                        </div>
                        <div className="side-muted-line">{buildDeliveryLabel()}</div>
                        <button type="button" className="side-outline-button">Mağazaya Git</button>
                    </div>
                </aside>
            </div>

            <section className="product-detail-section">
                <h2>Ürün Özeti</h2>
                <p>
                    {product.title}, günlük kullanıma uygun modern kesimi ve konforlu yapısıyla öne çıkar. Farklı kombinlere
                    kolay uyum sağlayan bu parça, sezonun öne çıkan seçimleri arasında yer alır.
                </p>
            </section>

            <section ref={feedbackSectionRef} className="product-detail-section product-detail-feedback-section">
                <h2>Kullanıcı Yorumları ve Soru-Cevap</h2>
                <ProductFeedbackPanel
                    product={product}
                    mode={activeFeedbackMode}
                    reviews={reviews}
                    questionAnswers={questionAnswers}
                    onModeChange={setActiveFeedbackMode}
                />
            </section>

            <section className="product-detail-section product-detail-related-section">
                <h2>Benzer Ürünler</h2>
                {relatedProducts.length > 0 ? (
                    <Carousel
                        value={relatedProducts}
                        numVisible={4}
                        numScroll={2}
                        responsiveOptions={[
                            {breakpoint: '1280px', numVisible: 3, numScroll: 1},
                            {breakpoint: '920px', numVisible: 2, numScroll: 1},
                            {breakpoint: '640px', numVisible: 1, numScroll: 1}
                        ]}
                        itemTemplate={relatedProductTemplate}
                        circular
                        showIndicators={false}
                    />
                ) : (
                    <div className="product-empty-state">Benzer ürün bulunamadı.</div>
                )}
            </section>
        </div>
    );
};

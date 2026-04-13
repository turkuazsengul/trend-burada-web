import React, {useEffect, useMemo, useState} from 'react';
import CampaignService from "../../service/CampaignService";
import {USE_STATIC_CAMPAIGN_ITEMS} from "../../constants/UrlConstans";

const staticCampaignData = [
    {
        id: 1,
        value: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=82",
        description: "Şehirde Yeni Sezon Stili"
    },
    {
        id: 2,
        value: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=82",
        description: "Premium Sokak Koleksiyonu"
    },
    {
        id: 3,
        value: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=82",
        description: "Modern Kadın Seçkisi"
    },
    {
        id: 4,
        value: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=82",
        description: "Minimal ve Şık Kombinler"
    },
    {
        id: 5,
        value: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=82",
        description: "Günlük Rahatlık, Premium Duruş"
    },
    {
        id: 6,
        value: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=82",
        description: "Sezonun En Yeni Parçaları"
    },
    {
        id: 7,
        value: "https://cdn.dsmcdn.com/ty1129/pimWidgetApi/mobile_20240111153218_2249025KadinMobile202401111801.jpg",
        description: "İç Giyim"
    },
    {
        id: 8,
        value: "https://cdn.dsmcdn.com/ty1155/pimWidgetApi/mobile_20240202153542_2527400ElektronikMobile202402021801.jpg",
        description: "Kahve Keyfi"
    },
    {
        id: 9,
        value: "https://cdn.dsmcdn.com/ty1111/pimWidgetApi/mobile_20231229092657_2397375ElektronikMobile202312.jpg",
        description: "Küçük Ev Aletleri"
    },
    {
        id: 10,
        value: "https://cdn.dsmcdn.com/ty1153/pimWidgetApi/mobile_20240131064937_SevginiziGosterenTakilar1.jpg",
        description: "Sevgililer Günü"
    },
    {
        id: 11,
        value: "https://cdn.dsmcdn.com/ty1120/pimWidgetApi/mobile_20240105130028_2414392ElektronikMobile202401041901.jpg",
        description: "Elektronik Alışverişi"
    },
    {
        id: 12,
        value: "https://cdn.dsmcdn.com/ty1082/pimWidgetApi/mobile_20231207122821_2357602SupermarketMobile202312071302.jpg",
        description: "Sevimli Dostlarımız"
    },
];

export const CampaignItems = () => {
    const [campaignData, setCampaignData] = useState(staticCampaignData);
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        if (USE_STATIC_CAMPAIGN_ITEMS) {
            setCampaignData(staticCampaignData);
            return;
        }

        CampaignService.getCampaignItems().then((list) => {
            if (Array.isArray(list) && list.length > 0) {
                setCampaignData(list);
            } else {
                setCampaignData(staticCampaignData);
            }
        });
    }, []);

    const buildFilledList = (list, targetCount) => {
        const safeList = Array.isArray(list) && list.length > 0 ? list : staticCampaignData;
        const filled = [];

        for (let i = 0; i < targetCount; i += 1) {
            const source = safeList[i % safeList.length];
            filled.push({
                ...source,
                id: `${source.id}-${i}`
            });
        }

        return filled;
    };

    const heroSlides = useMemo(() => buildFilledList(campaignData, 6), [campaignData]);

    useEffect(() => {
        if (heroSlides.length <= 1) {
            return;
        }

        const sliderId = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % heroSlides.length);
        }, 3800);

        return () => clearInterval(sliderId);
    }, [heroSlides]);

    useEffect(() => {
        if (activeSlide >= heroSlides.length) {
            setActiveSlide(0);
        }
    }, [heroSlides, activeSlide]);

    const safeSlides = heroSlides.length > 0 ? heroSlides : buildFilledList(staticCampaignData, 1);

    const trendCards = useMemo(() => buildFilledList(campaignData, 4), [campaignData]);
    const mosaicCards = useMemo(() => buildFilledList(campaignData.slice(4), 5), [campaignData]);
    const campaignCards = useMemo(() => buildFilledList(campaignData, 12), [campaignData]);

    const nextSlide = () => {
        setActiveSlide((prev) => (prev + 1) % safeSlides.length);
    };

    const prevSlide = () => {
        setActiveSlide((prev) => (prev - 1 + safeSlides.length) % safeSlides.length);
    };

    return (
        <div className="catalog">
            <section className="hero-slider-section">
                <div className="hero-slider-shell">
                    <a href="/product" className="hero-slider-track" style={{transform: `translateX(-${activeSlide * 100}%)`}}>
                        {safeSlides.map((slide, index) => (
                            <article key={slide.id} className="hero-slide">
                                <img
                                    src={slide.value}
                                    alt={slide.description}
                                    loading={index === activeSlide ? "eager" : "lazy"}
                                    decoding="async"
                                    fetchPriority={index === activeSlide ? "high" : "low"}
                                />
                                <div className="hero-slide-overlay">
                                    <span className="hero-pill">Trend Burada Özel</span>
                                    <h2>{slide.description}</h2>
                                    <p>Sezonun öne çıkan parçalarını kaçırmadan keşfedin.</p>
                                </div>
                            </article>
                        ))}
                    </a>

                    <button type="button" className="hero-nav prev" onClick={prevSlide} aria-label="Önceki slide">‹</button>
                    <button type="button" className="hero-nav next" onClick={nextSlide} aria-label="Sonraki slide">›</button>
                </div>

                <div className="hero-dots">
                    {safeSlides.map((slide, index) => (
                        <button
                            key={slide.id}
                            type="button"
                            className={`hero-dot ${index === activeSlide ? 'is-active' : ''}`}
                            onClick={() => setActiveSlide(index)}
                            aria-label={`Slide ${index + 1}`}
                        />
                    ))}
                </div>
            </section>

            <section className="campaign-showcase-section">
                <div className="section-head">
                    <h3>Öne Çıkan Koleksiyonlar</h3>
                    <a href="/product">Tüm Kampanyalar</a>
                </div>
                <div className="trend-card-grid">
                    {trendCards.map((item) => (
                        <a key={item.id} href="/product" className="trend-card">
                            <img src={item.value} alt={item.description} loading="lazy" decoding="async" />
                            <span className="campaign-caption">{item.description}</span>
                        </a>
                    ))}
                </div>
            </section>

            <section className="discovery-section">
                <a href="/product" className="discovery-lead">
                    <img
                        src={(mosaicCards[0] || safeSlides[0]).value}
                        alt={(mosaicCards[0] || safeSlides[0]).description}
                        loading="lazy"
                        decoding="async"
                    />
                    <div>
                        <h3>{(mosaicCards[0] || safeSlides[0]).description}</h3>
                        <p>Stiline uygun parçaları tek ekranda bul.</p>
                    </div>
                </a>

                <div className="discovery-grid">
                    {mosaicCards.slice(1).map((item) => (
                        <a key={item.id} href="/product" className="discovery-card">
                            <img src={item.value} alt={item.description} loading="lazy" decoding="async" />
                            <span className="campaign-caption">{item.description}</span>
                        </a>
                    ))}
                </div>
            </section>

            <section className="campaign-list">
                <div className="section-head">
                    <h3>Sana Özel Fırsatlar</h3>
                    <a href="/product">Hepsini Gör</a>
                </div>

                <div className="campaign-list-item">
                    {campaignCards.map((item) => (
                        <div key={item.id} className="campaign-item">
                            <a href="/product">
                                <div className="campaign-item-img-wrap">
                                    <img className="campaign-item-img" src={item.value} alt={item.description} loading="lazy" decoding="async" />
                                </div>
                                <div className="campaign-item-summary">
                                    <span className="campaign-caption">{item.description}</span>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

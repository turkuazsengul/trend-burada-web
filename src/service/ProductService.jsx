import axios from "axios";
import {
    PRODUCT_FACETS_URL,
    PRODUCT_LIST_URL,
    USE_STATIC_PRODUCT_DATA
} from "../constants/UrlConstans";
import {getAllCategoryKeys, getCategoryMeta, getCategoryProducts} from "../data/demoProductData";

const STATIC_TARGET_COUNT = 54;

const BRAND_POOL = [
    "Zara", "Mango", "Koton", "Ipekyol", "Mavi", "Stradivarius", "H&M", "LCW Vision", "Massimo"
];

const COLOR_POOL = [
    "Siyah", "Beyaz", "Bej", "Lacivert", "Haki", "Kırmızı", "Gri", "Mavi", "Krem", "Pembe"
];

const SIZE_POOL = ["XS", "S", "M", "L", "XL"];

const INSTALLMENT_POOL = ["Peşin fiyatına", "2 taksit", "3 taksit", "4 taksit", "6 taksit"];

const IMAGE_POOL = [
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1800&q=90",
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1800&q=90",
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1800&q=90",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=90",
    "https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=1800&q=90",
    "https://images.unsplash.com/photo-1465406325903-9d93ee82f613?auto=format&fit=crop&w=1800&q=90",
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1800&q=90",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1800&q=90",
    "https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?auto=format&fit=crop&w=1800&q=90",
    "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1800&q=90",
    "https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=1800&q=90",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1800&q=90",
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1800&q=90",
    "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=1800&q=90",
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1800&q=90"
];

const TITLE_PREFIX = [
    "Premium", "Modern", "Minimal", "Zamansız", "Şık", "Günlük", "Klasik", "Rahat", "Trend", "Yumuşak Dokulu"
];

const FIT_POOL = ["Regular Fit", "Slim Fit", "Oversize", "Relaxed Fit"];
const FABRIC_POOL = ["Pamuk", "Pamuk - Elastan", "Viskon", "Keten Karışımlı", "Modal"];
const ORIGIN_POOL = ["Türkiye", "İtalya", "Portekiz", "İspanya"];

const unwrapList = (payload) => {
    const list = payload?.returnData || payload?.data || payload?.products || payload || [];
    return Array.isArray(list) ? list : [];
};

const normalizeProduct = (item) => {
    if (!item || typeof item !== "object") {
        return null;
    }

    return {
        id: item.id,
        title: item.title,
        mark: item.mark || item.brand || item.sellerName || "Marka",
        price: Number(item.price || 0),
        oldPrice: Number(item.oldPrice || item.listPrice || item.price || 0),
        discountRate: Number(item.discountRate || item.discount || 0),
        rating: Number(item.rating || 0),
        reviewCount: Number(item.reviewCount || item.commentCount || 0),
        img: item.img || item.imageUrl || item.image,
        color: item.color || "Standart",
        size: item.size || "M",
        sizeOptions: Array.isArray(item.sizeOptions)
            ? item.sizeOptions
            : (Array.isArray(item.sizes) ? item.sizes : []),
        colorOptions: Array.isArray(item.colorOptions)
            ? item.colorOptions
            : (Array.isArray(item.colors) ? item.colors : []),
        isFreeCargo: Boolean(item.isFreeCargo),
        isFastDelivery: Boolean(item.isFastDelivery),
        sellerScore: Number(item.sellerScore || 0),
        installmentText: item.installmentText || "Peşin fiyatına",
        highlights: Array.isArray(item.highlights) ? item.highlights : (Array.isArray(item.keyFeatures) ? item.keyFeatures : []),
        attributes: Array.isArray(item.attributes)
            ? item.attributes
            : (Array.isArray(item.specifications) ? item.specifications : [])
    };
};

const normalizeFacets = (raw) => {
    if (Array.isArray(raw)) {
        return raw;
    }

    if (!raw || typeof raw !== "object") {
        return [];
    }

    const entries = Object.entries(raw);
    return entries.map(([key, value]) => {
        if (!Array.isArray(value)) {
            return null;
        }

        return {
            key,
            title: key,
            options: value
        };
    }).filter(Boolean);
};

const getStaticProductsByCategory = (categoryKey) => {
    const categoryMeta = getCategoryMeta(categoryKey);
    const base = getCategoryProducts(categoryKey) || [];
    const coreWords = categoryMeta?.productWords || ["Koleksiyon"];
    const suffix = categoryMeta?.suffixLabel || "Ürün";
    const imagePool = Array.isArray(categoryMeta?.imagePool) && categoryMeta.imagePool.length > 0
        ? categoryMeta.imagePool
        : IMAGE_POOL;

    const products = [];

    for (let i = 0; i < STATIC_TARGET_COUNT; i += 1) {
        const seed = base[i % Math.max(base.length, 1)] || {};
        const mark = BRAND_POOL[(i + categoryKey.length) % BRAND_POOL.length];
        const color = COLOR_POOL[(i * 2 + categoryKey.length) % COLOR_POOL.length];
        const size = SIZE_POOL[(i + 1) % SIZE_POOL.length];
        const sizeOptions = [
            SIZE_POOL[(i + 0) % SIZE_POOL.length],
            SIZE_POOL[(i + 1) % SIZE_POOL.length],
            SIZE_POOL[(i + 2) % SIZE_POOL.length],
            SIZE_POOL[(i + 3) % SIZE_POOL.length]
        ];
        const img = imagePool[(i + categoryKey.length) % imagePool.length] || seed.img;
        const colorOptions = [
            {
                name: color,
                image: img
            },
            {
                name: COLOR_POOL[(i + 1 + categoryKey.length) % COLOR_POOL.length],
                image: imagePool[(i + 2 + categoryKey.length) % imagePool.length]
            },
            {
                name: COLOR_POOL[(i + 3 + categoryKey.length) % COLOR_POOL.length],
                image: imagePool[(i + 4 + categoryKey.length) % imagePool.length]
            }
        ];
        const prefix = TITLE_PREFIX[(i + 3) % TITLE_PREFIX.length];
        const core = coreWords[i % coreWords.length];
        const title = `${prefix} ${core} ${suffix}`;

        const basePrice = 650 + ((i % 12) * 130) + (categoryKey.length * 17);
        const oldPrice = basePrice + 220 + ((i % 5) * 90);
        const discountRate = Math.max(0, Math.round(((oldPrice - basePrice) / oldPrice) * 100));

        products.push({
            id: `${categoryKey}-${i + 1}`,
            title,
            mark,
            price: basePrice,
            oldPrice,
            discountRate,
            rating: 3 + ((i + 1) % 3),
            reviewCount: 35 + (i * 19),
            img,
            color,
            size,
            sizeOptions: Array.from(new Set(sizeOptions)),
            colorOptions,
            isFreeCargo: i % 2 === 0,
            isFastDelivery: i % 3 !== 0,
            sellerScore: Number((8.8 + ((i % 10) * 0.1)).toFixed(1)),
            installmentText: INSTALLMENT_POOL[i % INSTALLMENT_POOL.length],
            highlights: [
                "Nefes alan kumaş yapısı",
                "Gün boyu konfor sağlayan kesim",
                "Sezon kombinlerine uyumlu modern tasarım"
            ],
            attributes: [
                {label: "Kalıp", value: FIT_POOL[i % FIT_POOL.length]},
                {label: "Materyal", value: FABRIC_POOL[i % FABRIC_POOL.length]},
                {label: "Renk", value: color},
                {label: "Beden", value: size},
                {label: "Menşei", value: ORIGIN_POOL[i % ORIGIN_POOL.length]}
            ]
        });
    }

    return products;
};

const resolveCategoryFromProductId = (productId = '') => {
    if (!productId) {
        return null;
    }

    const normalized = String(productId).toLowerCase();
    const keys = getAllCategoryKeys().sort((a, b) => b.length - a.length);
    return keys.find((key) => normalized.startsWith(`${key}-`)) || null;
};

const findStaticProductById = (productId) => {
    const preferredCategory = resolveCategoryFromProductId(productId);

    if (preferredCategory) {
        const preferredProducts = getStaticProductsByCategory(preferredCategory);
        const preferred = preferredProducts.find((item) => String(item.id) === String(productId));
        if (preferred) {
            return preferred;
        }
    }

    const allKeys = getAllCategoryKeys();
    for (let i = 0; i < allKeys.length; i += 1) {
        const key = allKeys[i];
        const list = getStaticProductsByCategory(key);
        const found = list.find((item) => String(item.id) === String(productId));
        if (found) {
            return found;
        }
    }

    return null;
};

const getStaticFacetsByProducts = (products) => {
    const countBy = (key) => products.reduce((acc, item) => {
        const value = item[key];
        acc[value] = (acc[value] || 0) + 1;
        return acc;
    }, {});

    const mapOptions = (counts) => Object.keys(counts).map((value) => ({
        value,
        label: value,
        count: counts[value]
    }));

    const ratingOptions = [
        {value: '4.5+', label: '4.5 ve Üzeri', count: products.filter((p) => Number(p.rating || 0) >= 4.5).length},
        {value: '4.0+', label: '4.0 ve Üzeri', count: products.filter((p) => Number(p.rating || 0) >= 4.0).length},
        {value: '3.5+', label: '3.5 ve Üzeri', count: products.filter((p) => Number(p.rating || 0) >= 3.5).length}
    ];

    const sellerScoreOptions = [
        {value: '9.5+', label: '9.5 ve Üzeri', count: products.filter((p) => Number(p.sellerScore || 0) >= 9.5).length},
        {
            value: '9.0-9.4',
            label: '9.0 - 9.4',
            count: products.filter((p) => Number(p.sellerScore || 0) >= 9.0 && Number(p.sellerScore || 0) < 9.5).length
        },
        {
            value: '8.5-8.9',
            label: '8.5 - 8.9',
            count: products.filter((p) => Number(p.sellerScore || 0) >= 8.5 && Number(p.sellerScore || 0) < 9.0).length
        }
    ];

    const discountOptions = [
        {value: '10+', label: '%10 ve Üzeri', count: products.filter((p) => Number(p.discountRate || 0) >= 10).length},
        {value: '20+', label: '%20 ve Üzeri', count: products.filter((p) => Number(p.discountRate || 0) >= 20).length},
        {value: '30+', label: '%30 ve Üzeri', count: products.filter((p) => Number(p.discountRate || 0) >= 30).length}
    ];

    const installmentCounts = countBy(products, 'installmentText');

    return [
        {key: 'mark', title: 'Marka', options: mapOptions(countBy('mark'))},
        {key: 'size', title: 'Beden', options: mapOptions(countBy('size'))},
        {key: 'color', title: 'Renk', options: mapOptions(countBy('color'))},
        {
            key: 'priceRange',
            title: 'Fiyat',
            options: [
                {value: '0-999', label: '0 - 999 TL', count: products.filter((p) => p.price <= 999).length},
                {value: '1000-1999', label: '1.000 - 1.999 TL', count: products.filter((p) => p.price >= 1000 && p.price <= 1999).length},
                {value: '2000+', label: '2.000 TL ve üzeri', count: products.filter((p) => p.price >= 2000).length}
            ]
        },
        {key: 'rating', title: 'Değerlendirme', options: ratingOptions},
        {key: 'sellerScore', title: 'Satıcı Puanı', options: sellerScoreOptions},
        {key: 'discountRate', title: 'İndirim', options: discountOptions},
        {
            key: 'isFastDelivery',
            title: 'Teslimat',
            options: [{value: 'true', label: 'Hızlı Teslimat', count: products.filter((p) => Boolean(p.isFastDelivery)).length}]
        },
        {
            key: 'isFreeCargo',
            title: 'Kargo',
            options: [{value: 'true', label: 'Kargo Bedava', count: products.filter((p) => Boolean(p.isFreeCargo)).length}]
        },
        {key: 'installmentText', title: 'Ödeme Seçeneği', options: mapOptions(installmentCounts)}
    ];
};

const getProductsByCategory = (categoryKey) => {
    if (USE_STATIC_PRODUCT_DATA || !PRODUCT_LIST_URL) {
        return Promise.resolve(getStaticProductsByCategory(categoryKey));
    }

    return axios.get(PRODUCT_LIST_URL, {params: {category: categoryKey}})
        .then((response) => unwrapList(response?.data).map(normalizeProduct).filter(Boolean))
        .catch((error) => {
            console.log('error ' + error);
            return getStaticProductsByCategory(categoryKey);
        });
};

const getFacetsByCategory = (categoryKey) => {
    if (USE_STATIC_PRODUCT_DATA || !PRODUCT_FACETS_URL) {
        return Promise.resolve(getStaticFacetsByProducts(getStaticProductsByCategory(categoryKey)));
    }

    return axios.get(PRODUCT_FACETS_URL, {params: {category: categoryKey}})
        .then((response) => {
            const payload = response?.data;
            const facets = payload?.returnData || payload?.data || payload?.facets || payload;
            const normalized = normalizeFacets(facets);
            return normalized.length > 0 ? normalized : getStaticFacetsByProducts(getStaticProductsByCategory(categoryKey));
        })
        .catch((error) => {
            console.log('error ' + error);
            return getStaticFacetsByProducts(getStaticProductsByCategory(categoryKey));
        });
};

const getAllProducts = () => {
    if (USE_STATIC_PRODUCT_DATA || !PRODUCT_LIST_URL) {
        const allKeys = getAllCategoryKeys();
        const allProducts = allKeys.flatMap((key) => getStaticProductsByCategory(key));
        return Promise.resolve(allProducts);
    }

    return axios.get(PRODUCT_LIST_URL)
        .then((response) => unwrapList(response?.data).map(normalizeProduct).filter(Boolean))
        .catch((error) => {
            console.log('error ' + error);
            const allKeys = getAllCategoryKeys();
            return allKeys.flatMap((key) => getStaticProductsByCategory(key));
        });
};

const getFacetsByProducts = (products) => {
    const safeProducts = Array.isArray(products) ? products : [];
    return Promise.resolve(getStaticFacetsByProducts(safeProducts));
};

const getProductById = (productId) => {
    if (!productId) {
        return Promise.resolve(null);
    }

    if (USE_STATIC_PRODUCT_DATA || !PRODUCT_LIST_URL) {
        return Promise.resolve(findStaticProductById(productId));
    }

    return axios.get(PRODUCT_LIST_URL, {params: {productId}})
        .then((response) => {
            const list = unwrapList(response?.data).map(normalizeProduct).filter(Boolean);
            if (list.length > 0) {
                return list[0];
            }
            return findStaticProductById(productId);
        })
        .catch((error) => {
            console.log('error ' + error);
            return findStaticProductById(productId);
        });
};

const getRelatedProductsByProductId = (productId, limit = 10) => {
    const categoryKey = resolveCategoryFromProductId(productId) || 'elbise';
    return getProductsByCategory(categoryKey).then((products) => {
        const list = Array.isArray(products) ? products : [];
        return list.filter((item) => String(item.id) !== String(productId)).slice(0, limit);
    });
};

export default {
    getProductsByCategory,
    getFacetsByCategory,
    getAllProducts,
    getFacetsByProducts,
    getProductById,
    getRelatedProductsByProductId
};

import axios from "axios";
import ProductService from "../../../service/ProductService";
import {PRODUCT_LIST_URL, USE_STATIC_PRODUCT_DATA} from "../../../constants/UrlConstans";
import AuthService from "../../../service/AuthService";
import {getSellerProfile, getSellerProfiles, resolveSeedOwnerEmail} from '../data/sellerCatalogConfig';

const LOCAL_PRODUCTS_KEY = "tb_seller_local_products";
const PRODUCT_OWNERSHIP_KEY = "tb_seller_product_ownership";

const toArray = (value) => Array.isArray(value) ? value : [];
const unwrapPayload = (response) => response?.data?.data || response?.data?.returnData || response?.data?.product || response?.data || null;
const buildAuthorizedConfig = () => {
    const token = AuthService.getBearerToken();
    return token ? {headers: {Authorization: `Bearer ${token}`}} : {};
};

const getCurrentUser = () => AuthService.getCurrentUser();
const getCurrentSellerProfile = () => getSellerProfile(getCurrentUser());
const currentUserHasAdminRole = () => {
    const roles = Array.isArray(getCurrentUser()?.roleList) ? getCurrentUser().roleList : [];
    return roles.some((role) => role?.name === 'ADMIN');
};

const readJsonStorage = (key, fallbackValue) => {
    try {
        const rawValue = localStorage.getItem(key);
        if (!rawValue) {
            return fallbackValue;
        }
        const parsed = JSON.parse(rawValue);
        return parsed ?? fallbackValue;
    } catch (error) {
        return fallbackValue;
    }
};

const readLocalProducts = () => {
    const parsed = readJsonStorage(LOCAL_PRODUCTS_KEY, []);
    return Array.isArray(parsed) ? parsed : [];
};

const writeLocalProducts = (items) => {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(toArray(items)));
};

const readOwnershipMap = () => {
    const parsed = readJsonStorage(PRODUCT_OWNERSHIP_KEY, {});
    return parsed && !Array.isArray(parsed) ? parsed : {};
};

const writeOwnershipMap = (value) => {
    localStorage.setItem(PRODUCT_OWNERSHIP_KEY, JSON.stringify(value || {}));
};

const rememberProductOwner = (productCode, email) => {
    if (!productCode || !email) {
        return;
    }

    const ownershipMap = readOwnershipMap();
    ownershipMap[String(productCode)] = String(email || '').trim().toLowerCase();
    writeOwnershipMap(ownershipMap);
};

const normalizeFormPayload = (form, existingProduct = null) => {
    const safeCategory = String(form.category || "").trim();
    const safeTitle = String(form.title || "").trim();
    const safeBrand = String(form.brand || "").trim();
    const safeCode = String(form.productCode || `${safeCategory || 'urun'}-${Date.now()}`).trim();

    return {
        title: safeTitle,
        category: safeCategory,
        brand: safeBrand,
        imageUrl: String(form.imageUrl || "").trim(),
        oldPrice: Number(form.oldPrice || 0),
        discountRate: Number(form.discountRate || 0),
        rating: Number(existingProduct?.rating || 0),
        reviewCount: Number(existingProduct?.reviewCount || 0),
        color: String(form.color || "").trim(),
        size: String(form.size || "").trim(),
        freeCargo: Boolean(form.freeCargo),
        price: Number(form.price || 0),
        fastDelivery: Boolean(form.fastDelivery),
        sellerScore: Number(existingProduct?.sellerScore || 0),
        installmentText: String(form.installmentText || "Peşin fiyatına").trim(),
        productCode: safeCode
    };
};

export const buildSellerProductForm = (product) => ({
    title: product?.title || '',
    category: product?.category || '',
    brand: product?.brand || product?.mark || '',
    productCode: product?.productCode || product?.routeId || product?.id || '',
    imageUrl: product?.imageUrl || product?.img || '',
    price: String(product?.price ?? ''),
    oldPrice: String(product?.oldPrice ?? ''),
    discountRate: String(product?.discountRate ?? ''),
    color: product?.color || '',
    size: product?.size || '',
    installmentText: product?.installmentText || 'Peşin fiyatına',
    freeCargo: Boolean(product?.freeCargo ?? product?.isFreeCargo),
    fastDelivery: Boolean(product?.fastDelivery ?? product?.isFastDelivery)
});

const mapCreatedProduct = (payload) => {
    if (!payload || typeof payload !== "object") {
        return null;
    }

    return {
        id: payload.id || payload.productCode,
        productCode: payload.productCode || payload.id,
        routeId: payload.productCode || payload.id,
        title: payload.title,
        mark: payload.mark || payload.brand,
        brand: payload.brand || payload.mark,
        category: payload.category,
        price: Number(payload.price || 0),
        oldPrice: Number(payload.oldPrice || payload.price || 0),
        discountRate: Number(payload.discountRate || 0),
        rating: Number(payload.rating || 0),
        reviewCount: Number(payload.reviewCount || 0),
        img: payload.img || payload.imageUrl,
        imageUrl: payload.imageUrl || payload.img,
        color: payload.color || "Standart",
        size: payload.size || "M",
        sizeOptions: payload.size ? [payload.size] : [],
        colorOptions: payload.color ? [{name: payload.color, image: payload.imageUrl || payload.img || ""}] : [],
        freeCargo: Boolean(payload.freeCargo ?? payload.isFreeCargo),
        isFreeCargo: Boolean(payload.freeCargo ?? payload.isFreeCargo),
        fastDelivery: Boolean(payload.fastDelivery ?? payload.isFastDelivery),
        isFastDelivery: Boolean(payload.fastDelivery ?? payload.isFastDelivery),
        sellerScore: Number(payload.sellerScore || 0),
        installmentText: payload.installmentText || "Peşin fiyatına",
        highlights: toArray(payload.highlights),
        attributes: toArray(payload.attributes)
    };
};

const withOwnershipMetadata = (items) => {
    const ownershipMap = readOwnershipMap();
    return toArray(items).map((item) => {
        const productCode = String(item?.productCode || item?.routeId || item?.id || '');
        return {
            ...item,
            ownerEmail: resolveSeedOwnerEmail(item, ownershipMap),
            ownerProductCode: productCode
        };
    });
};

const filterProductsForCurrentSeller = (items) => {
    const enriched = withOwnershipMetadata(items);
    if (currentUserHasAdminRole()) {
        return enriched;
    }

    const sellerEmail = String(getCurrentUser()?.email || '').trim().toLowerCase();
    return enriched.filter((item) => String(item.ownerEmail || '').toLowerCase() === sellerEmail);
};

const getSellerProducts = async () => {
    const [catalogProducts, localProducts] = await Promise.all([
        ProductService.getAllProducts().catch(() => []),
        Promise.resolve(readLocalProducts())
    ]);

    return filterProductsForCurrentSeller([...toArray(localProducts), ...toArray(catalogProducts)]);
};

const createSellerProduct = async (form) => {
    const payload = normalizeFormPayload(form);
    const currentEmail = getCurrentUser()?.email;

    if (USE_STATIC_PRODUCT_DATA || !PRODUCT_LIST_URL) {
        const localProducts = readLocalProducts();
        const product = mapCreatedProduct({
            ...payload,
            id: payload.productCode,
            mark: payload.brand,
            img: payload.imageUrl,
            isFreeCargo: payload.freeCargo,
            isFastDelivery: payload.fastDelivery
        });
        writeLocalProducts([product, ...localProducts]);
        rememberProductOwner(product?.productCode || product?.id, currentEmail);
        return product;
    }

    const response = await axios.post(PRODUCT_LIST_URL, payload, buildAuthorizedConfig());
    const created = mapCreatedProduct(unwrapPayload(response));
    rememberProductOwner(created?.productCode || created?.id, currentEmail);
    return created;
};

const getSellerProductById = async (productId) => {
    const allProducts = await getSellerProducts();
    return allProducts.find((item) => String(item.productCode || item.routeId || item.id) === String(productId)) || null;
};

const updateSellerProduct = async (productId, form) => {
    const existingProduct = await getSellerProductById(productId);
    const payload = normalizeFormPayload(form, existingProduct);
    const currentEmail = getCurrentUser()?.email;

    if (USE_STATIC_PRODUCT_DATA || !PRODUCT_LIST_URL) {
        const localProducts = readLocalProducts();
        const nextProduct = mapCreatedProduct({
            ...existingProduct,
            ...payload,
            id: productId,
            productCode: payload.productCode || productId,
            mark: payload.brand,
            img: payload.imageUrl,
            isFreeCargo: payload.freeCargo,
            isFastDelivery: payload.fastDelivery,
            highlights: existingProduct?.highlights || [],
            attributes: existingProduct?.attributes || []
        });
        const currentCode = String(productId);
        const nextItems = localProducts.map((item) => (
            String(item.productCode || item.routeId || item.id) === currentCode ? nextProduct : item
        ));
        writeLocalProducts(nextItems);
        rememberProductOwner(nextProduct?.productCode || nextProduct?.id || productId, currentEmail);
        return nextProduct;
    }

    const response = await axios.put(`${PRODUCT_LIST_URL}/${encodeURIComponent(productId)}`, payload, buildAuthorizedConfig());
    const updated = mapCreatedProduct({
        ...existingProduct,
        ...unwrapPayload(response),
        highlights: unwrapPayload(response)?.highlights || existingProduct?.highlights || [],
        attributes: unwrapPayload(response)?.attributes || existingProduct?.attributes || []
    });
    rememberProductOwner(updated?.productCode || updated?.id || productId, currentEmail);
    return updated;
};

const deleteSellerProduct = async (productId) => {
    const ownershipMap = readOwnershipMap();
    delete ownershipMap[String(productId)];
    writeOwnershipMap(ownershipMap);

    if (USE_STATIC_PRODUCT_DATA || !PRODUCT_LIST_URL) {
        const localProducts = readLocalProducts();
        const nextItems = localProducts.filter((item) => String(item.productCode || item.routeId || item.id) !== String(productId));
        writeLocalProducts(nextItems);
        return true;
    }

    const response = await axios.delete(`${PRODUCT_LIST_URL}/${encodeURIComponent(productId)}`, buildAuthorizedConfig());
    return Boolean(unwrapPayload(response));
};

const getSellerWorkspaceSummary = () => ({
    profile: getCurrentSellerProfile(),
    profiles: getSellerProfiles()
});

export default {
    getSellerProducts,
    createSellerProduct,
    getSellerProductById,
    updateSellerProduct,
    deleteSellerProduct,
    buildSellerProductForm,
    getSellerWorkspaceSummary
};

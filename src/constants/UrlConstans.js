export const KEYCLOAK_BASE_URL = process.env.REACT_APP_KEYCLOAK_BASE_URL
export const KEYCLOAK_TOKEN_URL = process.env.REACT_APP_KEYCLOAK_TOKEN_URL


export const LOGIN_URL = process.env.REACT_APP_LOGIN_URL
export const USER_INFO_URL = process.env.REACT_APP_USER_INFO_URL
export const USER_UPDATE_URL = process.env.REACT_APP_USER_UPDATE_URL
export const REGISTER_URL = process.env.REACT_APP_REGISTER_URL
export const LOGOUT_URL = process.env.REACT_APP_LOGOUT_URL

export const KEYCLOAK_CLIENT_ID = process.env.REACT_APP_KEYCLOAK_CLIENT_ID
export const KEYCLOAK_GRANT_TYPE = process.env.REACT_APP_KEYCLOAK_GRANT_TYPE
export const USE_DEMO_LOCAL_AUTH = (process.env.REACT_APP_USE_DEMO_LOCAL_AUTH || "true").toLowerCase() === "true"


export const MY_USER_INFO_URL = process.env.REACT_APP_MY_USER_INFO_URL
export const MY_ORDER_URL = process.env.REACT_APP_MY_ORDER_URL
export const MY_ADDRESS_URL = process.env.REACT_APP_MY_ADDRESS_URL || "/hesabım/Adreslerim"

export const PROMO_IMAGES_URL = process.env.REACT_APP_PROMO_IMAGES_URL
export const USE_STATIC_PROMO_IMAGES = (process.env.REACT_APP_USE_STATIC_PROMO_IMAGES || "true").toLowerCase() === "true"
export const CAMPAIGN_ITEMS_URL = process.env.REACT_APP_CAMPAIGN_ITEMS_URL
export const USE_STATIC_CAMPAIGN_ITEMS = (process.env.REACT_APP_USE_STATIC_CAMPAIGN_ITEMS || "true").toLowerCase() === "true"

export const PRODUCT_LIST_URL = process.env.REACT_APP_PRODUCT_LIST_URL
export const PRODUCT_FACETS_URL = process.env.REACT_APP_PRODUCT_FACETS_URL
export const USE_STATIC_PRODUCT_DATA = (process.env.REACT_APP_USE_STATIC_PRODUCT_DATA || "true").toLowerCase() === "true"
export const SEARCH_URL = process.env.REACT_APP_SEARCH_URL
export const USE_STATIC_SEARCH_DATA = (process.env.REACT_APP_USE_STATIC_SEARCH_DATA || "true").toLowerCase() === "true"

export const FAVORITE_LIST_URL = process.env.REACT_APP_FAVORITE_LIST_URL
export const FAVORITE_TOGGLE_URL = process.env.REACT_APP_FAVORITE_TOGGLE_URL
export const USE_STATIC_FAVORITE_DATA = (process.env.REACT_APP_USE_STATIC_FAVORITE_DATA || "true").toLowerCase() === "true"

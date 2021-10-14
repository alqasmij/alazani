import AsyncStorage from '@react-native-async-storage/async-storage';

const api_site = 'https://alazzani.net';
const api_base = api_site + '/api/';

async function _getFromServer(path, key) {
    const url = api_base + path;
    return fetch(url).then(response => {
        if (response.ok) {
            return response.json().then(data => {
                AsyncStorage.setItem(key, JSON.stringify(data));
                return Promise.resolve(data);
            });
        } else {
            return Promise.reject("unable to load data from server");
        }
    }).catch(() => {
        return Promise.reject("unable to load data from wrong address");
    });
}

async function _get_data(path) {
    path = path.replace(api_base, '')
    const key = `@KunavaStore:${path}`;

    return _getFromServer(path, key).then((data) => {
        return Promise.resolve(data);
    }).catch((e) => {
        return AsyncStorage.getItem(key).then(data => {
            if (!data) {
                return Promise.reject("no data found in async storage and internet");
            }

            return Promise.resolve(JSON.parse(data));
        }).catch(() => {
            return Promise.reject("no data found in async storage and internet");
        });
    });
}

function GetCurrency() {
    return _get_data('currencies');
}

function FeaturedProducts() {
    return _get_data('products/featured');
}

function LatestProducts() {
    return _get_data('products');
}

function GetCategories() {
    return _get_data('categories');
}

function GetHomeCategories() {
    return _get_data('categories/home');
}

function GetBrands() {
    return _get_data('brands');
}

function GetTopBrands() {
    return _get_data('brands');
}

function Settings() {
    return _get_data('business-settings');
}

function GetByUrl(url) {
    return _get_data(url);
}

export {
    Settings,
    FeaturedProducts,
    api_site as API_SITE,
    GetCurrency,
    LatestProducts,
    GetCategories,
    GetBrands,
    GetHomeCategories,
    GetTopBrands,
    GetByUrl
}

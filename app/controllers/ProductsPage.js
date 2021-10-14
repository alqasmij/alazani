import React from 'react';
import ProductsView from "../components/ProductsView";
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function ProductsPage({navigation, route}) {
    route['data'] = {};
    route['data']['icon'] = (props) => {
        return <AntDesign name="tags" size={20} {...props} />;
    };

    route['data']['fullTitle'] = 'آخر منتجات: ' + (route['params']['type'] === 'brands' ? 'ماركة' : 'فئة') + ' ' + route.params['title'];
    if (route.params && route.params['type'] === 'search') {
        route['data']['fullTitle'] = route['params']['fullTitle'];
    }

    return (
        <>
            <ProductsView navigation={navigation} route={route} />
        </>
    );
}

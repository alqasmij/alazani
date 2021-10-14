import {ActivityIndicator, RefreshControl} from 'react-native';
import {appSecondaryColors} from '../helpers/Theme';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {GetByUrl} from '../helpers/Api';
import Product from '../fragments/ProductItem';
import {Box, Button, Center, FlatList, View} from 'native-base';
import {NetworkErrorAlert, SectionTitle, ShowAlert} from '../reusables/Components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {isEmptyObject, useUpdateEffect} from "../helpers/Helpers";

export default function ProductsView({navigation, route}) {
    let [url, setUrl] = useState(route.params['url']);
    let [products, setProducts] = useState({
        'data': [],
        'links': {
            load_more: null
        },
    });

    let [connectionError, setConnectionError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    let [isRequested, setIsRequested] = useState(false);
    let [isShowMore, setIsShowMore] = useState(false);
    const listViewRef = useRef(null);
    const [scrollIndex, setScrollIndex] = useState(0);

    const onRefresh = () => {
        setRefreshing(true);
        setUrl(route.params['url']);
        setIsShowMore(false);
        setScrollIndex(0);
    };

    useUpdateEffect(() => {
        setIsRequested(products['data'].length > 0 && !refreshing);

        if (isRequested && !connectionError && !isShowMore) {
            return;
        }

        let promise;

        if (url.length) {
            promise = GetByUrl(url);
            promise.then(function (data) {
                if (typeof data['links'] === 'undefined') {
                    data['links'] = {
                        load_more: null
                    };
                }

                if (isShowMore) {
                    setScrollIndex(scrollIndex + 1);
                    setProducts({
                        links: data['links'],
                        data: products['data'].concat(data['data'])
                    });
                    setUrl('');
                } else {
                    setProducts(data);
                }

                setConnectionError(false);
                setIsRequested(true);
                setRefreshing(false);
            }).catch(function (e) {
                setConnectionError(true);
                setRefreshing(false);
                setIsShowMore(false);
                setIsRequested(true);
            });
        }
    }, [isShowMore, refreshing], () => {
        setRefreshing(false);
        setIsRequested(false);
    });

    useLayoutEffect(() => {
        setIsShowMore(false);
    }, [products['data']])

    if (connectionError && !products['data'].length) {
        return (
            <Center flex={1} align="center" alignContent="center">
                <NetworkErrorAlert h="100%" p={5} onPress={() => {
                    setRefreshing(true);
                }} />
            </Center>
        );
    }

    if (isEmptyObject(products['data']) && !isShowMore && (refreshing || !isRequested)) {
        return (
            <Center align="center" h="100%" alignContent="center">
                <ActivityIndicator size="large" color={appSecondaryColors['900']} />
            </Center>
        );
    }

    let pagination = null;
    if (products['links']['load_more']) {
        pagination =
            <Box px={3} mt={4} pb={4}>
                <Button size="sm"
                        variant="outline"
                        isLoading={isShowMore}
                        isLoadingText={"يرجى الإنتظار"}
                        colorScheme="blue" onPress={() => {
                    setUrl(products['links']['load_more']);
                    setIsShowMore(true);
                }}>
                    عرض المزيد
                </Button>
            </Box>
    }

    return (
        <>
            <SectionTitle icon={route.data.icon} title={route.data.fullTitle} mb={0} />
            {products['data'].length ? <>
                    <FlatList
                        ref={listViewRef}
                        data={products['data']}
                        keyExtractor={item => item.id}
                        initialScrollIndex={scrollIndex}
                        numColumns={2}
                        onContentSizeChange={() => {
                            if (scrollIndex > 0) {
                                listViewRef?.current?.scrollToEnd();
                            }
                        }}
                        px={2}
                        renderItem={({item, index}) => {
                            return <Product key={item.id} navigation={navigation} data={item} />
                        }}
                        ListFooterComponent={() => {
                            return pagination ?? <View h={4} />;
                        }}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} h={'100%'} />
                </> :
                <ShowAlert flex={1} alignContent={'flex-start'} title="رسالة خطأ" message="عذرًا، لم يتم إيجاد أية منتجات للعرض هذه اللحظة." icon={
                    <MaterialIcons name="info" />} />}
        </>
    );
}

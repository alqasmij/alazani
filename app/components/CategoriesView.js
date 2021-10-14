import {ActivityIndicator, RefreshControl} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {GetByUrl} from '../helpers/Api';
import {Center, ScrollView} from 'native-base';
import {isEmptyObject, useUpdateEffect} from '../helpers/Helpers';
import {ItemsGrid, NetworkErrorAlert, SectionTitle} from '../reusables/Components';
import {appSecondaryColors} from "../helpers/Theme";
import CategoryItem from "../fragments/CategoryItem";

export default function CategoriesView({navigation, route}) {
    let [categories, setCategories] = useState({
        'data': [],
        'links': {},
    });

    let [connectionError, setConnectionError] = useState(false);
    let [isRequested, setIsRequested] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [categories_list, setCategories_list] = useState([]);

    const onRefresh = () => {
        setRefreshing(true);
    };

    useUpdateEffect(() => {
        if (refreshing) {
            setCategories_list([]);
            setCategories({
                'data': [],
                'links': {}
            });
        }

        if (refreshing || connectionError || (!categories['data'].length && !isRequested)) {
            let promise;
            promise = GetByUrl('categories/all')
            promise.then(function (data) {
                setCategories(data);
                setConnectionError(false);
                setIsRequested(true);
                setRefreshing(false);
            }).catch(function (e) {
                setConnectionError(true);
                setIsRequested(true);
                setRefreshing(false);
            });
        }
    }, [refreshing, categories], () => {
        setIsRequested(false);
        setRefreshing(false);
    });

    useUpdateEffect(() => {
        if(categories['data'].length === categories_list.length){
            return false;
        }
        setCategories_list([]);
        categories['data'].map((category) => {
            let key = category.name;
            let item = <CategoryItem navigation={navigation} key={key} data={category} />;

            setCategories_list((prev) => {
                return [...prev, item];
            });
        });
    }, [categories])

    if (connectionError) {
        return (
            <Center flex={1} align="center" alignContent="center">
                <NetworkErrorAlert h="100%" p={5} onPress={() => {
                    setRefreshing(true);
                }} />
            </Center>
        );
    }

    if (!categories_list.length) {
        return (
            <Center flex={1} align="center" alignContent="center">
                <ActivityIndicator size="large" color={appSecondaryColors['800']} />
            </Center>
        );
    }


    let gridContent = (
        <>
            <SectionTitle icon={route.data.icon} title={route.data.fullTitle} time={new Date().getTime()} />
            <ItemsGrid>
                {categories_list}
            </ItemsGrid>
        </>
    );

    return (
        <ScrollView refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {gridContent}
        </ScrollView>
    );
}

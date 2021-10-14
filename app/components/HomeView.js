import React, {useState} from "react";
import {Box, Center, Icon, SectionList} from "native-base";
import {GetByUrl} from "../helpers/Api";
import {DelayRun, isEmptyObject, Timer, useUpdateEffect} from "../helpers/Helpers";
import {NetworkErrorAlert, ItemsGrid, SectionTitle, ShowAlert, SubSectionTitle} from "../reusables/Components";
import {ActivityIndicator, TouchableOpacity} from "react-native";
import {appSecondaryColors} from "../helpers/Theme";
import AntDesign from "react-native-vector-icons/AntDesign";
import ProductItem from "../fragments/ProductItem";

export default function HomeView({navigation}) {
    let [categories, setCategories] = useState({
        'data': [],
        'links': {},
    });

    let [connectionError, setConnectionError] = useState(false);
    let [isRequested, setIsRequested] = useState(false);

    useUpdateEffect(() => {
        let promise = GetByUrl('categories/home');
        if (isRequested && !connectionError && categories['data'].length > 0) {
            return;
        }

        promise.then(function (data) {
            setConnectionError(false);
            setCategories(data);
            setIsRequested(true);
        }).catch((e) => {
            setConnectionError(true);
            setIsRequested(true);
        });
    }, [categories], () => {
        setIsRequested(false);
    });

    if (connectionError) {
        return (
            <Center flex={1} align="center" alignContent="center">
                <NetworkErrorAlert h="100%" p={5} onPress={() => {
                    setIsRequested(false);
                    setConnectionError(false);
                }} />
            </Center>
        );
    }

    if (isEmptyObject(categories['data']) && !isRequested) {
        return (
            <Center flex={1} align="center" alignContent="center">
                <ActivityIndicator size="large" color={appSecondaryColors['800']} />
            </Center>
        );
    }


    const renderSection = function ({section}) {
        return <TouchableOpacity onPress={() => {
            navigation.push('ProductsPage', {
                url: section['link'],
                title: section.name,
                type: 'categories'
            });
        }}>
            <SectionTitle title={section.name} mb={0} borderTopWidth={section['index'] > 0 ? 1 : 0} />
        </TouchableOpacity>
    };

    const renderItem = function ({item, section}) {
        switch (item.type) {
            case 'section':
                let data = [];
                item['data'].map((item, index) => {
                    if (index >= 4) {
                        return;
                    }
                    return data.push(
                        <ProductItem navigation={navigation} key={"product_item_" + item.id} data={item} />);
                });
                if (item.sub_type === 'top') {
                    return <>
                        <SubSectionTitle bg={"gray.100"} borderBottomWidth={1} borderBottomColor={"gray.200"} title="الأكثر مبيعًا" icon={
                            <Icon as={
                                <AntDesign name={"tagso"} />} size={"16px"} />} />
                        <ItemsGrid>
                            {data}
                        </ItemsGrid>
                    </>
                } else {
                    return <>
                        <SubSectionTitle bg={"gray.100"} borderTopColor={"gray.200"} borderTopWidth={section['data'][0]['sub_type'] === 'top' ? 1 : 0} borderBottomWidth={1} borderBottomColor={"gray.200"} mt={section['data'][0]['sub_type'] === 'top' ? 4 : 0} title="آخر المنتجات" icon={
                            <Icon as={
                                <AntDesign name={"linechart"} />} size={"16px"} />} />
                        <ItemsGrid>
                            {data}
                        </ItemsGrid>
                    </>;
                }

            case 'error':
                return <ShowAlert inline message={"لا توجد أية منتجات للعرض تابعة لتصنيف " + section.name} />
            default:
                return <></>
        }
    }

    const sections = [];
    categories['data'].map((item, index) => {
        let section = {
            'name': item.name,
            'link': item.link,
            'index': index,
            'data': []
        };

        let is_empty = !item['latest'].length && !item['top'].length;
        if (is_empty) {
            section['data'].push({
                type: 'error',
                id: 'all_error'
            });
        } else {
            ['top', 'latest'].map((section_data_type) => {
                if (item[section_data_type].length) {
                    section['data'].push({
                        type: 'section',
                        id: section_data_type + '_' + item.id,
                        sub_type: section_data_type,
                        data: item[section_data_type]
                    });
                }
            });

        }

        sections.push(section);
    });

    return <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        updateCellsBatchingPeriod={100}
        removeClippedSubviews={true}
        renderSectionFooter={() => <Box h={4} />}
        renderSectionHeader={renderSection}
    />
}

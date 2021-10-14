import React from 'react';
import {Box, Text} from "native-base";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CategoriesView from "../components/CategoriesView";
import ProductsView from "../components/ProductsView";
import HomeView from "../components/HomeView";
import {appSecondaryColors, appTheme, fonts} from "../helpers/Theme";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from "react-native-vector-icons/Fontisto";
import {useIsFocused} from "@react-navigation/native";

const tabRoutes = {
    'home': {
        icon: (props) => {
            return <MaterialIcons name="home" size={20} {...props} />;
        },
        title: 'الرئيسية',
        fullTitle: '',
        'render': (props) => {
            props['route']['data'] = tabRoutes[props.route.name];
            return <HomeView {...props} />;
        },
    },
    'latest-products': {
        icon: (props) => {
            return <AntDesign name="tags" size={20} {...props} />;
        },
        title: 'الأحدث',
        fullTitle: 'أحدث المنتجات',
        'render': (props) => {
            props['route']['data'] = tabRoutes[props.route.name];
            props['route']['params'] = {};
            props['route']['params']['url'] = 'products';
            return <ProductsView {...props} />;
        }
    },
    'categories': {
        icon: (props) => {
            return <Ionicons name="md-grid" size={18} {...props} />;
        },
        title: 'التصنيفات',
        fullTitle: 'جميع التصنيفات',
        'render': (props) => {
            props['route']['data'] = tabRoutes[props.route.name];
            return <CategoriesView {...props} />;
        }
    },

    'special': {
        icon: (props) => {
            return <Fontisto name="fire" size={18} {...props} />;
        },
        title: 'التخفيضات',
        fullTitle: 'جديد التخفيضات',
        'render': (props) => {
            props['route']['data'] = tabRoutes[props.route.name];
            props['route']['params'] = {};
            props['route']['params']['url'] = 'products?type=special';
            return <ProductsView {...props} />;
        }
    },
};

const Tab = createBottomTabNavigator();

export default function Home() {
    return (
        <>
            <Tab.Navigator screenOptions={({route}) => ({
                    tabBarIcon: ({focused, color}) => {
                        return <Box>
                            {tabRoutes[route.name].icon({
                                color: focused ? appSecondaryColors[900] : color
                            })}
                        </Box>;
                    },
                    tabBarLabel: ({focused, color}) => {
                        let props = {};
                        if (focused) {
                            props['fontFamily'] = fonts.bold;
                            props['color'] = color;
                        }
                        return (
                            <Box>
                                <Text fontSize={11} {...props}>
                                    {tabRoutes[route.name].title}
                                </Text>
                            </Box>
                        );
                    },
                }
            )}
                           tabBarOptions={{
                               activeTintColor: appSecondaryColors[900],
                               inactiveTintColor: appTheme.colors.gray[500],
                               tabStyle: {
                                   paddingBottom: 5,
                               },
                               labelStyle: {
                                   fontFamily: fonts.regular
                               }
                           }}
            >
                {
                    Object.keys(tabRoutes).map((name) => {
                        let view = tabRoutes[name];
                        return (
                            <Tab.Screen name={name} key={name} component={view.render} />
                        )
                    })
                }
            </Tab.Navigator>
        </>
    );
};

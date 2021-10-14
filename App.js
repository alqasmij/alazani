import React, {useEffect, useState} from 'react';
import {Box, NativeBaseProvider} from 'native-base';
import {I18nManager} from 'react-native';
import {appTheme} from './app/helpers/Theme';
import Home from './app/controllers/Home';
import ProductsPage from './app/controllers/ProductsPage';
import AppWebview from './app/controllers/Webview';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import AppBar from './app/fragments/AppBar';
import {SafeAreaProvider} from 'react-native-safe-area-context/src/SafeAreaContext';
import RNRestart from 'react-native-restart';
import AppLoading from "./app/components/AppLoading";
import {useUpdateEffect} from "./app/helpers/Helpers";
import SplashScreen from 'react-native-splash-screen'

const Stack = createStackNavigator();
export default function App() {
    if (!I18nManager.isRTL) {
        I18nManager.forceRTL(true);
        RNRestart.Restart();
        return <></>;
    }

    let [loadingFinished, setLoadingFinished] = useState(__DEV__);
    useEffect(() => {
        if (loadingFinished) {
            return;
        }

        let timeout = setTimeout(function () {
            setLoadingFinished(true);
            clearTimeout(timeout);
        }, 1000);
        return () => {
            setLoadingFinished(true);
        };
    });


    return (
        <NativeBaseProvider theme={appTheme}>
            <AppLoading isHidden={loadingFinished} />
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home" mode="modal" headerMode="screen">

                    <Stack.Screen name="Home" component={Home} options={{
                        header: (props) => {
                            return <AppBar {...props} isSplashScreen={!loadingFinished} />
                        }
                    }} />
                    <Stack.Screen options={{
                        headerShown: false
                    }} headerMode="none" name="WebView" component={AppWebview} />

                    <Stack.Screen
                        options={{
                            header: (props) => {
                                return <AppBar {...props} isSplashScreen={!loadingFinished} />
                            }
                        }}
                        name="ProductsPage" component={ProductsPage} />

                </Stack.Navigator>
            </NavigationContainer>
        </NativeBaseProvider>
    );
}

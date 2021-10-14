import * as React from 'react';
import {WebView} from 'react-native-webview';
import {API_SITE} from '../helpers/Api';
import {ActivityIndicator, BackHandler, Linking, TouchableWithoutFeedback} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import {Box, Center, HStack, Icon, IconButton, StatusBar, Text} from 'native-base';
import {getUrlInfo, useUpdateEffect} from '../helpers/Helpers';
import {appColors, appSecondaryColors, appTheme, fonts} from '../helpers/Theme';
import manifest from '../../app.json';
import {NetworkErrorAlert} from '../reusables/Components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const currentTimeStamp = () => {
    return Math.floor(new Date().getTime() / 1000);
};

export default function Webview({navigation, route}) {
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingVisibleTime, setLoadingVisibleTime] = useState(currentTimeStamp());
    const [hideSpinner, setHideSpinner] = useState(false);
    const webviewRef = useRef(null);
    const [toolbarTitle, setToolbarTitle] = useState(route.params?.title ?? manifest.displayName);


    useEffect(() => {
        if (isLoading) {
            setLoadingVisibleTime(currentTimeStamp());
        } else {
            setLoadingVisibleTime(currentTimeStamp());
            setHideSpinner(false);
        }
    }, [isLoading]);

    let uri = API_SITE;

    const backAction = () => {
        if (canGoBack) {
            webviewRef.current.goBack();
            return true;
        } else {
            return false;
        }
    };

    useUpdateEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', backAction);
    }, [canGoBack], () =>
        BackHandler.removeEventListener('hardwareBackPress', backAction));


    if (route.params && route.params['url']) {
        uri = route.params['url'];
    }

    let loadingSpinner = (<TouchableWithoutFeedback onPress={() => {
        if (currentTimeStamp() - loadingVisibleTime >= 10) {
            return;
        }

        setLoadingVisibleTime(0);
        setHideSpinner(true);
    }}>
        <Center flex={1} style={{
            backgroundColor: 'rgba(255,255,255,.8)',
        }} pos="absolute" top={0} left={0} bottom={0} right={0} alignContent="center" alignItems={'center'}>
            <ActivityIndicator
                color={appSecondaryColors['900']}
                size="large"
            />
        </Center>
    </TouchableWithoutFeedback>);

    if (!isLoading || hideSpinner) {
        loadingSpinner = <></>;
    }

    const handleOnMessage = function(message){
        setToolbarTitle(message.nativeEvent.title ?? manifest.displayName);
        setHideSpinner(true);
    }
    const INJECTED_JAVASCRIPT = `(function() {
    window.ReactNativeWebView.postMessage(JSON.stringify(window.title));
})();`;

    return (
        <>
            <Box safeAreaTop backgroundColor={appColors[900]} />
            <StatusBar backgroundColor={appColors[900]} barStyle="light-content" />
            <HStack bg={appColors[900]} px={1} py={3} justifyContent="space-between" alignItems="center">
                <HStack space={2} alignItems="center">
                    <IconButton icon={<Icon size="sm" as={<MaterialIcons name="arrow-forward" />} onPress={() => {
                        if (navigation.canGoBack()) {
                            navigation.goBack();
                        } else {
                            navigation.push('Home');
                        }
                    }} color="white" />} />
                    <Text fontFamily={fonts.bold} color="white" fontSize={16}>
                        {toolbarTitle}
                    </Text>
                </HStack>
                <HStack space={2}>
                    <IconButton disabled={!canGoBack} icon={<Icon as={
                        <MaterialIcons name="arrow-forward" />} size="sm" color="white" />} onPress={() => {
                        webviewRef.current.goBack();
                    }} />

                    <IconButton
                        disabled={isLoading}
                        icon={<Icon as={<MaterialIcons name="refresh" />}
                                    color="white" size="sm" />} onPress={() => {
                        webviewRef.current.reload();
                        setIsLoading(true);
                    }} />

                    <IconButton disabled={!canGoForward} onPress={() => {
                        webviewRef.current.goForward();
                    }} icon={<Icon as={
                        <MaterialIcons name="arrow-back" />} size="sm" color="white" />} />
                </HStack>
            </HStack>
            <Box flex={1}>
                <WebView
                    cacheEnabled={true}
                    ref={webviewRef}
                    onNavigationStateChange={navState => {
                        setCanGoBack(navState.canGoBack);
                        setCanGoForward(navState.canGoForward);
                        setIsLoading(navState.loading);
                    }}
                    onShouldStartLoadWithRequest={(request) => {
                        if (getUrlInfo(request.url).domain === getUrlInfo(API_SITE).domain && request.url !== '#') {
                            setIsLoading(true);
                            return true;
                        }

                        Linking.openURL(request.url)
                            .then(() => {
                                console.log('opened');
                            }).catch(() => {
                            console.log('error occurred');
                        });
                        return false;
                    }}
                    source={{uri: uri}}
                    startInLoadingState={true}
                    onLoad={() => setIsLoading(false)}
                    allowsBackForwardNavigationGestures={true}
                    injectedJavaScript={INJECTED_JAVASCRIPT}
                    onMessage={handleOnMessage}
                    pullToRefreshEnabled={true}
                    renderError={(e) => {
                        setIsLoading(false);
                        return <NetworkErrorAlert px={6} hideRefresh={true} />;
                    }}
                    originWhitelist={['*']}
                    domStorageEnabled={true}
                    userAgent={'mmaseraj-app'}
                    javaScriptEnabled={true} />
                {loadingSpinner}
            </Box>
        </>
    );
}

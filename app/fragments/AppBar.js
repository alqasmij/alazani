import React, {useEffect, useState} from 'react';
import {Box, HStack, Icon, IconButton, Input, StatusBar, Text} from 'native-base';
import manifest from '../../app.json';
import {appAltColors, appColors, appSecondaryColors, fonts, Modify} from '../helpers/Theme';
import {TouchableWithoutFeedback} from 'react-native';
import {API_SITE} from '../helpers/Api';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {BackHandler} from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import {useUpdateEffect} from "../helpers/Helpers";

export default function AppBar({navigation, previous, scene, isSplashScreen}) {
    let [isSearchBarShown, setIsSearchBarShown] = useState(false);
    let [searchKeyword, setSearchKeyword] = useState('');
    let title = manifest.displayName;
    const backAction = () => {
        if (isSearchBarShown) {
            setIsSearchBarShown(false);
            return true;
        } else {
            return false;
        }
    };

    useUpdateEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', backAction);
    }, [isSearchBarShown], () => {
        setSearchKeyword('');
        return BackHandler.removeEventListener('hardwareBackPress', backAction);
    });

    let onSubmitText = () => {
        if (searchKeyword.length === 0) {
            return;
        }

        setIsSearchBarShown(false);
        navigation.push('ProductsPage', {
            url: 'products?search=' + searchKeyword,
            title: 'نتائج البحث',
            fullTitle: 'نتائج البحث عن: ' + searchKeyword,
            type: 'search',
        });
    };

    if (scene.route && scene.route['params'] && scene.route['params']['title']) {
        title = scene.route['params']['title'];
    }

    return (
        <>
            <StatusBar backgroundColor={isSplashScreen ? "white" : appColors[900]} barStyle={isSplashScreen ? 'dark-content' : 'light-content'} />
            <HStack bg={appColors[900]} px={1} py={isSearchBarShown ? 0 : 3} justifyContent="space-between" alignItems="center">
                {isSearchBarShown ? <>
                    <HStack alignItems="center" w={'100%'} px={2} style={{
                        paddingVertical: 11,
                    }}>
                        <Input
                            size="md"
                            type="text"
                            width={'100%'}
                            bg="white"
                            borderColor={'white'}
                            fontSize={14}
                            returnKeyType={'go'}
                            autoFocus={true}
                            onChangeText={(text) => {
                                setSearchKeyword(text.replace(/^\s+|\s+$/g, ''));
                            }}
                            onSubmitEditing={onSubmitText}
                            fontFamily={fonts.regular}
                            textAlign="right"
                            _text={{
                                style: {
                                    direction: 'rtl',
                                },
                            }}
                            _android={{
                                p: 0,
                                _focus: {
                                    borderColor: 'transparent',
                                },
                            }}
                            _ios={{
                                p: 0,
                                _focus: {
                                    borderColor: 'transparent',
                                },
                            }}
                            InputLeftElement={
                                <IconButton onPress={() => {
                                    setIsSearchBarShown(false);
                                }} icon={<Icon size="sm" as={
                                    <MaterialIcons name="close" />} color={appColors['900']} />} />
                            }
                            InputRightElement={
                                <>
                                    <IconButton onPress={onSubmitText} icon={<Icon size="sm" as={
                                        <MaterialIcons name="search" />} color={appColors['900']} />} />
                                </>
                            }
                            placeholder="ادخل كلمة البحث..."
                            placeholderTextColor="brands.900"
                        />
                    </HStack>
                </> : <>
                    <HStack space={2} alignItems="center">
                        {previous ? <IconButton onPress={() => {
                                navigation.goBack();
                            }} icon={<Icon size="sm" as={<MaterialIcons name="arrow-forward" />} color="white" />} /> :
                            <></>
                        }

                        {
                            title === manifest.displayName ? <TouchableWithoutFeedback onPress={() => {
                                    navigation.push('WebView');
                                }}>
                                    <HStack space={2} justifyContent="center" alignItems="center" alignContent="center">
                                        <Text fontFamily={fonts.bold} color={Modify(appAltColors[900]).lighten(.5).string()} fontSize={18}>
                                            {title}
                                        </Text>
                                        <Box mt={2} px={2} py={1} style={{
                                            borderRadius: 8,
                                            backgroundColor: Modify(appSecondaryColors[900]).lighten(.2).fade(.5).string(),
                                        }}>
                                            <Text fontFamily={fonts.regular} lineHeight={4} color="white" fontSize={12}>
                                                {manifest.description}
                                            </Text>
                                        </Box>
                                    </HStack>
                                </TouchableWithoutFeedback> :
                                <Text fontFamily={fonts.bold} color="white" fontSize={16}>{title}</Text>
                        }
                    </HStack>
                    {previous ? <></> : <HStack space={2}>
                        <IconButton icon={<Icon as={<AntDesign name="user" />} onPress={() => {
                            navigation.push('WebView', {
                                title: 'حسابك',
                                url: API_SITE + '/login'
                            });
                        }} size="sm" color="white" />} />
                        <IconButton icon={<Icon as={
                            <MaterialIcons name="search" />} color="white" size="sm" />} onPress={() => {
                            setIsSearchBarShown(true);
                        }} />
                        <IconButton onPress={() => {
                            navigation.push('WebView');
                        }} icon={<Icon as={<FontAwesome name="globe" />} size="19px" color="white" />} />
                    </HStack>}
                </>}
            </HStack>
        </>
    );
}

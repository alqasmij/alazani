import React, {useRef, useState} from 'react';
import SplashScreen from 'react-native-splash-screen'
import {appColors, appSecondaryColors, appTheme, fonts, Modify} from "../helpers/Theme";
import {Box, Text, VStack} from "native-base";
import {ActivityIndicator, Animated, Image} from "react-native";

export default function AppLoading({isHidden = false}) {
    if (isHidden) {
        SplashScreen.hide();
        return <></>;
    }

    const opacity = useRef(new Animated.Value(0));
    Animated.loop(
        Animated.sequence([
            Animated.timing(opacity.current, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            }),
            Animated.timing(opacity.current, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true
            })
        ])
    ).start();

    return (
        <>
            <Box bg={"white"} style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 11,
                alignContent: 'stretch',
                flexDirection: 'column',
                flex: 1
            }}>
                <Box bg={"white"} style={{
                    flex: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 40,
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Image source={require('../../assets/splash-icons.png')} style={{
                        height: 100,
                        width: 300,
                        resizeMode: 'contain'
                    }} />
                    <Box mt={8} px={4} py={1} lineHeight={"20px"} bg={"rgba(0,0,0,.1)"} borderRadius={20}>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: fonts.medium
                        }}>
                            مركز العزاني التجاري للملابس الجاهزة
                        </Text>
                    </Box>
                </Box>
                <Box bg={appTheme.colors.gray["50"]} borderTopColor={appTheme.colors.gray["200"]} borderTopWidth={1} style={{
                    flex: 3,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <VStack space={10}>
                        <Animated.Text style={{
                            opacity: opacity.current,
                            fontSize: 16,
                            color: appSecondaryColors["900"],
                            textAlign: "center",
                            fontFamily: fonts.medium
                        }}>
                            يرجى الإنتظار...
                        </Animated.Text>
                        <ActivityIndicator size={"large"} color={appColors["900"]} />
                    </VStack>
                </Box>
            </Box>
        </>
    );
}

import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from "react-native";
import {Alert, Box, Button, HStack, Icon, Text, View} from "native-base";
import {appColors, appSecondaryColors, appTheme, fonts, Modify} from "../helpers/Theme";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {DelayRun, Timer, useUpdateEffect} from "../helpers/Helpers";

function SectionTitle(props) {
    let {icon, title} = props;
    return (
        <Box mt={0} mb={3} px={4} py={3} bg={appTheme.colors.gray["50"]} borderBottomWidth={1} borderTopWidth={1} borderTopColor={appTheme.colors.gray["200"]} borderBottomColor={appTheme.colors.gray["200"]} {...props}>
            <HStack space={2} align="center" alignContent="center">
                {icon ? icon({
                    color: appColors["900"]
                }) : <></>}
                <Text color={appSecondaryColors["900"]} fontFamily={fonts.bold} fontSize={14}>{title}</Text>
            </HStack>
        </Box>);
}

function SubSectionTitle(props) {
    let {title, icon} = props;
    return (<Box mt={0} px={4} py={2} mb={0} {...props}>
        <HStack space={2} style={{
            alignContent: 'center',
            alignItems: 'center',
        }}>
            <Box style={{
                height: 32,
                width: 32,
                padding: 3,
                borderRadius: 50,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                backgroundColor: Modify(appSecondaryColors["900"]).lighten(.9).fade(.8).string()
            }}>
                {icon}
            </Box>
            <Text fontFamily={fonts.medium} fontSize={14}>{title}</Text>
        </HStack>
    </Box>);
}

function ShowAlert(props) {
    let {title, message, type = "info", icon, inline} = props;
    return (
        <Alert
            status={type}
            display="flex"
            flexDirection={inline ? "row" : "column"}
            alignItems={inline ? "flex-start" : "center"}
            justifyContent="center"
            h={inline ? 'auto' : "100%"}
            w={"100%"}
            {...props}
        >
            <Icon as={icon} color={appTheme.colors.blue["500"]} size={inline ? "25px" : "xl"} mb={0} />
            {title ?
                <Alert.Title mt={2} mb={2}>
                    <Text fontFamily={fonts.bold} color={appTheme.colors.blue["500"]}>
                        {title}
                    </Text>
                </Alert.Title>
                : null
            }
            <Alert.Description>
                <Text textAlign={inline ? "left" : "center"} fontSize={14} lineHeight="20px">
                    {message}
                </Text>
            </Alert.Description>
        </Alert>
    );
}

function NetworkErrorAlert(props) {
    const [isLoading, setIsLoading] = useState(false);
    useUpdateEffect(() => {

    }, [], () => {
        setIsLoading(false);
    });
    let onPress = () => {
        console.log("nothing really!");
    };

    if (typeof props['onPress'] !== 'undefined') {
        onPress = props['onPress'];
    }

    return (
        <Alert
            status="info"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            h="100%"
            w={"100%"}
            {...props}
        >
            <Icon as={<MaterialIcons name="wifi-off" />} color="brands.900" size="xl" mb={0} />
            <Alert.Title mt={2} mb={2}>
                <Text fontFamily={fonts.bold} color="brands.900">
                    رسالة خطأ
                </Text>
            </Alert.Title>
            <Alert.Description>
                <Text textAlign="center" lineHeight="20px">
                    يبدو أن اتصالك بالانترنت غير موجود في هذه اللحظة، تأكد من ذلك ثم قم بالمحاولة لاحقًا.
                </Text>
            </Alert.Description>

            {!props['hideRefresh'] ?
                <Button size="sm" onPress={() => {
                    setIsLoading(true);
                    return DelayRun(1000).then(() => {
                        setIsLoading(false);
                        onPress();
                    });
                }} style={{
                    borderRadius: 25,
                    backgroundColor: 'rgba(255,255,255,.5)'
                }} px={12} mt={10} borderColor="gray.300" color={"gray.500"} _text={{
                    style: {
                        color: appTheme.colors.gray["500"]
                    }
                }} isLoadingText={"يرجى الإنتظار"} isLoading={isLoading} startIcon={
                    <Icon as={MaterialIcons} color="gray.500" size={5} name="refresh" />} variant={"outline"}>
                    تحديث
                </Button>
                :
                <></>
            }
        </Alert>
    );
}

function OverlayLoading({isLoaded}) {
    const color = appSecondaryColors[900];
    if (isLoaded) {
        return <></>
    }
    return (
        <Box pos="absolute" top={0} right={0} bottom={0} left={0} justifyContent="center" alignItems="center">
            <ActivityIndicator size="large" color={color} style={{opacity: .5}} />
        </Box>
    );
}

const ItemsGrid = (props) => (<View style={{
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: parseInt(appTheme.space["2"])
}}>
    {props.children}
</View>)

export {
    OverlayLoading,
    NetworkErrorAlert,
    SectionTitle,
    ShowAlert,
    SubSectionTitle,
    ItemsGrid
}

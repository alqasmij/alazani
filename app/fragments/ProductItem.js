import {Box, Center, HStack, Text, VStack} from "native-base";
import React, {useState} from "react";
import {Image, TouchableOpacity} from "react-native";
import {appColors, appSecondaryColors, appTheme, fonts, Modify} from "../helpers/Theme";
import {getCorrectImage} from "../helpers/Helpers";
import {OverlayLoading} from "../reusables/Components";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ImageLoader} from "react-native-image-fallback";

const ProductRating = React.memo(props => {
    let count = props.rating;
    let color = props.color;
    let empty = 5 - count;
    let full = count - empty;
    let result = [];

    for (let i = 1; i <= empty; i++) {
        result.push(<FontAwesome key={"empty_" + i} name="star-o" size={14} color={color} />);
    }

    for (let i = 1; i <= full; i++) {
        result.push(<FontAwesome key={"full_" + i} name="star" size={14} color={color} />);
    }

    return (
        <HStack space={1} alignItems="center" alignContent="center" justifyContent="center" minHeight={4}>
            {result}
        </HStack>
    );
})

const FeaturedStar = React.memo(props => {
    let is_featured = props['is_featured'];
    if (!is_featured) {
        return <></>
    }

    return (
        <Box position="absolute" rounded="full" bg="white" zIndex={2} top={1} p={1} w={6} h={6} right={1} opacity={.8}>
            <Center>
                <MaterialIcons name="whatshot" size={16} color={appColors["700"]} />
            </Center>
        </Box>
    );
});

const ShowPriceDiscount = React.memo(props => {
    let full = props.full;
    let discounted = props.discounted;
    if (full === discounted || !discounted) {
        return (
            <HStack space={1} alignItems={"center"} alignContent={"center"} justifyContent="center">
                <Text fontSize={14} fontFamily={fonts.bold} color={Modify(appSecondaryColors["900"]).lighten(.8).toString()}>{full}</Text>
                <Text fontSize={12} color={Modify(appSecondaryColors["900"]).lighten(.8).toString()}>{props.currency}</Text>
            </HStack>
        );
    }
    return (
        <HStack space={4} justifyContent="center">
            <Text fontSize={14} color="gray.400" strikeThrough>{full} {props.currency}</Text>
            <Text fontSize={14} fontFamily={fonts.bold} color="primary.700">{discounted} {props.currency}</Text>
        </HStack>
    )
});

const ProductItem = React.memo(({data, navigation}) => {
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const is_featured = false;
    let image_url = getCorrectImage(data['image']);
    if (!image_url) {
        image_url = require('../../assets/placeholder.jpg');
    }
    return (
        <Box style={{
            width: '50%'
        }} mt={4} px={2}>
            <Box rounded="xl" overflow="hidden" bg="white" borderWidth={1} borderColor="gray.200">
                <TouchableOpacity onPress={() => {
                    navigation.push('WebView', {
                        title: data.name,
                        url: data.link
                    });
                }}>
                    <VStack space={0}>
                        <Center position="relative">
                            <FeaturedStar is_featured={is_featured} />
                            <ImageLoader
                                source={image_url}
                                fallback={[
                                    require('../../assets/placeholder.jpg')
                                ]}
                                alt={data.name}
                                style={{
                                    width: '100%',
                                    resizeMode: 'cover',
                                    height: 150
                                }}
                                onSuccess={() => setImgLoaded(true)}
                                onError={() => setImageError(true)}
                            />

                            <OverlayLoading isLoaded={imgLoaded || imageError} />
                        </Center>

                        <VStack padding={3} space={2} borderTopWidth={1} borderTopColor={imageError ? 'white' : 'gray.200'}>
                            <Text textAlign={"center"} noOfLines={1} fontSize={13} fontFamily={fonts.bold}>
                                {data.name}
                            </Text>

                            <ProductRating rating={data.rating} color={appTheme.colors.yellow[500]} />

                            <ShowPriceDiscount full={Math.round(data.price)} currency={data.currency} discounted={0} />
                        </VStack>
                        <Box p={2} textAlign="center" mt={0} bg="gray.200" style={{
                            borderRadius: 0,
                            borderBottomLeftRadius: 4,
                            borderBottomRightRadius: 4
                        }}>
                            <Text color="gray.600" textAlign="center" fontSize={12}>
                                استعراض
                            </Text>
                        </Box>
                    </VStack>
                </TouchableOpacity>
            </Box>
        </Box>
    );
});
export default ProductItem;

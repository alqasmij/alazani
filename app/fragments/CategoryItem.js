import {Box, Center, Image, Text, VStack} from "native-base";
import React, {useEffect, useState} from "react";
import {Dimensions, TouchableOpacity} from "react-native";
import {getCorrectImage, useUpdateEffect} from "../helpers/Helpers";
import {OverlayLoading} from "../reusables/Components";
import {appTheme, fonts} from "../helpers/Theme";
import {ImageLoader} from "react-native-image-fallback";

const CategoryItem = React.memo(({data, navigation}) => {
    let [imgLoaded, setImgLoaded] = useState(false);
    let [imageError, setImageError] = useState(null);

    let image_url = getCorrectImage(data['image']);
    if (!image_url) {
        image_url = require('../../assets/placeholder.jpg');
    }

    return (
        <Box style={{
            width: '50%'
        }} mb={4} px={2}>
            <Box rounded="xl" overflow="hidden" bg="white" borderWidth={0} borderColor="gray.100" shadow={3}>
                <TouchableOpacity onPress={() => {
                    navigation.push('ProductsPage', {
                        url: data['link'],
                        title: data.name,
                        type: 'categories'
                    });
                }}>
                    <VStack space={0}>
                        <Center position="relative">

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

                            <OverlayLoading isLoaded={imgLoaded} />
                        </Center>

                        <VStack px={3} py={2} justifyContent="center" space={2} borderTopWidth={1} borderTopColor={!imageError ? 'white' : 'gray.200'}>
                            <Text noOfLines={2} fontSize={13} fontFamily={fonts.bold} textAlign="center">
                                {data.name}
                            </Text>

                        </VStack>
                    </VStack>
                </TouchableOpacity>
            </Box>
        </Box>
    );
});

export default CategoryItem;

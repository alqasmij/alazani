import {extendTheme} from 'native-base';

const appColors = {
    900: '#E55E2D',
    800: '#E55E2D',
    700: '#E55E2D',
};
const appSecondaryColors = {
    900: '#292879',
    800: '#292879',
};
const appAltColors = {
    900: '#ffef39'
};
const fonts = {
    'regular': 'Tajawal',
    'light': 'Tajawal Light',
    'medium': 'Tajawal-Medium',
    'bold': 'Tajawal-Bold',
};
const appTheme = extendTheme({
    colors: {
        brands: appColors,
    },
    fonts: {
        heading: fonts.bold,
        body: fonts.regular,
        mono: fonts.regular,
    },
    sizes: {
        1.8: '70px',
    },
    components: {
        Text: {
            fontWeight: 400,
            textAlign: "left",
            fontSize: 13
        }
    }
});

const Modify = function (colorCode) {
    let Color = require('color');
    return Color(colorCode);
};

export {
    appColors,
    fonts,
    appTheme,
    appSecondaryColors,
    appAltColors,
    Modify
};

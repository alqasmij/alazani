import {API_SITE} from "./Api";
import {URL} from 'react-native-url-polyfill';
import React from "react";
import {useFocusEffect} from "@react-navigation/native";

function getCorrectImage(image) {
    return image;
}

function isEmptyObject(object) {
    return Object.keys(object).length === 0;
}

function getUrlInfo(url) {
    const data = {};
    const obj = new URL(url);
    let hostname_split = obj.hostname.split(/\./);
    ['hash', 'host', 'hostname', 'href', 'origin', 'pathname', 'port', 'protocol'].map(key => data[key] = obj[key]);

    if (hostname_split.length > 2) {
        let subdomain = hostname_split[0];
        hostname_split.splice(0, 1);
        let domain = hostname_split.join(".")
        data['subdomain'] = subdomain;
        data['domain'] = domain;
    } else {
        data['subdomain'] = 'www';
        data['domain'] = hostname_split.join(".");
    }

    return data;
}

const useUpdateEffect = function (effect, dependencies = [], onUnmounted = () => {
}) {
    useFocusEffect(
        React.useCallback(() => {
            let isActive = true

            if (isActive) {
                effect();
            }

            return () => {
                isActive = false
                return onUnmounted();
            }
        }, dependencies)
    )
};

async function DelayRun(timeout = 0) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, timeout);
    });
}

export {
    getCorrectImage,
    isEmptyObject,
    getUrlInfo,
    useUpdateEffect,
    DelayRun
}

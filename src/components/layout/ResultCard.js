import {
    View,
    Text,
    StyleSheet,
    Animated
} from "react-native"

import { useEffect, useRef } from "react"

import { COLORS } from "../../constants/color"
import { MOEDAS } from "../../constants/moedas"

export function ResultCard({ exchangRate, result, fromMoedas, toMoedas }) {

    const opacity = useRef(new Animated.Value(0)).current
    const translateY = useRef(new Animated.Value(20)).current

    useEffect(() => {
        if (result && exchangRate) {
            opacity.setValue(0)
            translateY.setValue(20)

            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true
                })
            ]).start()
        }
    }, [result, exchangRate])

    if (!result || !exchangRate) return null

    const fromMoedaData = MOEDAS.find(m => m.code === fromMoedas)
    const toMoedaData = MOEDAS.find(m => m.code === toMoedas)

    const toSymbol = toMoedaData ? toMoedaData.symbol : ""

    return (
        <Animated.View
            style={[
                s.container,
                {
                    opacity,
                    transform: [{ translateY }]
                }
            ]}
        >
            <Text style={s.label}>Resultado:</Text>

            <Text style={s.amount}>
                {toSymbol} {result}
            </Text>

            <Text style={s.rate}>
                Taxa de Câmbio: 1 {fromMoedas} = {Number(exchangRate).toFixed(4)} {toMoedas}
            </Text>
        </Animated.View>
    )
}

const s = StyleSheet.create({
    container: {
        backgroundColor: COLORS.CARDBACKGROUND,
        borderRadius: 16,
        padding: 24,
    },
    label: {
        color: COLORS.SECONDARY,
        marginBottom: 8,
        fontSize: 18,
    },
    amount: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.TEXT,
        marginBottom: 14,
    },
    rate: {
        color: COLORS.TEXTSECONDARY,
        fontSize: 14,
    }
})
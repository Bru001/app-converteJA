import {
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";

import { COLORS } from "../../constants/color";

export function Button({ variavel = "primary", onPress, moedas, isSelected }) {

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[s.container,
            isSelected && (variavel === "primary" ? s.containerPrimary : s.containerSecondary)
            ]}>
            <Text style={s.title}>{moedas.code}</Text>
        </TouchableOpacity>
    )
}

const s = StyleSheet.create({
    container: {
        backgroundColor: COLORS.INPUTBACKGROUND,
        paddingHorizontal: 16,
        paddingVertical: 8,
        margin: 4,
        borderRadius: 10,
    },
    title: {
        color: COLORS.TEXT,
        fontWeight: "500",
    },
    containerPrimary: {
        backgroundColor: COLORS.PRIMARY,
    },
    containerSecondary: {
        backgroundColor: COLORS.SECONDARY
    }
})
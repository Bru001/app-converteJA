import { Text, View, TextInput, StyleSheet } from "react-native";
import { COLORS } from "../../constants/color";


export function Input({ value, onChangeText, label }) {
    return (
        <View style={s.container}>
            <Text style={s.label}> {label} </Text>
            <TextInput
                style={s.input}
                placeholder="0.00"
                placeholderTextColor="#94a3b8"
                value={value}
                onChangeText={onChangeText}
                keyboardType="numeric"
            />
        </View>
    )
}

const s = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        color: COLORS.TEXTSECONDARY,
        marginBottom: 8,
        fontSize: 14,
    },
    input: {
        backgroundColor: COLORS.INPUTBACKGROUND,
        color: COLORS.TEXT,
        fontSize: 24,
        fontWeight: "bold",
        padding: 15,
        borderRadius: 9
    }
})
import { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Platform,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Modal
} from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'

// components
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { ResultCard } from '../components/layout/ResultCard'

// constants
import { COLORS } from "../constants/color"
import { MOEDAS } from "../constants/moedas"

// services
import { exchangeRateApi } from '../services/Api'
import { convertMoedas } from '../util/convertMoedas'

export default function Home() {

    const [amount, setAmount] = useState('')
    const [fromMoedas, setFromMoedas] = useState('BRL')
    const [toMoedas, setToMoedas] = useState('USD')
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)
    const [exchangRate, setExchangRate] = useState(null)

    const [helpVisible, setHelpVisible] = useState(false)

    async function fetchExchangeRate() {
        if (!amount) return

        try {
            setLoading(true)

            const data = await exchangeRateApi(fromMoedas)
            const rate = data.rates[toMoedas]

            setExchangRate(rate)

            const numericValue = Number(
                amount.replace(/\./g, '').replace(',', '.')
            )

            const convertedAmount = convertMoedas(numericValue, rate)
            setResult(convertedAmount)

        } catch (error) {
            alert("Erro, tente novamente!")
        } finally {
            setLoading(false)
        }
    }

    function swapMoedas() {
        setFromMoedas(toMoedas)
        setToMoedas(fromMoedas)
        setResult("")
    }

    return (
        <SafeAreaView style={s.container}>
            <StatusBar style="light" />

            <ScrollView style={s.scrollView}>
                <View style={s.content}>

                    {/* HEADER */}
                    <View style={s.header}>
                        <View style={s.headerTop}>
                            <Text style={s.title}>Conversor de Moedas</Text>

                            <TouchableOpacity onPress={() => setHelpVisible(true)}>
                                <MaterialCommunityIcons
                                    name="help-circle-outline"
                                    size={28}
                                    color={COLORS.TEXTSECONDARY}
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={s.subTitle}>
                            Converta valores entre diferentes moedas
                        </Text>
                    </View>

                    {/* CARD */}
                    <View style={s.card}>

                        <Text style={s.label}>De:</Text>

                        <View style={s.moedasCard}>
                            {MOEDAS.map(moedas => (
                                <Button
                                    key={moedas.code}
                                    variavel="primary"
                                    moedas={moedas}
                                    onPress={() => setFromMoedas(moedas.code)}
                                    isSelected={fromMoedas === moedas.code}
                                />
                            ))}
                        </View>

                        <Input
                            label="Qual o Valor:"
                            value={amount}
                            keyboardType="numeric"
                            onChangeText={(text) => {
                                const onlyNumbers = text.replace(/\D/g, '')

                                const formatted = (
                                    Number(onlyNumbers) / 100
                                ).toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })

                                setAmount(formatted)
                            }}
                        />

                        <TouchableOpacity
                            style={s.convertorButton}
                            onPress={swapMoedas}
                        >
                            <MaterialCommunityIcons
                                name="swap-vertical"
                                size={30}
                                color="white"
                            />
                        </TouchableOpacity>

                        <Text style={s.label}>Para:</Text>

                        <View style={s.moedasCard}>
                            {MOEDAS.map(moedas => (
                                <Button
                                    key={moedas.code}
                                    variavel="secondary"
                                    moedas={moedas}
                                    onPress={() => setToMoedas(moedas.code)}
                                    isSelected={toMoedas === moedas.code}
                                />
                            ))}
                        </View>
                    </View>

                    {/* BOTÃO */}
                    <TouchableOpacity
                        style={[
                            s.convertorButton1,
                            (!amount || loading) && s.convertorButtonDesativado
                        ]}
                        onPress={fetchExchangeRate}
                        disabled={!amount || loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={s.convertorButtonTitle}>
                                Converter
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* RESULTADO */}
                    <ResultCard
                        exchangRate={exchangRate}
                        result={result}
                        fromMoedas={fromMoedas}
                        toMoedas={toMoedas}
                    />

                </View>
            </ScrollView>

            {/* MODAL AJUDA */}
            <Modal
                visible={helpVisible}
                transparent
                animationType="fade"
            >
                <View style={s.overlay}>
                    <View style={s.modalBox}>

                        <Text style={s.modalTitle}>
                            Como usar o conversor
                        </Text>

                        <Text style={s.modalText}>• De = moeda de origem</Text>
                        <Text style={s.modalText}>• Para = moeda de destino</Text>
                        <Text style={s.modalText}>• O botão troca as moedas</Text>
                        <Text style={s.modalText}>• Digite o valor e converta</Text>

                        <Text style={[s.modalTitle, { marginTop: 16 }]}>
                            Moedas
                        </Text>

                        {MOEDAS.map(item => (
                            <Text key={item.code} style={s.modalText}>
                                {item.code} = {item.name} ({item.symbol})
                            </Text>
                        ))}

                        <TouchableOpacity
                            style={s.closeButton}
                            onPress={() => setHelpVisible(false)}
                        >
                            <Text style={s.closeText}>Fechar</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    )
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },

    scrollView: {
        flexGrow: 1,
    },

    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 44,
        paddingBottom: 24,
    },

    header: {
        marginBottom: 32,
    },

    headerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },

    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: COLORS.TEXTSECONDARY,
    },

    subTitle: {
        color: COLORS.TEXTSECONDARY,
        fontSize: 16,
    },

    card: {
        backgroundColor: COLORS.CARDBACKGROUND,
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
    },

    label: {
        color: COLORS.TEXTSECONDARY,
        marginBottom: 8,
        fontSize: 16,
    },

    moedasCard: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: -4,
        marginBottom: 12,
        alignItems: "center",
        justifyContent: "center"
    },

    convertorButton: {
        backgroundColor: COLORS.INPUTBACKGROUND,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginBottom: 24,
        alignItems: "center"
    },

    convertorButtonTitle: {
        textAlign: "center",
        fontSize: 20,
        color: COLORS.TEXT
    },

    convertorButton1: {
        backgroundColor: COLORS.SECONDARY,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginBottom: 24,
    },

    convertorButtonDesativado: {
        backgroundColor: COLORS.INPUTBACKGROUND,
    },

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.65)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },

    modalBox: {
        width: "100%",
        backgroundColor: COLORS.CARDBACKGROUND,
        borderRadius: 18,
        padding: 24,
    },

    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: COLORS.TEXT,
        marginBottom: 18,
    },

    modalText: {
        color: COLORS.TEXTSECONDARY,
        fontSize: 16,
        marginBottom: 10,
        lineHeight: 22,
    },

    closeButton: {
        marginTop: 18,
        backgroundColor: COLORS.SECONDARY,
        paddingVertical: 14,
        borderRadius: 12,
    },

    closeText: {
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },

})
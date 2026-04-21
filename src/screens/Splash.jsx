import { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated, Easing } from 'react-native'
import { COLORS } from '../constants/color'
import { SafeAreaView } from "react-native-safe-area-context"
import Logo from "../assets/svg/Logo"

export default function Splash({ navigation }) {
    const fadeAnim = useRef(new Animated.Value(0)).current
    const scaleAnim = useRef(new Animated.Value(0.8)).current
    const loaderWidth = useRef(new Animated.Value(0)).current
    
    // Animações do título e subtítulo
    const titleTranslateX = useRef(new Animated.Value(-50)).current
    const titleOpacity = useRef(new Animated.Value(0)).current
    const subtitleTranslateY = useRef(new Animated.Value(20)).current
    const subtitleOpacity = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.parallel([
            // Animação do logo
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease)
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true
            }),
            
            // Animação do título (vem da esquerda)
            Animated.parallel([
                Animated.timing(titleTranslateX, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.ease)
                }),
                Animated.timing(titleOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true
                })
            ]),
            
            // Animação do subtítulo (depois do título)
            Animated.sequence([
                Animated.delay(500),
                Animated.parallel([
                    Animated.timing(subtitleTranslateY, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                        easing: Easing.out(Easing.ease)
                    }),
                    Animated.timing(subtitleOpacity, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true
                    })
                ])
            ]),
            
            // ← LOADING (barra enchendo)
            Animated.timing(loaderWidth, {
                toValue: 100,
                duration: 4500,
                easing: Easing.linear,
                useNativeDriver: false
            })
        ]).start()

        const timer = setTimeout(() => {
            navigation.replace('Home')
        }, 4500)

        return () => clearTimeout(timer)
    }, [])

    const widthInterpolate = loaderWidth.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%']
    })

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    <Animated.View
                        style={[
                            styles.logoContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: scaleAnim }]
                            }
                        ]}
                    >
                        <Logo width={180} height={180} />
                    </Animated.View>

                    {/* Título animado */}
                    <Animated.View
                        style={[
                            styles.titleContainer,
                            {
                                opacity: titleOpacity,
                                transform: [{ translateX: titleTranslateX }]
                            }
                        ]}
                    >
                        <Text style={styles.title}>Coverte JÁ</Text>
                    </Animated.View>

                    {/* Subtítulo animado */}
                    <Animated.View
                        style={[
                            styles.subtitleContainer,
                            {
                                opacity: subtitleOpacity,
                                transform: [{ translateY: subtitleTranslateY }]
                            }
                        ]}
                    >
                        <Text style={styles.subtitle}>
                            Conversão inteligente{'\n'}e instantânea
                        </Text>
                    </Animated.View>

                    <Animated.View style={styles.footer}>
                        <View style={styles.loaderContainer}>
                            <Animated.View 
                                style={[
                                    styles.loader, 
                                    { width: widthInterpolate }
                                ]} 
                            />
                        </View>
                        <Text style={styles.version}>Versão 1.0.2</Text>
                    </Animated.View>
                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logoContainer: {
        marginBottom: 24,
    },
    titleContainer: {
        marginBottom: 8,
    },
    title: {
        fontSize: 36,
        fontWeight: '700',
        textAlign: 'center',
        color: '#FFFFFF',
        letterSpacing: 1.5,
    },
    subtitleContainer: {
        marginTop: 0,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#FFFFFF',
        opacity: 0.8,
        lineHeight: 24,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        right: 20,
        alignItems: 'flex-end',
    },
    loaderContainer: {
        width: 80,
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 1.5,
        overflow: 'hidden',
        marginBottom: 8,
    },
    loader: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 1.5,
    },
    version: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
    },
})
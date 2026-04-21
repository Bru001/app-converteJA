export function convertMoedas(amount, rate) {
    return (parseFloat(amount) * rate).toFixed(2)
}
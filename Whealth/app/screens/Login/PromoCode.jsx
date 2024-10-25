import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

export const PromoCodeScreen = ({ onApplyPromoCode }) => {
    const [promoCode, setPromoCode] = useState('');

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Promo Code"
                value={promoCode}
                onChangeText={setPromoCode}
                style={styles.input}
            />
            <Button
                title="Apply Promo Code"
                onPress={() => onApplyPromoCode(promoCode)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    input: {
        width: '100%',
        margin: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
    }
});
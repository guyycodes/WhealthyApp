import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';

export const PasswordRecoveryScreen = ({ onRecover }) => {
    const [email, setEmail] = useState('');

    return (
        <View style={styles.container}>
            <Text>Please enter your email address to receive a password reset link.</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <Button
                title="Send Reset Link"
                onPress={() => onRecover(email)}
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
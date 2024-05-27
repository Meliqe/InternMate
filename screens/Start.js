import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function Start({ navigation }) {
    const handleCorporateLoginPress = () => {
        navigation.navigate('KurumsalGiris'); // Kurumsal giriş sayfasına yönlendirme
    };

    const handleUserLoginPress = () => {
        navigation.navigate('KullaniciGiris'); // Kullanıcı giriş sayfasına yönlendirme
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Image style={{ width: 400, height: 400 }} source={require('../assets/logo.png')} />
                <TouchableOpacity style={styles.box} onPress={handleCorporateLoginPress}>
                    <Text style={styles.boxText}>Kurumsal Giriş</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.box} onPress={handleUserLoginPress}>
                    <Text style={styles.boxText}>Kullanıcı Girişi</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    logo: {
        width: 200, // uygun bir genişlik ayarlayın
        height: 200, // uygun bir yükseklik ayarlayın
        resizeMode: 'contain', // görüntünün boyutunu korumak için
        marginBottom: 20,
    },
    box: {
        width: 250,
        height: 75,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 10,
        backgroundColor: '#bcd6ff',
    },
    boxText: {
        color: '#fafafa',
        fontSize: 18,
    },
});

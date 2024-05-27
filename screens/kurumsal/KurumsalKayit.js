import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, Image, Alert } from 'react-native';
import { auth, firestore } from '../../config/firebase';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons'; // İkon için
import Icon from 'react-native-vector-icons/Ionicons';

export default function KurumsalKayit({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Hata', 'Şifreler uyuşmuyor!');
            return;
        }

        try {
            // Firebase Authentication kullanarak e-postanın daha önce kullanılıp kullanılmadığını kontrol et
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            if (signInMethods.length > 0) {
                Alert.alert('Hata', 'Bu e-posta ile kayıtlı bir kullanıcı zaten var!');
                return;
            }

            // Yeni kullanıcı oluştur
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Firestore'a kullanıcı bilgilerini kaydet
            await setDoc(doc(firestore, 'users', user.uid), {
                email: email,
                profileCompleted: false
            });

            Alert.alert('Başarılı', 'Kullanıcı başarıyla kaydedildi!');
            navigation.navigate('ProfilDoldurmaSayfasi');
        } catch (error) {
            Alert.alert('Hata', error.message);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={30} color="#bcd6ff" />
                </TouchableOpacity>
                <Image style={styles.logo} source={require('../../assets/kayit.png')} />
                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    placeholderTextColor="#757575"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Şifre"
                        placeholderTextColor="#757575"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!passwordVisible}
                    />
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setPasswordVisible(!passwordVisible)}
                    >
                        <Ionicons name={passwordVisible ? "eye" : "eye-off"} size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Şifreyi Doğrulayın"
                        placeholderTextColor="#757575"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!confirmPasswordVisible}
                    />
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    >
                        <Ionicons name={confirmPasswordVisible ? "eye" : "eye-off"} size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Kayıt Ol</Text>
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
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    backButton: {
        position: 'absolute',
        top: 30,
        left: 10,
        paddingLeft: 10
    },
    logo: {
        width: 300,
        height: 300,
        marginTop: 60,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#bdbdbd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 50,
        borderColor: '#bdbdbd',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingRight: 10,
    },
    passwordInput: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 10,
    },
    eyeIcon: {
        padding: 10,
    },
    registerButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#bcd6ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fafafa',
        fontSize: 18,
    },
});

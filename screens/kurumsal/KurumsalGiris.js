import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, Image, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { auth, firestore } from '../../config/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, fetchSignInMethodsForEmail } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons'; // İkon için
import Icon from 'react-native-vector-icons/Ionicons';

export default function KurumsalGiris({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false); // Şifre görünürlüğü state'i

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                checkUserProfile();
            }
        });

        return () => unsubscribe();
    }, []);

    useFocusEffect(
        useCallback(() => {
            // Bileşen her odaklandığında email ve password state'lerini sıfırla
            setEmail('');
            setPassword('');
        }, [])
    );

    const checkUserProfile = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                const userDocRef = doc(firestore, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists() && userDoc.data().profileCompleted) {
                    navigation.navigate('KurumsalAnasayfa');
                } else {
                    navigation.navigate('ProfilDoldurmaSayfasi');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleLogin = async () => {
        try {
            // Giriş yap
            await signInWithEmailAndPassword(auth, email, password);
            Alert.alert("Giriş Başarılı", "Başarıyla giriş yaptınız");
            checkUserProfile();
        } catch (error) {
            let errorMessage = "Bir hata oluştu";
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = "Kullanıcı bulunamadı veya şifre hatalı";
            } else {
                errorMessage = error.message;
            }
            Alert.alert("Giriş Hatası", errorMessage);
        }
    };


    const handleRegisterPress = () => {
        navigation.navigate('KurumsalKayit');
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={30} color="#bcd6ff" />
                </TouchableOpacity>
                <Image style={styles.logo} source={require('../../assets/giris.png')} />
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
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Giriş Yap</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRegisterPress}>
                    <Text style={styles.registerText}>Hesabınız yok mu? Kayıt olun</Text>
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
    logo: {
        width: 300,
        height: 300,
        marginTop: 20,
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
        paddingRight: 10, // İkona yer açmak için sağ tarafa padding ekleyin
    },
    passwordInput: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 10,
    },
    eyeIcon: {
        padding: 10,
    },
    loginButton: {
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
    registerText: {
        color: '#757575',
        fontSize: 16,
    },
    backButton: {
        position: 'absolute',
        top: 30,
        left: 10,
        paddingLeft: 10
    },
});

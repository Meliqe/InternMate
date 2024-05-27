import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { auth } from '../../config/firebase';

const KurumsalAnasayfa = ({ navigation }) => {
    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                navigation.navigate('KurumsalGiris');
            })
            .catch(error => {
                console.error('Error signing out: ', error);
            });
    };

    const handlePostAd = () => {
        navigation.navigate('IlanOlusturmaSayfasi');
    };

    const handleViewAds = () => {
        navigation.navigate('VerilenIlanlar');
    };

    const handleViewApplications = () => {
        navigation.navigate('GelenBasvurular');
    };

    const handleViewProfile = () => {
        navigation.navigate('KurumsalProfilSayfasi');
    };

    return (
        <View style={styles.container}>
            <View style={styles.navbar}>
                <View style={styles.logoContainer}>
                    <Image source={require('../../assets/logo.png')} style={styles.logo} />
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.backbuttonText}>Çıkış Yap</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.button} onPress={handleViewProfile}>
                        <Text style={styles.buttonText}>Profil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handlePostAd}>
                        <Text style={styles.buttonText}>İlan Ver</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.button} onPress={handleViewAds}>
                        <Text style={styles.buttonText}>İlanları Görüntüle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleViewApplications}>
                        <Text style={styles.buttonText}>Başvuruları Görüntüle</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 25,
        backgroundColor: '#bcd6ff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    logoContainer: {
        marginTop: 20, // Logo ile üst kısma boşluk eklemek için
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 10,
    },
    logoutButton: {
        paddingVertical: 10,
        alignSelf: 'flex-end',
        borderWidth: 1, // Kenarlık kalınlığı
        borderColor: '#fafafa', // Kenarlık rengi
        borderRadius: 10,
        paddingVertical: 7, // Dikey iç boşluk
        paddingHorizontal: 7, // Yatay iç boşluk
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    button: {
        width: 150,
        height: 120,
        backgroundColor: '#bcd6ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 20,
        marginRight: 10,
    },
    buttonText: {
        color: '#fafafa',
        fontSize: 18,
    },
    backbuttonText: {
        color: '#fafafa',
        fontSize: 18,
    }
});

export default KurumsalAnasayfa;

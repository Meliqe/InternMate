import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { auth, firestore } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

const KurumsalProfilSayfasi = ({ navigation }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    setUserData(userDocSnap.data());
                }
            } catch (error) {
                console.error('Error fetching user data: ', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={30} color="#bcd6ff" />
                </TouchableOpacity>
                <View style={styles.imageContainer}>
                    <Image source={require('../../assets/profile.png')} style={styles.profileImage} />
                </View>
                <View style={styles.userInfoContainer}>
                    {userData && (
                        <View style={styles.userInfo}>
                            <View style={styles.infoBox}>
                                <Text style={styles.label}>Şirket Adı:</Text>
                                <Text style={styles.value}>{userData.companyName}</Text>
                            </View>

                            <View style={styles.infoBox}>
                                <Text style={styles.label}>Şirket Email:</Text>
                                <Text style={styles.value}>{userData.companyEmail}</Text>
                            </View>

                            <View style={styles.infoBox}>
                                <Text style={styles.label}>Şirket Telefon:</Text>
                                <Text style={styles.value}>{userData.companyPhone}</Text>
                            </View>

                            <View style={styles.infoBox}>
                                <Text style={styles.label}>Açıklama:</Text>
                                <Text style={styles.value}>{userData.description}</Text>
                            </View>

                            <View style={styles.infoBox}>
                                <Text style={styles.label}>Temsilci Adı:</Text>
                                <Text style={styles.value}>{userData.representativeName}</Text>
                            </View>

                            <View style={styles.infoBox}>
                                <Text style={styles.label}>Temsilci Soyadı:</Text>
                                <Text style={styles.value}>{userData.representativeSurname}</Text>
                            </View>

                            <TouchableOpacity style={styles.updateProfileButton}>
                                <Text style={styles.buttonText} onPress={() => navigation.navigate('KurumsalProfilGuncelleme')} >Profilimi Güncelle</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    userInfoContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,// Resmin alt boşluğunu artırdık
        marginTop: 70
    },
    profileImage: {
        width: 350, // Resmin boyutunu küçülttük
        height: 350,
        borderRadius: 100, // Daire şeklinde olması için borderRadius'ü yarıya indirdik
    },
    userInfo: {
        width: '100%',
        alignItems: 'center',
    },
    infoBox: {
        width: '100%',
        marginBottom: 15,
        backgroundColor: '#fafafa',
        padding: 10,
        borderRadius: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
    },
    updateProfileButton: {
        marginTop: 20,
        backgroundColor: '#bcd6ff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    backButton: {
        position: 'absolute',
        top: 30,
        paddingLeft: 5
    },
});

export default KurumsalProfilSayfasi;

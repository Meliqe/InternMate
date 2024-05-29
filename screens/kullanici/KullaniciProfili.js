import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { auth, firestore } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Icon from 'react-native-vector-icons/Ionicons';

const KullaniciProfili = ({ navigation }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDocRef = doc(firestore, 'users2', auth.currentUser.uid);
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

    const handleCVDownload = async () => {
        try {
            if (userData && userData.cvFile) {
                const downloadResumable = FileSystem.createDownloadResumable(
                    userData.cvFile,
                    FileSystem.documentDirectory + 'cvFile.doc',
                    {},
                    downloadProgress => {
                        console.log(`Progress: ${(downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100}%`);
                    }
                );

                const { uri } = await downloadResumable.downloadAsync();
                console.log('Finished downloading to ', uri);

                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(uri);
                } else {
                    Alert.alert('Paylaşma özelliği desteklenmiyor');
                }
            } else {
                Alert.alert('Hata', 'CV dosyası bulunamadı.');
            }
        } catch (error) {
            console.error('Error downloading CV: ', error);
            Alert.alert('Hata', 'CV dosyası indirilirken bir hata oluştu.');
        }
    };

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
                                <Text style={styles.label}>İsim</Text>
                                <Text style={styles.value}>{userData.name}</Text>
                            </View>

                            <View style={styles.infoBox}>
                                <Text style={styles.label}>Soyisim</Text>
                                <Text style={styles.value}>{userData.surname}</Text>
                            </View>

                            <View style={styles.infoBox}>
                                <Text style={styles.label}>Okul</Text>
                                <Text style={styles.value}>{userData.school}</Text>
                            </View>

                            <View style={styles.infoBox}>
                                <Text style={styles.label}>Sınıf</Text>
                                <Text style={styles.value}>{userData.grade}</Text>
                            </View>

                            <View style={styles.infoBox}>
                                <Text style={styles.label}>Telefon</Text>
                                <Text style={styles.value}>{userData.phone}</Text>
                            </View>

                            <View style={styles.infoBox}>
                                <Text style={styles.label}>Hakkımda</Text>
                                <Text style={styles.value}>{userData.introduction}</Text>
                            </View>

                            <View style={styles.infoBox}>
                                <Text style={styles.label}>CV</Text>
                                <TouchableOpacity style={styles.cvDownloadButton} onPress={handleCVDownload}>
                                    <Icon name="document" size={24} color="#fff" />
                                    <Text style={styles.cvDownloadText}>CV İndir</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.updateProfileButton} onPress={() => navigation.navigate('KullaniciProfilGuncelle')}>
                                <Text style={styles.buttonText}>Profilimi Güncelle</Text>
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
        marginBottom: 20,
        marginTop: 70,
    },
    profileImage: {
        width: 350,
        height: 350,
        borderRadius: 100,
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
        paddingLeft: 5,
    },
    cvDownloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#bcd6ff',
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
    },
    cvDownloadText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 5,
    },
});


export default KullaniciProfili;

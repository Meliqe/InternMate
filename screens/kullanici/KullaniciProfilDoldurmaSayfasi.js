import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, Image, ScrollView } from 'react-native';
import { auth, firestore } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import * as DocumentPicker from 'expo-document-picker'; // CV yükleme için
import { Ionicons } from '@expo/vector-icons'; // İkon için

export default function ProfilDoldurmaSayfasi({ navigation }) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState('');
    const [grade, setGrade] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [cvFile, setCvFile] = useState(null);
    const [certificates, setCertificates] = useState([]);
    const [school, setSchool] = useState('');

    const handleSaveProfile = async () => {
        try {
            // Profil verilerini Firestore'a kaydet
            const currentUser = auth.currentUser;
            if (currentUser) {
                await setDoc(doc(firestore, 'users2', currentUser.uid), {
                    name,
                    surname,
                    phone,
                    grade,
                    school,
                    introduction,
                    cvFile,
                    certificates,
                    profileCompleted: true
                });

                Alert.alert('Başarılı', 'Profil başarıyla oluşturuldu!');
                // İstediğiniz yere yönlendirme yapabilirsiniz
                navigation.navigate('KullaniciAnasayfa');
            } else {
                Alert.alert('Hata', 'Kullanıcı oturumu bulunamadı!');
            }
        } catch (error) {
            Alert.alert('Hata', error.message);
        }
    };

    const handleSelectCertificates = async () => {
        try {
            const res = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.doc], // Sadece pdf ve doc dosyalarını seç
            });

            const selectedFiles = res.map(file => ({
                name: file.name,
                uri: file.uri,
                type: file.type,
                size: file.size,
            }));

            setCertificates(selectedFiles);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // Kullanıcı dosya seçme işleminden vazgeçti
            } else {
                // Hata meydana geldi
                console.log(err);
            }
        }
    };

    const handleSelectCV = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/msword', // Sadece DOC dosyalarını seç
            });

            if (result.type === 'success') {
                setCvFile(result.uri);
            }
        } catch (error) {
            console.log('CV yükleme hatası:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Image style={styles.logo} source={require('../../assets/giris.png')} />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="İsim"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Soyisim"
                        value={surname}
                        onChangeText={setSurname}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Telefon"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Okul"
                        value={school}
                        onChangeText={setSchool}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Sınıf"
                        value={grade}
                        onChangeText={setGrade}
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Ön Yazı"
                        value={introduction}
                        onChangeText={setIntroduction}
                        multiline
                    />
                    <TouchableOpacity style={styles.uploadButton} onPress={handleSelectCertificates}>
                        <Ionicons name="document-attach-outline" size={24} color="#fafafa" />
                        <Text style={styles.uploadText}>Sertifika Seç</Text>
                    </TouchableOpacity>
                    {certificates.map((certificate, index) => (
                        <View key={index} style={styles.certificateItem}>
                            <Text>{certificate.name}</Text>
                        </View>
                    ))}
                    <TouchableOpacity style={styles.uploadButton} onPress={handleSelectCV}>
                        <Ionicons name="document-attach-outline" size={24} color="#fafafa" />
                        <Text style={styles.uploadText}>CV Yükle</Text>
                    </TouchableOpacity>
                    {cvFile && (
                        <View style={styles.cvItem}>
                            <Text>{cvFile}</Text>
                        </View>
                    )}
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                        <Text style={styles.saveButtonText}>Profil Oluştur</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    uploadButton: {
        backgroundColor: '#bcd6ff',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    uploadText: {
        fontSize: 16,
        color: '#fafafa'
    },
    certificateItem: {
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 5,
    },
    saveButton: {
        backgroundColor: '#bcd6ff',
        borderRadius: 5,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    cvItem: {
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10,
    },
    logo: {
        width: 300,
        height: 300,
        marginTop: 50,
        marginBottom: 20,
    },
});

import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import { auth, firestore } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../../config/firebase'; // Firebase Storage'ı içeri aktarın

export default function ProfilGuncelle({ navigation }) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState('');
    const [grade, setGrade] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [cvFile, setCvFile] = useState(null); // CV dosyasının URI'sini saklamak için state ekleyin
    const [school, setSchool] = useState('');

    const [uploadProgress, setUploadProgress] = useState(0);

    const handleSaveProfile = async () => {
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const cvUrl = await uploadCV(cvFile); // CV dosyasını yükle

                await setDoc(doc(firestore, 'users2', currentUser.uid), {
                    name,
                    surname,
                    phone,
                    grade,
                    school,
                    introduction,
                    cvFile: cvUrl, // CV dosyasının URL'sini Firestore'a kaydedin
                });

                Alert.alert('Başarılı', 'Profil başarıyla güncellendi!');
                navigation.goBack();
            } else {
                Alert.alert('Hata', 'Kullanıcı oturumu bulunamadı!');
            }
        } catch (error) {
            Alert.alert('Hata', error.message);
        }
    };

    const handleSelectCV = async () => {
        try {
            const file = await DocumentPicker.getDocumentAsync({
                type: 'application/msword', // CV dosyasının sadece PDF formatında olmasını sağlayın
            });
            const uri = file.uri;
            setCvFile(uri); // CV dosyasının URI'sini saklayın
        } catch (err) {
            console.log(err);
        }
    };

    const uploadCV = async (fileUri) => {
        try {
            if (!fileUri) return null;

            const fileName = fileUri.split('/').pop();
            const response = await fetch(fileUri);
            const blob = await response.blob();

            const storageRef = ref(storage, 'documents/' + fileName);
            const uploadTask = uploadBytesResumable(storageRef, blob);

            uploadTask.on('state_changed', snapshot => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            });

            await uploadTask;

            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        } catch (error) {
            console.log(error);
            Alert.alert('Hata', 'Belge yüklenirken bir hata oluştu.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
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
                        <Text style={styles.saveButtonText}>Profil Güncelle</Text>
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
        backgroundColor: '#bcd6ff',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10,
    },
});

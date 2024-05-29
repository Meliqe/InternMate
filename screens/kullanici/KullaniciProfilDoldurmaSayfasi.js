import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, Image, ScrollView } from 'react-native';
import { auth, firestore } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadFile, uploadBytesResumable } from 'firebase/storage';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '../../config/firebase'; // Firebase Storage'ı içeri aktarın


export default function ProfilDoldurmaSayfasi({ navigation }) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState('');
    const [grade, setGrade] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [cvFile, setCvFile] = useState(null);
    const [certificates, setCertificates] = useState([]);
    const [school, setSchool] = useState('');

    const [uploadProgress, setUploadProgress] = useState(0);


    const handleSaveProfile = async () => {
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const cvUrl = await uploadCV(cvFile); // CV dosyasını yükle
                //console.log(cvFile);

                if (cvFile) {
                    await setDoc(doc(firestore, 'users2', currentUser.uid), {
                        name,
                        surname,
                        phone,
                        grade,
                        school,
                        introduction,
                        cvFile: cvUrl, // CV dosyasının URL'sini Firestore'a kaydedin
                        certificates,
                        profileCompleted: true
                    });

                    Alert.alert('Başarılı', 'Profil başarıyla oluşturuldu!');
                    navigation.navigate('KullaniciAnasayfa');
                } else {
                    Alert.alert('Hata', 'CV dosyasını yüklerken bir hata oluştu!');
                }
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
            const uri = file.assets[0].uri;
            setCvFile(uri); // CV dosyasının URI'sini saklayın
            //console.log(file.assets[0].uri);
        } catch (err) {
            console.log(err);
        }
    };

    const uploadCV = async (fileUri) => {
        try {
            if (!fileUri) return null;

            const fileName = fileUri.split('/').pop();
            console.log(fileUri);
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
            //console.log('downloadURL: ', downloadURL);
            return downloadURL;

        } catch (error) {
            console.log(error);
            Alert.alert('Hata', 'Belge yüklenirken bir hata oluştu.');
        }
    };

    const handleSelectCertificates = async () => {
        try {
            const res = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.doc],
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
    logo: {
        width: 300,
        height: 300,
        marginTop: 50,
        marginBottom: 20,
    },
});



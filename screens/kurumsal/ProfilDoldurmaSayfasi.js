import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { auth, firestore } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

const ProfilDoldurmaSayfasi = ({ navigation }) => {
    const [companyName, setCompanyName] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [companyPhone, setCompanyPhone] = useState('');
    const [description, setDescription] = useState('');
    const [representativeName, setRepresentativeName] = useState('');
    const [representativeSurname, setRepresentativeSurname] = useState('');

    const handleSaveProfile = async () => {
        try {
            const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
            await setDoc(userDocRef, {
                companyName,
                companyEmail,
                companyPhone,
                description,
                representativeName,
                representativeSurname,
                profileCompleted: true // Profil tamamlandı olarak işaretlenir
            });

            Alert.alert("Başarılı", "Profil başarıyla kaydedildi");
            navigation.navigate('KurumsalAnasayfa');
        } catch (error) {
            Alert.alert("Hata", "Profil kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
            console.error("Profil kaydedilirken hata:", error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Şirket Adı"
                value={companyName}
                onChangeText={setCompanyName}
            />
            <TextInput
                style={styles.input}
                placeholder="Şirket Maili"
                value={companyEmail}
                onChangeText={setCompanyEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Şirket Telefon"
                value={companyPhone}
                onChangeText={setCompanyPhone}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="Açıklama"
                value={description}
                onChangeText={setDescription}
                multiline
            />
            <TextInput
                style={styles.input}
                placeholder="Temsilci Adı"
                value={representativeName}
                onChangeText={setRepresentativeName}
            />
            <TextInput
                style={styles.input}
                placeholder="Temsilci Soyadı"
                value={representativeSurname}
                onChangeText={setRepresentativeSurname}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Text style={styles.buttonText}>Profilimi Kaydet</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
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
    saveButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#bcd6ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: '#fafafa',
        fontSize: 18,
    },
});

export default ProfilDoldurmaSayfasi;

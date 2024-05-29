import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { auth, firestore } from '../../config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const KurumsalProfilGuncelleme = () => {
    const [companyName, setCompanyName] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [companyPhone, setCompanyPhone] = useState('');
    const [description, setDescription] = useState('');
    const [representativeName, setRepresentativeName] = useState('');
    const [representativeSurname, setRepresentativeSurname] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setCompanyName(userData.companyName);
                    setCompanyEmail(userData.companyEmail);
                    setCompanyPhone(userData.companyPhone);
                    setDescription(userData.description);
                    setRepresentativeName(userData.representativeName);
                    setRepresentativeSurname(userData.representativeSurname);
                }
            } catch (error) {
                console.error('Error fetching user data: ', error);
            }
        };

        fetchUserData();
    }, []);

    const handleUpdateProfile = async () => {
        try {
            const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
            await updateDoc(userDocRef, {
                companyName: companyName,
                companyEmail: companyEmail,
                companyPhone: companyPhone,
                description: description,
                representativeName: representativeName,
                representativeSurname: representativeSurname
            });
            Alert.alert('Profil güncelleme başarılı', 'Profil bilgileriniz güncellendi.');
        } catch (error) {
            console.error('Error updating user profile: ', error);
            Alert.alert('Hata', 'Profil güncelleme sırasında bir hata oluştu.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Profil Güncelleme</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Şirket Adı:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Şirket Adı"
                    value={companyName}
                    onChangeText={text => setCompanyName(text)}
                />

                <Text style={styles.label}>Şirket Email:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Şirket Email"
                    value={companyEmail}
                    onChangeText={text => setCompanyEmail(text)}
                />

                <Text style={styles.label}>Şirket Telefon:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Şirket Telefon"
                    value={companyPhone}
                    onChangeText={text => setCompanyPhone(text)}
                />

                <Text style={styles.label}>Açıklama:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Açıklama"
                    value={description}
                    onChangeText={text => setDescription(text)}
                />

                <Text style={styles.label}>Temsilci Adı:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Temsilci Adı"
                    value={representativeName}
                    onChangeText={text => setRepresentativeName(text)}
                />

                <Text style={styles.label}>Temsilci Soyadı:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Temsilci Soyadı"
                    value={representativeSurname}
                    onChangeText={text => setRepresentativeSurname(text)}
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
                <Text style={styles.buttonText}>Güncelle</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },

});

export default KurumsalProfilGuncelleme;

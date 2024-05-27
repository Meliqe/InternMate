import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { auth, firestore } from '../../config/firebase';
import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

const IlanOlusturmaSayfasi = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');

    const handleCreateAd = async () => {
        try {
            // İlan veri tabanına ekleniyor
            const adData = {
                title: title,
                desc: desc,
                ilanverenkisi: auth.currentUser.uid, // Kullanıcının UID'sini ekliyoruz
                createdAt: serverTimestamp()
            };

            const adRef = doc(collection(firestore, 'ilanlar')); // Yeni bir belge referansı alınır
            await setDoc(adRef, adData);

            // İlan oluşturulduktan sonra bir sonraki sayfaya yönlendirme
            navigation.navigate('KurumsalAnasayfa');
        } catch (error) {
            console.error('Error creating ad: ', error);
        }
    };



    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={30} color="#bcd6ff" />
            </TouchableOpacity>
            <Image source={require('../../assets/ilanolusturma.png')} style={styles.bannerImage} />
            <View style={styles.formContainer}>
                <Text style={styles.label}>İlan Başlığı</Text>
                <TextInput
                    style={styles.input}
                    placeholder="İlan başlığını giriniz"
                    onChangeText={(text) => setTitle(text)}
                />
                <Text style={styles.label}>İlan Açıklaması</Text>
                <TextInput
                    style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                    placeholder="İlan açıklamasını giriniz"
                    multiline
                    onChangeText={(text) => setDesc(text)}
                />

                <TouchableOpacity style={styles.createAdButton} onPress={handleCreateAd}>
                    <Text style={styles.buttonText}>İlan Oluştur</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        justifyContent: 'center', // İçeriği dikey eksende ortala
        alignItems: 'center', // İçeriği yatay eksende ortala
    },
    bannerImage: {
        width: 350,
        height: 350,
    },
    formContainer: {
        width: '100%',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    createAdButton: {
        backgroundColor: '#bcd6ff',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
    },
    backButton: {
        position: 'absolute',
        top: 30,
        left: 10,
        paddingLeft: 10
    },
});

export default IlanOlusturmaSayfasi;

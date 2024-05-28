import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { firestore } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';

const IlanDetaylar = () => {
    const route = useRoute();
    const { ilanId } = route.params;
    const [ilan, setIlan] = useState(null);
    const [kullanici, setKullanici] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIlanAndKullanici = async () => {
            try {
                const ilanDoc = await getDoc(doc(firestore, 'ilanlar', ilanId));
                if (ilanDoc.exists()) {
                    const ilanData = ilanDoc.data();
                    setIlan(ilanData);
                    const ilanverenId = ilanData.ilanverenkisi;
                    if (ilanverenId) {
                        const kullaniciDoc = await getDoc(doc(firestore, 'users', ilanverenId));
                        const veri = kullaniciDoc.data();
                        setKullanici(veri);
                    } else {
                        console.error('İlanveren ID mevcut değil.');
                    }
                } else {
                    console.error('İlan bulunamadı.');
                }
            } catch (error) {
                console.error('Veri çekme hatası: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchIlanAndKullanici();
    }, [ilanId]);

    if (loading) {
        return (
            <SafeAreaView style={styles.safeContainer}>
                <View style={styles.loadingContainer}>
                    <Text>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!ilan || !kullanici) {
        return (
            <SafeAreaView style={styles.safeContainer}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>İlan veya Kullanıcı bulunamadı</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
                <View style={styles.box}>
                    <View style={styles.header}>
                        <Text style={styles.ilanBaslik}>{ilan.title}</Text>
                        <Text style={styles.ilanTarih}>{ilan.createdAt.toDate().toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.ilanContainer}>
                        <Text style={styles.ilanAciklama}>{ilan.desc}</Text>
                    </View>
                    <View style={styles.kullaniciContainer}>
                        <Text style={styles.kullaniciBaslik}>İlan Veren:</Text>
                        <Text style={styles.kullaniciAd}>{kullanici.companyName}</Text>
                        <Text style={styles.kullaniciAd}>{kullanici.companyEmail}</Text>
                        <Text style={styles.kullaniciAd}>{kullanici.companyPhone}</Text>
                        <Text style={styles.kullaniciAd}>{kullanici.representativeName}</Text>
                        <Text style={styles.kullaniciAd}>{kullanici.representativeSurname}</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#888',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        width: '90%',
    },
    header: {
        marginBottom: 20,
    },
    ilanBaslik: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    ilanAciklama: {
        fontSize: 18,
        marginBottom: 20,
    },
    ilanTarih: {
        fontSize: 16,
        color: '#888',
        marginBottom: 20,
    },
    kullaniciContainer: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 20,
    },
    kullaniciBaslik: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    kullaniciAd: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default IlanDetaylar;

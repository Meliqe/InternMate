import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firestore } from '../../config/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const Basvurularim = ({ navigation }) => {
    const [basvurular, setBasvurular] = useState([]);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchBasvurular = async () => {
            try {
                if (currentUser) {
                    const q = query(collection(firestore, 'basvurular'), where('basvurankisi', '==', currentUser.uid));
                    const querySnapshot = await getDocs(q);
                    const basvurularData = await Promise.all(querySnapshot.docs.map(async docSnapshot => {
                        const data = docSnapshot.data();
                        const ilanDocRef = doc(firestore, 'ilanlar', data.basvurulanilan);
                        const ilanDoc = await getDoc(ilanDocRef);
                        return { ...data, ilan: ilanDoc.exists() ? ilanDoc.data() : null };
                    }));
                    setBasvurular(basvurularData);
                } else {
                    console.error('Kullanıcı giriş yapmamış.');
                }
            } catch (error) {
                console.error('Veri çekme hatası: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBasvurular();
    }, [currentUser]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Beklemede':
                return '#FFD700'; // Sarı
            case 'Onaylandı':
                return '#32CD32'; // Yeşil
            case 'Reddedildi':
                return '#FF6347'; // Kırmızı
            default:
                return '#ccc'; // Default gri
        }
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeContainer}>
                <View style={styles.loadingContainer}>
                    <Text>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (basvurular.length === 0) {
        return (
            <SafeAreaView style={styles.safeContainer}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Henüz başvurunuz bulunmamaktadır.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.navbar}>
                <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#BCD6FF" />
                </TouchableOpacity>
            </View>
            <FlatList
                contentContainerStyle={styles.listContentContainer}
                data={basvurular}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.basvuruContainer, { borderColor: getStatusColor(item.basvurudurumu) }]}>
                        <Text style={styles.ilanBaslik}>{item.ilan?.title}</Text>
                        <Text style={styles.ilanaciklama}>{item.ilan?.desc}</Text>
                        <Text style={styles.basvuruTarih}>Başvuru Tarihi: {item.basvurutarihi.toDate().toLocaleDateString()}</Text>
                        <Text style={styles.basvuruDurumu}>Durum: {item.basvurudurumu}</Text>
                        {item.basvurudurumu === 'Onaylandı' && (
                            <Text style={styles.onaylanmaTarihi}>Onaylanma Tarihi: {item.onaylanmaTarihi.toDate().toLocaleString()}</Text>
                        )}
                        {item.basvurudurumu === 'Reddedildi' && (
                            <Text style={styles.reddedilmeTarihi}>Reddedilme Tarihi: {item.reddedilmeTarihi.toDate().toLocaleString()}</Text>
                        )}
                    </View>
                )}
            />
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
    listContentContainer: {
        paddingTop: 50,
        paddingBottom: 20,
    },
    basvuruContainer: {
        borderWidth: 2,
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 20,
        marginVertical: 10,
    },
    ilanBaslik: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    basvuruTarih: {
        fontSize: 16,
        marginBottom: 5,
    },
    basvuruDurumu: {
        fontSize: 16,
        marginBottom: 10,
    },
    onaylanmaTarihi: {
        fontSize: 16,
        marginBottom: 10,
    },
    reddedilmeTarihi: {
        fontSize: 16,
        marginBottom: 10,
    },
    ilanaciklama: {
        fontSize: 16,
    },
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    backButtonText: {
        fontSize: 18,
        color: '#BCD6FF', // Blue color for back button text
    },
});

export default Basvurularim;

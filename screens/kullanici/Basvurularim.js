import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { firestore } from '../../config/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const Basvurularim = () => {
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
            <FlatList
                contentContainerStyle={styles.listContentContainer}
                data={basvurular}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.basvuruContainer, { borderColor: getStatusColor(item.basvurudurumu) }]}>
                        <Text style={styles.ilanBaslik}>{item.ilan?.title}</Text>
                        <Text style={styles.basvuruTarih}>Başvuru Tarihi: {item.basvurutarihi.toDate().toLocaleDateString()}</Text>
                        <Text style={styles.basvuruDurumu}>Durum: {item.basvurudurumu}</Text>
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
        paddingTop: 50, // Daha fazla boşluk için değer arttırıldı
        paddingBottom: 20, // Alt kısımda boşluk ekleyin
    },
    basvuruContainer: {
        borderWidth: 2, // Border genişliği arttırıldı
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 20, // Yatayda biraz boşluk ekleyin
        marginVertical: 10, // Dikeyde biraz boşluk ekleyin
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
});

export default Basvurularim;

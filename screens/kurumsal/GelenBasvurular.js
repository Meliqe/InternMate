import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { firestore } from '../../config/firebase';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';

const GelenBasvurular = () => {
    const [gelenBasvurular, setGelenBasvurular] = useState([]);

    useEffect(() => {
        const fetchGelenBasvurular = async () => {
            try {
                // Firestore bağlantısı üzerinden basvurular koleksiyonundaki tüm belgeleri al
                const basvurularQuery = query(collection(firestore, 'basvurular'));
                const querySnapshot = await getDocs(basvurularQuery);
                const gelenBasvurularData = [];

                // Her başvuru belgesi için işlem yap
                querySnapshot.forEach(async (doc) => {
                    const basvuruData = doc.data();
                    const ilanId = basvuruData.basvurulanilan;

                    // İlgili ilanın belgesini al
                    const ilanDoc = await getDoc(doc(firestore, 'ilanlar', ilanId));
                    const ilanData = ilanDoc.data();

                    // İlgili ilanın sahibinin ID'sini al
                    const ilanSahibiId = ilanData.ilanverenkisi;

                    // İlgili ilanı yayımlayan kurumsal kullanıcının gelen kutusuna başvuruyu ekle
                    await addDoc(collection(firestore, `users/${ilanSahibiId}/gelenKutusu`), basvuruData);

                    // Gelen başvurular listesine ekle
                    gelenBasvurularData.push({ basvuruData, ilanData, ilanSahibiId });
                });

                // State'i güncelle
                setGelenBasvurular(gelenBasvurularData);
            } catch (error) {
                console.error('Error fetching gelen basvurular: ', error);
            }
        };

        fetchGelenBasvurular();
    }, []);

    const renderBasvuruItem = ({ item }) => (
        <View style={styles.basvuruContainer}>
            <Text>Kullanıcı: {item.basvuruData.basvurankisi}</Text>
            <Text>Tarih: {item.basvuruData.basvurutarihi.toDate().toLocaleDateString()}</Text>
            <Text>İlan: {item.ilanData.ilanBasligi}</Text>
            {/* İlan sahibinin ID'si: {item.ilanSahibiId} */}
        </View>
    );

    return (
        <View style={styles.container}>
            {gelenBasvurular.length === 0 ? (
                <Text style={styles.emptyText}>Gelen başvuru yok</Text>
            ) : (
                <FlatList
                    data={gelenBasvurular}
                    renderItem={renderBasvuruItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.basvuruListContainer}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 50,
        justifyContent: 'center', // Dikey hizalamayı merkeze al
        alignItems: 'center', // Yatay hizalamayı merkeze al
    },
    basvuruListContainer: {
        paddingBottom: 20,
    },
    basvuruContainer: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
});

export default GelenBasvurular;

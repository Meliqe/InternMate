import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../config/firebase';

const GelenBasvurular = ({ currentUser }) => {
    const [basvurular, setBasvurular] = useState([]);

    useEffect(() => {
        const fetchBasvurular = async () => {
            try {
                // Başvurular koleksiyonunu sorgula
                const basvuruQuery = query(collection(firestore, 'basvurular'));
                const basvuruSnapshot = await getDocs(basvuruQuery);

                const basvuruData = [];

                for (const basvuruDoc of basvuruSnapshot.docs) {
                    const basvuru = basvuruDoc.data();

                    // Başvuran kişinin bilgilerini al
                    const basvuranKisiQuery = query(collection(firestore, 'users2'), where('userId', '==', basvuru.basvurankisi));
                    const basvuranKisiSnapshot = await getDocs(basvuranKisiQuery);
                    const basvuranKisiData = basvuranKisiSnapshot.docs.map(doc => doc.data());

                    // Başvurulan ilanı al
                    const ilanQuery = query(collection(firestore, 'ilanlar'), where('ilanId', '==', basvuru.basvurulanilan));
                    const ilanSnapshot = await getDocs(ilanQuery);
                    const ilanData = ilanSnapshot.docs.map(doc => doc.data());

                    if (ilanData.length > 0 && basvuranKisiData.length > 0) {
                        const ilan = ilanData[0];
                        const basvuranKisi = basvuranKisiData[0];

                        // Eğer oturum açan kullanıcı ile ilanı veren kişi aynı ise
                        if (ilan.ilanverenkisi === currentUser) {
                            basvuruData.push({
                                ...basvuru,
                                basvuranKisi,
                                ilan
                            });
                        }
                    }
                }

                setBasvurular(basvuruData);
            } catch (error) {
                console.error('Başvuruları getirme hatası: ', error);
            }
        };

        if (currentUser) {
            fetchBasvurular();
        }
    }, [currentUser]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gelen Başvurular</Text>
            <FlatList
                data={basvurular}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.basvuruContainer}>
                        <Text style={styles.basvuruText}>Başvuran Kişi: {item.basvuranKisi.name}</Text>
                        <Text style={styles.basvuruText}>Başvurulan İlan: {item.ilan.title}</Text>
                        <Text style={styles.basvuruText}>Başvuru Tarihi: {item.basvurutarihi}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    basvuruContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    basvuruText: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default GelenBasvurular;

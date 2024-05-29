import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { firestore, auth } from '../../config/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const GelenBasvurular = () => {
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                if (!currentUser) {
                    return;
                }

                const userId = currentUser.uid;

                // Kurumsal kullanıcının ilanlarına yapılan başvuruları getirme
                const ilanlarQuery = query(collection(firestore, 'ilanlar'), where('ilanverenkisi', '==', userId));
                const ilanlarSnapshot = await getDocs(ilanlarQuery);

                const ilanlarIds = ilanlarSnapshot.docs.map(doc => doc.id);

                if (ilanlarIds.length === 0) {
                    setApplications([]);
                    return;
                }

                const basvurularQuery = query(collection(firestore, 'basvurular'), where('basvurulanilan', 'in', ilanlarIds));
                const basvurularSnapshot = await getDocs(basvurularQuery);

                const applicationsData = await Promise.all(
                    basvurularSnapshot.docs.map(async basvuruDoc => {
                        const basvuruData = basvuruDoc.data();
                        const basvurankisiDoc = await getDoc(doc(firestore, 'users2', basvuruData.basvurankisi));
                        const ilanDoc = await getDoc(doc(firestore, 'ilanlar', basvuruData.basvurulanilan));

                        return {
                            id: basvuruDoc.id,
                            applicant: basvurankisiDoc.data(),
                            ilan: ilanDoc.data(),
                        };
                    })
                );

                setApplications(applicationsData);
            } catch (error) {
                console.error('Error fetching applications: ', error);
                setError(error.message);
            }
        };

        fetchApplications();
    }, [currentUser]);

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.title}>Başvuru ID: {item.id}</Text>
            <Text>Kullanıcı: {item.applicant?.name}</Text>
            <Text>Email: {item.applicant?.email}</Text>
            <Text>İlan: {item.ilan?.title}</Text>
            <Text>İlan Açıklaması: {item.ilan?.description}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Gelen Başvurular</Text>
            {error ? (
                <Text style={styles.error}>Hata: {error}</Text>
            ) : (
                <FlatList
                    data={applications}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            )}
        </View>
    );
};

export default GelenBasvurular;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    item: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        fontSize: 16,
    },
});

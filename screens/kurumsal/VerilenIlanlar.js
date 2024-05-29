import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from '../../config/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';


const IlanlarimSayfasi = () => {
    const [ilanlar, setIlanlar] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchIlanlar = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    return;
                }

                const ilanlarQuery = query(
                    collection(firestore, 'ilanlar'),
                    where('ilanverenkisi', '==', user.uid)
                );
                const querySnapshot = await getDocs(ilanlarQuery);
                const fetchedIlanlar = [];

                querySnapshot.forEach((doc) => {
                    fetchedIlanlar.push({ id: doc.id, ...doc.data() });
                });

                setIlanlar(fetchedIlanlar);
            } catch (error) {
                console.error('Error fetching ilanlar: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchIlanlar();

        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.goBack();
            return true;
        });

        return () => backHandler.remove();
    }, []);

    const handleDeleteIlan = async (ilanId) => {
        try {
            await deleteDoc(doc(firestore, 'ilanlar', ilanId));
            setIlanlar(ilanlar.filter(ilan => ilan.id !== ilanId));
        } catch (error) {
            console.error('Error deleting ilan: ', error);
        }
    };

    const renderIlanItem = ({ item }) => (
        <View style={styles.ilanContainer}>
            <View style={styles.ilanInfo}>
                <Text style={styles.ilanBaslik}>{item.title}</Text>
                <Text style={styles.ilanAciklama}>{item.desc}</Text>
                <Text style={styles.ilanTarih}>{item.createdAt.toDate().toLocaleDateString()}</Text>
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                    Alert.alert(
                        "İlanı Sil",
                        "Bu ilanı silmek istediğinize emin misiniz?",
                        [
                            {
                                text: "İptal",
                                style: "cancel"
                            },
                            {
                                text: "Sil",
                                onPress: () => handleDeleteIlan(item.id),
                                style: "destructive"
                            }
                        ]
                    );
                }}
            >
                <Text style={styles.buttonText}>İlanı Sil</Text>
            </TouchableOpacity>
        </View>
    );

    const handleGeri = () => {
        navigation.goBack();
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleGeri} style={styles.geriButton}>
                <Ionicons name="arrow-back" size={24} color="#BCD6FF" />
            </TouchableOpacity>


            {ilanlar.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>İlan verilmedi</Text>
                </View>
            ) : (
                <FlatList
                    data={ilanlar}
                    renderItem={renderIlanItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.ilanListContainer}
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
    },
    ilanListContainer: {
        paddingBottom: 20,
    },
    ilanContainer: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ilanInfo: {
        flex: 1,
        paddingRight: 10,
    },
    ilanBaslik: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    ilanAciklama: {
        fontSize: 16,
        marginBottom: 5,
    },
    ilanTarih: {
        fontSize: 14,
        color: '#888',
    },
    deleteButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
    geriButton: {
        Color: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginBottom: 20,
    },
});

export default IlanlarimSayfasi;

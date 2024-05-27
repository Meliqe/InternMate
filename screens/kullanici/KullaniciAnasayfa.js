import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { firestore } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const KullaniciAnasayfa = () => {
    const [ilanlar, setIlanlar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        const fetchIlanlar = async () => {
            try {
                const ilanlarQuery = collection(firestore, 'ilanlar');
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
    }, []);

    const handleIlanIncele = (ilanId) => {
        navigation.navigate('IlanIncele', { ilanId });
    };

    const renderIlanItem = ({ item }) => (
        <View style={styles.ilanContainer}>
            <View style={styles.ilanInfo}>
                <Text style={styles.ilanBaslik}>{item.title}</Text>
                <Text style={styles.ilanAciklama}>{item.desc}</Text>
                <Text style={styles.ilanTarih}>{item.createdAt.toDate().toLocaleDateString()}</Text>
            </View>
            <TouchableOpacity
                style={styles.inceleButton}
                onPress={() => handleIlanIncele(item.id)}
            >
                <Text style={styles.buttonText}>İlanı İncele</Text>
            </TouchableOpacity>
        </View>
    );

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
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

    return (
        <SafeAreaView style={styles.safeContainer}>
            {/* Sidebar */}
            {sidebarOpen && <Sidebar onClose={closeSidebar} />}
            <View style={[styles.content, sidebarOpen && styles.contentWithSidebar]}>
                <View style={styles.navbar}>
                    <TouchableOpacity onPress={toggleSidebar}>
                        <Ionicons name="menu" size={28} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.navbarTitle}>Anasayfa</Text>
                </View>
                {ilanlar.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>İlan bulunamadı</Text>
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
        </SafeAreaView>
    );
};

const Sidebar = ({ onClose }) => {
    return (
        <View style={styles.sidebarContainer}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.sidebarText}>Sidebar Content</Text>
        </View>
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
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginTop: 20,
    },
    navbarTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    contentWithSidebar: {
        marginLeft: 200,
    },
    ilanListContainer: {
        paddingBottom: 20,
    },
    ilanContainer: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
    },
    ilanInfo: {
        flex: 1,
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
    inceleButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
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
    sidebarContainer: {
        backgroundColor: '#fff',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: 200,
        paddingTop: 50,
        borderRightWidth: 1,
        borderRightColor: '#ddd',
        zIndex: 2,
    },
    sidebarText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 3,
    },
});

export default KullaniciAnasayfa;

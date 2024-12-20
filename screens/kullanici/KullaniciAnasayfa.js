import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { firestore } from '../../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';

const KullaniciAnasayfa = () => {
    const [ilanlar, setIlanlar] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sidebarWidth] = useState(new Animated.Value(0));
    const auth = getAuth();
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchIlanlar = async () => {
            try {
                const basvurularQuery = query(collection(firestore, 'basvurular'), where('basvurankisi', '==', currentUser.uid));
                const basvurularSnapshot = await getDocs(basvurularQuery);
                const basvurulanIlanlar = basvurularSnapshot.docs.map(doc => doc.data().basvurulanilan);

                const ilanlarQuery = collection(firestore, 'ilanlar');
                const querySnapshot = await getDocs(ilanlarQuery);
                const fetchedIlanlar = querySnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(ilan => !basvurulanIlanlar.includes(ilan.id));

                setIlanlar(fetchedIlanlar);
            } catch (error) {
                console.error('Error fetching ilanlar: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchIlanlar();
    }, [currentUser.uid]);

    const handleIlanIncele = (ilanId) => {
        navigation.navigate('IlanDetaylari', { ilanId });
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.navigate('KullaniciGiris');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

    const toggleSidebar = () => {
        Animated.timing(sidebarWidth, {
            toValue: isSidebarOpen ? 0 : 200,
            duration: 300,
            useNativeDriver: false,
        }).start();
        setIsSidebarOpen(!isSidebarOpen);
    };

    const navigateToProfile = () => {
        navigation.navigate('KullaniciProfili');
    };

    const navigateToApplications = () => {
        navigation.navigate('Basvurularim');
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
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleSidebar}>
                    <Ionicons name="menu" size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles.navbarTitle}>Anasayfa</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Ionicons name="log-out" size={28} color="black" />
                </TouchableOpacity>
            </View>
            <Animated.View style={[styles.sidebar, { width: sidebarWidth }]}>
                <TouchableOpacity style={styles.closeButton} onPress={toggleSidebar}>
                    <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem} onPress={navigateToProfile}>
                    <Text>Profilim</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sidebarItem} onPress={navigateToApplications}>
                    <Text>Başvurularım</Text>
                </TouchableOpacity>
            </Animated.View>
            <View style={styles.content}>
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
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    ilanListContainer: {
        paddingBottom: 20,
    },
    ilanContainer: {
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#BCD6FF',
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
        backgroundColor: '#BCD6FF',
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
    sidebar: {
        position: 'absolute',
        top: 60,
        left: 0,
        bottom: 0,
        backgroundColor: '#fff',
        borderRightWidth: 1,
        borderRightColor: '#ddd',
        zIndex: 999,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    sidebarItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        width: '100%',
    },
    closeButton: {
        padding: 10,
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1000,
    },
});

export default KullaniciAnasayfa;

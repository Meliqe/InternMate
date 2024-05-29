import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { firestore, auth } from '../../config/firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

const GelenBasvurular = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
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

                const ilanlarQuery = query(collection(firestore, 'ilanlar'), where('ilanverenkisi', '==', userId));
                const ilanlarSnapshot = await getDocs(ilanlarQuery);

                const ilanlarIds = ilanlarSnapshot.docs.map(doc => doc.id);

                if (ilanlarIds.length === 0) {
                    setApplications([]);
                    setLoading(false);
                    return;
                }

                const basvurularQuery = query(collection(firestore, 'basvurular'), where('basvurulanilan', 'in', ilanlarIds));
                const basvurularSnapshot = await getDocs(basvurularQuery);

                const applicationsData = await Promise.all(
                    basvurularSnapshot.docs.map(async basvuruDoc => {
                        const basvuruData = basvuruDoc.data();
                        const basvurankisiDoc = await getDoc(doc(firestore, 'users2', basvuruData.basvurankisi));
                        const ilanDoc = await getDoc(doc(firestore, 'ilanlar', basvuruData.basvurulanilan));

                        // Kullanıcı verileri ve CV dosyasını al
                        const userData = basvurankisiDoc.data();
                        const cvFile = userData.cvFile;

                        // CV dosyasının varlığını kontrol et
                        let cvUrl = null;
                        if (cvFile) {
                            cvUrl = cvFile;
                        }

                        return {
                            id: basvuruDoc.id,
                            applicant: userData,
                            ilan: ilanDoc.data(),
                            cvUrl: cvUrl,
                            status: basvuruData.basvurudurumu
                        };
                    })
                );

                setApplications(applicationsData);
            } catch (error) {
                console.error('Error fetching applications: ', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [currentUser]);

    const handleApprove = async (basvuruId) => {
        try {
            const basvuruRef = doc(firestore, 'basvurular', basvuruId);
            await updateDoc(basvuruRef, {
                basvurudurumu: 'Onaylandı',
                onaylanmaTarihi: new Date()
            });
            console.log('Başvuru onaylandı.');
            // Burada gerekirse bir bildirim gösterebilirsiniz veya başka bir işlem yapabilirsiniz.
        } catch (error) {
            console.error('Error approving application: ', error);
            // Hata durumunda kullanıcıya bilgi vermek için bir bildirim gösterebilirsiniz.
        }
    };

    const handleReject = async (basvuruId) => {
        try {
            const basvuruRef = doc(firestore, 'basvurular', basvuruId);
            await updateDoc(basvuruRef, {
                basvurudurumu: 'Reddedildi',
                reddedilmeTarihi: new Date()
            });
            console.log('Başvuru reddedildi.');
            // Burada gerekirse bir bildirim gösterebilirsiniz veya başka bir işlem yapabilirsiniz.
        } catch (error) {
            console.error('Error rejecting application: ', error);
            // Hata durumunda kullanıcıya bilgi vermek için bir bildirim gösterebilirsiniz.
        }
    };

    const renderStatus = (status) => {
        switch (status) {
            case 'Onaylandı':
                return <Text style={styles.statusText}>Onaylandı</Text>;
            case 'Reddedildi':
                return <Text style={styles.statusText}>Reddedildi</Text>;
            default:
                return (
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => handleApprove(status.id)}>
                            <Icon name="checkmark-circle-outline" size={30} color="#4CAF50" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => handleReject(status.id)}>
                            <Icon name="close-circle-outline" size={30} color="#F44336" />
                        </TouchableOpacity>
                    </View>
                );
        }
    };

    const renderItem = ({ item }) => {
        const createdAtDate = new Date(item.ilan?.createdAt.seconds * 1000);
        const formattedDate = createdAtDate.toLocaleDateString();

        return (
            <View style={styles.itemContainer}>
                <Text style={styles.ilanTitle}>{item.ilan?.title}</Text>
                <Text style={styles.ilanDesc}>{item.ilan?.desc}</Text>
                <Text style={styles.ilanDate}>Oluşturulma Tarihi: {formattedDate}</Text>
                <Text style={styles.subTitle}>Kullanıcı Bilgileri</Text>
                <View style={styles.userInfo}>
                    <Text style={styles.userInfoText}>Adı: {item.applicant?.name}</Text>
                    <Text style={styles.userInfoText}>Soyadı: {item.applicant?.surname}</Text>
                    <Text style={styles.userInfoText}>Email: {item.applicant?.email}</Text>
                    <Text style={styles.userInfoText}>Telefon: {item.applicant?.phone}</Text>
                    <Text style={styles.userInfoText}>Okul: {item.applicant?.school}</Text>
                    <Text style={styles.userInfoText}>Sınıf: {item.applicant?.grade}</Text>
                    <Text style={styles.userInfoText}>Hakkımda: {item.applicant?.introduction}</Text>
                    {item.cvUrl && (
                        <TouchableOpacity
                            style={styles.cvButton}
                            onPress={() => Linking.openURL(item.cvUrl)}
                        >
                            <Text style={styles.cvButtonText}>CV'yi Görüntülemek İçin Tıklayın</Text>
                        </TouchableOpacity>
                    )}
                    {renderStatus(item.status)}
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Veriler yükleniyor...</Text>
            </View>
        );
    }

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    itemContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        elevation: 2,
    },
    ilanTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    ilanDesc: {
        marginBottom: 10,
        color: '#555',
    },
    ilanDate: {
        marginBottom: 10,
        color: '#777',
    },
    subTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    userInfo: {
        marginLeft: 15,
    },
    userInfoText: {
        marginBottom: 5,
        color: '#444',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#777',
    },
    error: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        padding: 5,
        borderRadius: 5,
    },
    cvButton: {
        backgroundColor: '#4285F4',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    cvButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    statusText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
        marginTop: 10,
    },
});

export default GelenBasvurular;


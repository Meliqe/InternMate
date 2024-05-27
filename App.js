import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Start from './screens/Start';
import KurumsalGiris from './screens/kurumsal/KurumsalGiris';
import KurumsalKayit from './screens/kurumsal/KurumsalKayit';
import KurumsalAnasayfa from './screens/kurumsal/KurumsalAnasayfa'
import ProfilDoldurmaSayfasi from './screens/kurumsal/ProfilDoldurmaSayfasi';
import GelenBasvurular from './screens/kurumsal/GelenBasvurular';
import VerilenIlanlar from './screens/kurumsal/VerilenIlanlar';
import IlanOlusturmaSayfasi from './screens/kurumsal/IlanOlusturmaSayfasi';
import KurumsalProfilSayfasi from './screens/kurumsal/KurumsalProfilSayfasi';
import KullaniciGiris from './screens/kullanici/KullaniciGiris';
import KullaniciKayit from './screens/kullanici/KullaniciKayit';
import KullaniciAnasayfa from './screens/kullanici/KullaniciAnasayfa';
import KullaniciProfilDoldurmaSayfasi from './screens/kullanici/KullaniciProfilDoldurmaSayfasi';
import Basvurularim from './screens/kullanici/Basvurularim';
import Tekliflerim from './screens/kullanici/Tekliflerim';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen
          name="Start"
          component={Start}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="KurumsalGiris"
          component={KurumsalGiris}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="KurumsalKayit" component={KurumsalKayit} options={{ headerShown: false }} />
        <Stack.Screen name="KurumsalAnasayfa" component={KurumsalAnasayfa} options={{ headerShown: false }} />
        <Stack.Screen name="GelenBasvurular" component={GelenBasvurular} options={{ headerShown: false }} />
        <Stack.Screen name="ProfilDoldurmaSayfasi" component={ProfilDoldurmaSayfasi} options={{ headerShown: false }} />
        <Stack.Screen name="VerilenIlanlar" component={VerilenIlanlar} options={{ headerShown: false }} />
        <Stack.Screen name="IlanOlusturmaSayfasi" component={IlanOlusturmaSayfasi} options={{ headerShown: false }} />
        <Stack.Screen name="KurumsalProfilSayfasi" component={KurumsalProfilSayfasi} options={{ headerShown: false }} />
        <Stack.Screen name="KullaniciGiris" component={KullaniciGiris} options={{ headerShown: false }} />
        <Stack.Screen name="KullaniciKayit" component={KullaniciKayit} options={{ headerShown: false }} />
        <Stack.Screen name="KullaniciAnasayfa" component={KullaniciAnasayfa} options={{ headerShown: false }} />
        <Stack.Screen name="KullaniciProfilDoldurmaSayfasi" component={KullaniciProfilDoldurmaSayfasi} options={{ headerShown: false }} />
        <Stack.Screen name="Basvurularim" component={Basvurularim} options={{ headerShown: false }} />
        <Stack.Screen name="Tekliflerim" component={Tekliflerim} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

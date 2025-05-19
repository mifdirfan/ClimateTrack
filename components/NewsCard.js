import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function NewsCard() {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/warning.jpg')} style={styles.image} />
      <View style={styles.textOverlay}>
        <Text style={styles.headline}>
          Warning of heavy rain, thunderstorm nationwide until 7pm
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>B</Text>
          </View>
          <View>
            <Text style={styles.title}>Bernama TV</Text>
            <Text style={styles.timestamp}>Posted at 9:30 AM</Text>
          </View>
        </View>

        <Text style={styles.body}>
          KUALA LUMPUR: The Malaysian Meteorological Department (MetMalaysia) has issued a warning of heavy rain, thunderstorms and strong winds in almost the whole country until 7 pm on Thursday (May 8). MetMalaysia, in a statement, said there are indications of thunderstorms with rainfall intensity exceeding 20 mm/hour expected to occur for more than an hour. The warning covered Kuala Lumpur and Putrajaya as well as Langkawi, Padang Terap, Pendang, Sik and Baling in Kedah; Hulu Perak, Kuala Kangsar, Kinta, Perak Tengah, Kampar, ...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  image: { width: '100%', height: 240, resizeMode: 'cover' },
  textOverlay: {
    position: 'absolute',
    bottom: 30,
    left: 15,
    right: 15,
  },
  headline: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 4,
  },
  card: {
    marginTop: -20,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  logo: {
    backgroundColor: '#00AEEF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoText: { color: 'white', fontWeight: 'bold', fontSize: 20 },
  title: { fontWeight: 'bold', fontSize: 16 },
  timestamp: { fontSize: 12, color: '#777' },
  body: { fontSize: 14, color: '#333', lineHeight: 20 },
});

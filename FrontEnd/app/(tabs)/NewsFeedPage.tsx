import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import NewsFeedItem from '@/components/NewsFeedItem';

const newsData = [
  {
    id: '1',
    title: 'Warning of heavy rain, thunderstorm nationwide until 7pm',
    description: `KUALA LUMPUR: The Malaysian Meteorological Department (MetMalaysia) has issued a warning of heavy rain, thunderstorms and strong winds in almost the whole country until 7 pm on Thursday (May 8).

MetMalaysia, in a statement, said there are indications of thunderstorms with rainfall intensity exceeding 20 mm/hour expected to occur for more than an hour.`,
    image: require('@/assets/images/warning.jpg'),
  },
  {
    id: '2',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    description:
      'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices.',
    image: require('@/assets/images/news1.png'),
  },
  {
    id: '3',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    description:
      'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices.',
    image: require('@/assets/images/news1.png'),
  },
];

export default function NewsFeedPage() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top navigation buttons (non-functional now) */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Chatrooms</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.activeButton]}>
          <Text style={[styles.buttonText, styles.activeButtonText]}>News</Text>
          <View style={styles.underline} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Notifications</Text>
        </TouchableOpacity>
      </View>

      {/* News list */}
      <FlatList
        data={newsData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <NewsFeedItem
              title={item.title}
              description={item.description}
              image={item.image}
            />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  button: {
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#444',
  },
  activeButton: {},
  activeButtonText: {
    fontWeight: 'bold',
    color: '#000',
  },
  underline: {
    marginTop: 5,
    height: 3,
    width: 30,
    backgroundColor: '#000',
    borderRadius: 2,
  },

  listContent: {
    paddingBottom: 20,
  },
});

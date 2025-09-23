// NewsFeedPage.tsx -> to show news feed

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import styles, { TAB_LABELS } from '../../constants/NewsFeedPageStyles';

import CommunityPage from '../screens/CommunityPage';


type NewsItem = {
  id: string;
  title: string;
  description: string,
  sourceName: string;
  time: string;
  image: string;
  url: string;
};

// const MOCK_NEWS: NewsItem[] = [
//   {
//     id: '1',
//     title: 'Massive Malaysia Floods',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum...',
//     source: 'BBC',
//     time: '6 minutes ago',
//     image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=400&q=80',
//     url: 'https://www.bbc.com/news/world-asia-56200108',
//   },
//   {
//     id: '2',
//     title: 'KL Faces Historic Flood',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum...',
//     source: 'CNN',
//     time: '15 minutes ago',
//     image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?fit=crop&w=400&q=80',
//     url: 'https://edition.cnn.com/asia/malaysia-floods',
//   },
//   {
//     id: '3',
//     title: 'Massive Malaysia Floods',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum...',
//     source: 'BBC',
//     time: '40 minutes ago',
//     image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=400&q=80',
//     url: 'https://www.bbc.com/news/world-asia-56200108',
//   },
//   // ...add more as you like
// ];

// ----- TABS -----
type TabKey = 'Community' | 'News' | 'Notifications';

function CommunityTab() {
  return <CommunityPage />;
}

function NotificationsTab() {
  return <View style={styles.tabContent} />;
}

function NewsTab() {
  const [webviewUrl, setWebviewUrl] = useState<string | null>(null);

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://172.16.114.146:8080/api/news') // update to your IP
        .then(response => response.json())
        .then(data => {
          const mapped = data.map((n: any) => ({
            id: n.articleId || n.id,
            title: n.title,
            description: n.description || 'No description available.',
            sourceName: n.sourceName || 'Unknown',
            time: new Date(n.publishedAt).toLocaleString(),
            image: n.imageUrl,
            url: n.url
          }));
          setNews(mapped);
        })
        .catch(err => console.error("Failed to fetch news:", err))
        .finally(() => setLoading(false));
  }, []);

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity
      style={styles.newsItem}
      onPress={() => setWebviewUrl(item.url)}
      activeOpacity={0.88}
    >
      <Image source={{ uri: item.image }} style={styles.newsImage} />
      <View style={styles.newsContent}>
        <Text style={styles.newsSource}>{item.sourceName}</Text>
        <Text numberOfLines={2} style={styles.newsTitle}>{item.title}</Text>
        <Text style={styles.newsDesc} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.newsMeta}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );


  return (
    <View style={styles.newsTabWrapper}>
      {/* <Text style={styles.header}>News Feed</Text> */}
      {loading && <Text style={{ textAlign: 'center' }}>Loading news...</Text>}
      {!loading && news.length === 0 && <Text style={{ textAlign: 'center' }}>No news found.</Text>}
      <FlatList
        data={news}
        renderItem={renderNewsItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.newsListContainer}
        showsVerticalScrollIndicator={false}
      />

      <Modal visible={!!webviewUrl} animationType="slide" onRequestClose={() => setWebviewUrl(null)}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.webviewCloseBtn}
            onPress={() => setWebviewUrl(null)}
          >
            <Text style={styles.webviewCloseText}>Close</Text>
          </TouchableOpacity>
          {webviewUrl && <WebView source={{ uri: webviewUrl }} style={{ flex: 1 }} />}
        </View>
      </Modal>
    </View>
  );
}

// -------- Main Component --------
export default function NewsFeedPage() {
  const [selectedTab, setSelectedTab] = useState<TabKey>('News');

  function renderCurrentTab() {
    switch (selectedTab) {
      case 'Community':
        return <CommunityTab />;
      case 'Notifications':
        return <NotificationsTab />;
      case 'News':
      default:
        return <NewsTab />;
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        {TAB_LABELS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={styles.tabBtn}
            onPress={() => setSelectedTab(tab as TabKey)}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.tabLabel,
              selectedTab === tab && styles.activeTabLabel,
            ]}>
              {tab}
            </Text>
            {selectedTab === tab && <View style={styles.underline} />}
          </TouchableOpacity>
        ))}
      </View>
      {renderCurrentTab()}
    </View>
  );
}

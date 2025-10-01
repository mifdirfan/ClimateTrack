// NewsFeedPage.tsx -> to show news feed

import { View, Text, TouchableOpacity, FlatList, Image, Modal, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { WebView } from 'react-native-webview';
import styles, { TAB_LABELS } from '../../constants/NewsFeedPageStyles';

import CommunityPage from './CommunityPage';
import API_BASE_URL from '../../constants/ApiConfig';
import { Header } from '../../components/Header';
import {Ionicons} from "@expo/vector-icons";


type NewsItem = {
  id: string;
  title: string;
  description: string,
  sourceName: string;
  time: string;
  publishedDate: string; // To store the formatted date
  image: string;
  url: string;
  articleId: string; // Use articleId for keyExtractor for consistency
};


// -------- Helper function to format date/time --------
function formatTimeAgo(dateString: string): string {
  if (!dateString || new Date(dateString).toString() === 'Invalid Date') {
    return 'Just now'; // Fallback for invalid dates
  }
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000; // years
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000; // months
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400; // days
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600; // hours
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60; // minutes
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

// -------- Helper function to format the publication date --------
function formatPublishedDate(dateString: string): string {
  if (!dateString || new Date(dateString).toString() === 'Invalid Date') {
    return 'Date not available'; // Fallback for invalid dates
  }
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}


// ----- TABS -----
type TabKey = 'News';

// function CommunityTab() {
//   return <CommunityPage />;
// }
//
// function NotificationsTab() {
//   return <View style={styles.tabContent} />;
// }

export default function NewsFeedPage() {
  const [webviewUrl, setWebviewUrl] = useState<string | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/api/news`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch news. Please try again later.');
          }
          return response.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            const mapped = data.map((n: any) => ({
              id: n.articleId,
              articleId: n.articleId,
              title: n.title,
              description: n.description || n.content,
              sourceName: n.sourceName || 'Unknown',
              time: formatTimeAgo(n.publishedAt),
              publishedDate: formatPublishedDate(n.publishedAt),
              image: n.imageUrl,
              url: n.url
            }));
            setNews(mapped);
          }
        })
        .catch(err => setError(err.message || 'An unexpected error occurred.'))
        .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
      <TouchableOpacity
          style={styles.newsItem}
          onPress={() => setWebviewUrl(item.url)}
          activeOpacity={0.88}
      >
        <Image
            source={{ uri: item.image || 'https://via.placeholder.com/150?text=No+Image' }}
            style={styles.newsImage}
        />
        <View style={styles.newsContent}>
          <Text style={styles.newsSource}>{item.sourceName} • {item.publishedDate}</Text>
          <Text numberOfLines={2} style={styles.newsTitle}>{item.title}</Text>
          <Text style={styles.newsDesc} numberOfLines={2}>{item.description}</Text>
          <Text style={styles.newsMeta}>{item.time}</Text>
        </View>
      </TouchableOpacity>
  );

  return (

      <SafeAreaView style={styles.container}>
        {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
        {error && <Text style={{ textAlign: 'center', color: 'red', marginTop: 20 }}>{error}</Text>}
        {!loading && !error && news.length === 0 && <Text style={{ textAlign: 'center', marginTop: 20 }}>No news found.</Text>}

        <Header title="ClimateTrack" />

        <FlatList
            data={news}
            renderItem={renderNewsItem}
            keyExtractor={item => item.articleId}
            onRefresh={fetchNews}
            refreshing={loading}
            contentContainerStyle={styles.newsListContainer}
            showsVerticalScrollIndicator={false}
        />

        <Modal visible={!!webviewUrl} animationType="slide" onRequestClose={() => setWebviewUrl(null)}>
          <SafeAreaView style={{ flex: 1 }}>
            <TouchableOpacity
                style={styles.webviewCloseBtn}
                onPress={() => setWebviewUrl(null)}
            >
              <Text style={styles.webviewCloseText}>Close</Text>
            </TouchableOpacity>
            {webviewUrl && <WebView source={{ uri: webviewUrl }} style={{ flex: 1 }} />}
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
  );
}
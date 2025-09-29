// NewsFeedPage.tsx -> to show news feed

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import styles, { TAB_LABELS } from '../../constants/NewsFeedPageStyles';

import CommunityPage from './CommunityPage';
import API_BASE_URL from '../../constants/ApiConfig';


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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/news`) // updated to your IP
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch news. Please try again later.');
          }
          return response.json();
        })
        .then(data => {
          // Safety check: Ensure data is an array before mapping
          if (Array.isArray(data)) {
            const mapped = data.map((n: any) => ({
              id: n.articleId, // Use articleId from backend DTO
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
      <View style={styles.newsTabWrapper}>
        {loading && <Text style={{ textAlign: 'center' }}>Loading news...</Text>}
        {error && <Text style={{ textAlign: 'center', color: 'red' }}>{error}</Text>}
        {!loading && !error && news.length === 0 && <Text style={{ textAlign: 'center' }}>No news found.</Text>}
        <FlatList
            data={news}
            renderItem={renderNewsItem}
            keyExtractor={item => item.articleId}
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


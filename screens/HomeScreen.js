// screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Button, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_KEY, BASE_URL } from '../config';

const screenWidth = Dimensions.get('window').width;

// Define colors for each channel
const channelColors = {
  'bbc-news': { primary: '#bb1919', background: '#f2f2f2' },
  cnn: { primary: '#cc0000', background: '#f9f9f9' },
  'fox-news': { primary: '#003366', background: '#e9eef4' },
  default: { primary: '#333', background: '#f5f5f5' },
};

const HomeScreen = ({ navigation }) => {
  const [headlines, setHeadlines] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [channel, setChannel] = useState('');
  const [channelName, setChannelName] = useState('News');
  const [featuredNews, setFeaturedNews] = useState([]);

  const channels = [
    { name: 'BBC', id: 'bbc-news' },
    { name: 'CNN', id: 'cnn' },
    { name: 'Fox News', id: 'fox-news' },
  ];

  const theme = channelColors[channel] || channelColors.default;

  useEffect(() => {
    fetchHeadlines(channel);
  }, [channel]);

  const fetchHeadlines = async (channel) => {
    try {
      const response = channel
        ? await axios.get(`${BASE_URL}/top-headlines`, {
            params: { sources: channel, apiKey: API_KEY },
          })
        : await axios.get(`${BASE_URL}/top-headlines`, {
            params: { country: 'us', apiKey: API_KEY },
          });

      const validArticles = response.data.articles.filter(
        (article) => article.title && article.url && article.urlToImage // Filter out articles missing title, URL, or image
      );

      setHeadlines(validArticles);
      setFeaturedNews(validArticles.slice(0, 5)); // Use the first 5 articles as featured news
    } catch (error) {
      console.error('Error fetching headlines:', error);
    }
  };

  const renderHeadline = ({ item }) => (
    <TouchableOpacity
      style={[styles.articleContainer, { backgroundColor: theme.background }]}
      onPress={() => navigation.navigate('Details', { article: item })}
    >
      {item.urlToImage && (
        <Image source={{ uri: item.urlToImage }} style={styles.articleImage} />
      )}
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.primary }]}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFeaturedNews = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Details', { article: item })}>
      <Image source={{ uri: item.urlToImage }} style={styles.featuredImage} />
      {/* Overlay text inside the image, limited to image width */}
      <View style={styles.overlay}>
        <Text style={styles.featuredTitle} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const selectChannel = (channelId, name) => {
    setChannel(channelId);
    setChannelName(name);
    toggleModal();
  };

  const backToHome = () => {
    setChannel('');
    setChannelName('News');
    toggleModal();
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: channelName,
      headerStyle: { backgroundColor: theme.primary },
      headerTintColor: '#fff',
      headerRight: () => (
        <TouchableOpacity onPress={toggleModal}>
          <Ionicons name="ellipsis-horizontal" size={24} color="white" style={{ marginRight: 15 }} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, channelName]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Horizontal Header Slider with gap */}
      <FlatList
        data={featuredNews}
        renderItem={renderFeaturedNews}
        keyExtractor={(item, index) => `featured-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        decelerationRate="fast"
        pagingEnabled
        ItemSeparatorComponent={() => <View style={{ width: 10 }} />} // Adds gap between images
      />

      {/* Article List */}
      <FlatList
        data={headlines}
        renderItem={renderHeadline}
        keyExtractor={(item, index) => item.url ? `${item.url}-${index}` : index.toString()}
      />

      {/* Channel Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a News Channel</Text>
            {channels.map((channel) => (
              <TouchableOpacity key={channel.id} onPress={() => selectChannel(channel.id, channel.name)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>{channel.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={backToHome} style={styles.modalButton}>
              <Text style={[styles.modalButtonText, { color: 'red' }]}>Back to Home</Text>
            </TouchableOpacity>
            <Button title="Close" onPress={toggleModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  articleContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  articleImage: {
    width: 100,
    height: 80,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  description: { marginTop: 5, fontSize: 14, color: '#555' },
  featuredImage: {
    width: screenWidth * 0.8,
    height: 200,
    borderRadius: 10,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  featuredTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalButton: { marginVertical: 5 },
  modalButtonText: { fontSize: 16, color: '#6200ee' },
});

export default HomeScreen;


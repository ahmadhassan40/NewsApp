// screens/CategoryScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { API_KEY, BASE_URL } from '../config';

const CategoryScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchCategoryNews = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/top-headlines`, {
          params: { category, country: 'us', apiKey: API_KEY },
        });
        setArticles(response.data.articles);
      } catch (error) {
        console.error('Error fetching category news:', error);
      }
    };

    fetchCategoryNews();
  }, [category]);

  const renderArticle = ({ item }) => (
    <TouchableOpacity
      style={styles.articleContainer}
      onPress={() => navigation.navigate('Details', { article: item })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={articles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.url}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  articleContainer: { marginBottom: 15, padding: 10, backgroundColor: '#f8f8f8', borderRadius: 5 },
  title: { fontSize: 18, fontWeight: 'bold' },
  description: { marginTop: 5, fontSize: 14 },
});

export default CategoryScreen;

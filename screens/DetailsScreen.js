// screens/DetailsScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const DetailsScreen = ({ route }) => {
  const { article } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {article.urlToImage && (
        <Image source={{ uri: article.urlToImage }} style={styles.image} />
      )}
      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.author}>By {article.author || 'Unknown'}</Text>
      <Text style={styles.content}>{article.content || article.description}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  image: { width: '100%', height: 200, marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  author: { fontSize: 16, fontStyle: 'italic', marginBottom: 10 },
  content: { fontSize: 16, color: '#333' },
});

export default DetailsScreen;

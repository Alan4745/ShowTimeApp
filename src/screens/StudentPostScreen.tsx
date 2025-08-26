import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import ContentContainer from '../components/common/ContentContainer';
import ScreenLayout from '../components/common/ScreenLayout';
import Post from '../components/common/Post';

//provisional
import commentsData from '../data/comments.json';
import postsData from '../data/posts.json';

export default function StudentPostScreen() {
  
  return (
    <ScreenLayout>
      <ContentContainer style={styles.container}>
          <Post postsData={postsData} commentsData={commentsData}></Post>
      </ContentContainer>    
    </ScreenLayout>
        
  )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#000000",
    }
})
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import React from 'react';
import ContentContainer from '../components/common/ContentContainer';
import ScreenLayout from '../components/common/ScreenLayout';
import Post from '../components/common/Post';

//provisional
import commentsData from '../data/comments.json';
import postsData from '../data/posts.json';

export default function StudentPostScreen({route}) {
  const {postId} = route.params;

  const post = postsData.find((p) => p.id === postId);
  const postComments = commentsData.filter((comment) => comment.postId === postId)

  const CommentCard = ({ comment }) => (
      <>
        <View style={styles.commentHeader}>
          <Image source={require('../../assets/img/avatarFarleyCastro.png')} style={styles.avatar} />
          <View>
            <Text style={styles.commentAuthor}>{comment.author}</Text>
            <Text style={styles.userType}>{comment.userType}</Text>
          </View>        
        </View>
        
        <View style={styles.postContent}>
          <Text style={styles.postText}>{comment.text}</Text>
        </View>      
      </>
    );
  
  return (
    <ScreenLayout>
      <ContentContainer style={styles.container}>
          <FlatList
          ListHeaderComponent={<Post post={post} />}
          data={postComments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CommentCard comment={item} />}
          showsVerticalScrollIndicator={false}
          />
      </ContentContainer>    
    </ScreenLayout>
        
  )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#000000",
        paddingTop: 35,
    },
    commentHeader:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8   
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginRight: 12,
    marginTop: 10,
  },
  commentAuthor: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: "700",
    fontSize: 16,
    color:"#FFFFFF",
  },
  userType: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 14,
    color: "#FFFFFF",    
  },
  postContent: {
    paddingHorizontal: 10,
    marginBottom: 10,  
  },
  postText:{
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 16,
    color: "#FFFFFF",
  }
})
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { MessageCircle, Heart, Bookmark, BookmarkCheck } from 'lucide-react-native';

export default function Post({postsData, commentsData}) {
  const [bookmarked, setBookmarked] = React.useState(false);

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
  }

  const PostCard = ({ post }) => (
    <>      
      <View style={styles.postHeader}>
        <Image source={require('../../../assets/img/avatarPedro30.png')} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.username}</Text>
          <Text style={styles.userType}>{post.userType}</Text>          
        </View>                
      </View>
      <View style={styles.postContent}>
        <Text style={styles.postText}>{post.text}</Text>      
        <Image source={require('../../../assets/img/post1.png')} style={styles.postImage} resizeMode="cover" />
        {/*SECCIÓN DE ÍCONOS*/}
        <View style={styles.iconRow}>
          <View style={styles.iconItem}>
            <MessageCircle size={20} color="#FFFFFF" />
            <Text style={styles.iconText}>{post.commentsCount}</Text>
          </View>
          <View style={styles.iconItem}>
            <Heart size={20} color="#FFFFFF" />
            <Text style={styles.iconText}>{post.likesCount}</Text>
          </View>
          <View style={styles.iconItem}>
            <TouchableOpacity onPress={toggleBookmark}>
              {bookmarked ? (<BookmarkCheck size={20} color="#FFFFFF" />) : (<Bookmark size={20} color="#FFFFFF"/>
              )}
            </TouchableOpacity>           
          </View>
        </View>
      </View>      
    </>
  );

  const CommentCard = ({ comment }) => (
    <>
      <View style={styles.commentHeader}>
        <Image source={require('../../../assets/img/avatarFarleyCastro.png')} style={styles.avatar} />
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
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* Sección de Posts con altura limitada y scroll interno */}
      <View style={{ height: 400 }}>
        <FlatList
          data={postsData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PostCard post={item} />}
          scrollEnabled={true} 
        />
      </View>     
    </ScrollView>
  );
}

const styles = StyleSheet.create({  
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,    
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginRight: 12,
    marginTop: 10,
  },
  userInfo: {
    flexDirection: 'column',    
  },
  username: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 16,
    color: "#FFFFFF",
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
  },
  postImage: {
    width: '100%',
    maxHeight: 237,
  },  
  commentHeader:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,   
  },
  commentAuthor: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: "700",
    fontSize: 16,
    color:"#FFFFFF",
  },
  iconRow: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  marginTop: 10,
},
iconItem: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 5, 
},
iconText: {
  color: '#FFFFFF',
  fontSize: 14,
  marginLeft: 4,
  fontFamily: 'AnonymousPro-Regular',
},
});




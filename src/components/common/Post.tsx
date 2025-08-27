import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MessageCircle, Heart, Bookmark, BookmarkCheck } from 'lucide-react-native';
import MediaGrid from './MediaGrid';
import MediaViewerModal from '../modals/MediaViewerModal';


export default function Post({post, onPressComments}) {
  const [bookmarked, setBookmarked] = React.useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const toggleBookmark = () => {setBookmarked(!bookmarked)};  

  return (
    <>      
      <View style={styles.postHeader}>
        <Image source={require('../../../assets/img/avatarPedro30.png')} style={styles.avatar}/>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.username}</Text>
          <Text style={styles.userType}>{post.userType}</Text>          
        </View>                
      </View>
      <View style={styles.postContent}>
        {/* Texto */}
        {!!post.text && <Text style={styles.postText}>{post.text}</Text>}

        {/* Imagen  y Video*/}
        <MediaGrid media={post.media} onMediaPress={setSelectedMedia}/>
        
        
        {/*SECCIÓN DE ÍCONOS*/}
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconItem} onPress={onPressComments}>
            <MessageCircle size={20} color="#FFFFFF" />
            <Text style={styles.iconText}>{post.commentsCount}</Text>
          </TouchableOpacity>
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
      <MediaViewerModal
        visible={!!selectedMedia}
        media={selectedMedia}
        onClose={() => setSelectedMedia(null)}
      />      
    </>         
    
  );
}

const styles = StyleSheet.create({
  container:{
    height: "100%",
    padding: 10,
  },  
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
    marginBottom: 15,
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




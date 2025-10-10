import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MessageCircle, Heart, Bookmark, BookmarkCheck } from 'lucide-react-native';
import MediaGrid from './MediaGrid';
import MediaViewerModal from '../modals/MediaViewerModal';

type MediaItem = {
  id?: string;
  mediaType: 'image' | 'video' | 'audio' | 'pdf';
  uri: string;
  thumbnailUrl: string;
  title?: string;
  author?: string;
  description?: string;
  subcategory?: string;
  format?: string;
  likes?: number;
  comments?: number;
};

type PostType = {
  id: string;
  username: string;
  userType: string;
  avatar: string;
  text: string;
  commentsCount: number;
  likesCount: number;
  media: MediaItem[];
  likedByMe: boolean;
};

type PostProps = {
  post: PostType;
  onPressComments: () => void;
  onAddComment?: () => void;
  showCommentButton?: boolean;
  onToggleLike: () => void;
  liking?: boolean; // <-- desactiva el botón mientras se hace la petición, evita doble click
};

export default function Post({post, onPressComments, onAddComment, showCommentButton = false, onToggleLike, liking}: PostProps) {
  if (!post) return null; // <-- Protección contra undefined
  const [bookmarked, setBookmarked] = React.useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const toggleBookmark = () => {setBookmarked(!bookmarked)};  

  return (
    <View style = {styles.container}>      
      <View style={styles.postHeader}>
        <View style={styles.infoContainer}>
          <Image 
            source={post.avatar? {uri: post.avatar} : require('../../../assets/img/userGeneric.png')} 
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.username}>{post.username}</Text>
            <Text style={styles.userType}>{post.userType}</Text>          
          </View>  
        </View>
        {/* Botón si showCommentButton está activado */}
        {showCommentButton && (
          <TouchableOpacity style={styles.commentButton} onPress={onAddComment}>
            <Text style={styles.commentText}>Comment</Text>
          </TouchableOpacity>
        )}              
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
          <TouchableOpacity style={styles.iconItem} onPress={onToggleLike} disabled={liking}>
            <Heart 
              size={20} 
              color= "#FFFFFF" 
              fill = {post.likedByMe ? "#FFFFFF" : "none"}
            />
            <Text style={styles.iconText}>{post.likesCount}</Text>
          </TouchableOpacity>
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
    </View>         
    
  );
}

const styles = StyleSheet.create({
  container:{
    width: "100%",    
    marginVertical: 10,      
  },  
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",  
    paddingHorizontal: 20,  
    marginBottom: 25,    
  },
  infoContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,    
    marginTop: 10,
  },
  userInfo: {
    flexDirection: 'column',    
  },
  username: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 16,
    color: "#FFFFFF",
  },
  userType: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 14,
    color: "#FFFFFF",    
  },
  commentButton: {
    width: "30%",
    backgroundColor: "#2B80BE",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    paddingVertical: 5
  },
  commentText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 18,
    lineHeight: 24,
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
    marginLeft: 10,
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




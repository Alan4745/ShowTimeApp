import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PlayCircle } from 'lucide-react-native';
import MediaViewerModal from '../modals/MediaViewerModal'; 

interface CoachCardProps {
  title?: string;
  name?: string;
  imageUrl?: string;
  tag?: string;
  onMorePress?: () => void;
  style?: any;
  children?: React.ReactNode;
  isVideo?: boolean;
  mediaUrl?: string; 
}

function truncateText(text: string, maxLength: number) {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

export default function CoachCard(props: CoachCardProps) {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const handlePressMedia = () => {
    if (props.isVideo) {
      setModalVisible(true);
    }
  };

  return (
    <View style={[styles.card, props.style]}>
      {props.imageUrl ? (
        <>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handlePressMedia}
            style={{ flex: 1 }}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: props.imageUrl }}
                style={styles.imageTop}
                resizeMode="cover"
              />

              {props.isVideo && (
                <View style={styles.playOverlay}>
                  <PlayCircle size={48} color="#fff" />
                </View>
              )}

              {props.tag && (
                <View style={styles.overlayContainer}>
                  <Text style={styles.overlayText}>{props.tag}</Text>
                </View>
              )}
            </View>

            <View style={styles.contentBottom}>
              {props.title && <Text style={styles.title}>{props.title}</Text>}
              {props.name && <Text style={styles.name}>{props.name}</Text>}
              {props.children && (
                <Text style={styles.children}>
                  {truncateText(String(props.children), 110)}{/* corta texto largo */}
                  <Text style={styles.more} onPress={props.onMorePress}>
                    {' '}... {t('common.more')}
                  </Text>
                </Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Modal para mostrar el video */}
          {props.isVideo && props.mediaUrl && (
            <MediaViewerModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              media={{
                id: 'temp',
                mediaType: 'video',
                uri: props.mediaUrl,
                title: props.title || '',
                author: props.name || '',
              }}
              showInfo
            />
          )}
        </>
      ) : (
        <View style={styles.content}>
          {props.title && <Text style={styles.title}>{props.title}</Text>}
          {props.name && <Text style={styles.name}>{props.name}</Text>}
          {props.children && (
            <ScrollView
              style={{ maxHeight: '90%' }}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.children}>
                {props.children}{' '}
                <Text style={styles.more} onPress={props.onMorePress}>
                  {t('common.more')}
                </Text>
              </Text>
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#252A30',
    height: 450,
    maxHeight: 450,       
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '50%',
  },
  playOverlay: {
    position: 'absolute',
    top: '40%',
    left: '45%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 30,
    padding: 4,
  },
  overlayContainer:{
    position: 'absolute',
    top: 20,
    left: 20,
    width: 85,
    height: 35,
    backgroundColor: '#2B80BE', 
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center"
  },
  overlayText: {
    color: '#FFFFFF',
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,    
    fontFamily: 'AnonymousPro-Regular',
  },
  imageTop: {
    width: '100%',
    height: "100%", 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  contentBottom: {
    padding: 25,
    backgroundColor: '#252A30',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  content: {
    padding: 25,
    flex: 1,
  },
  title: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  name: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  children:{
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    marginBottom: 8,  
    lineHeight: 22,
  },
  more: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 16,
    color: '#2B80BE',
    fontWeight: '700',
    //textDecorationLine: 'underline',
  },
});

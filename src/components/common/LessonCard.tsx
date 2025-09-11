import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PlayCircle, Mic, Lock } from 'lucide-react-native';
import { createThumbnail } from 'react-native-create-thumbnail';

type MediaItem = {
  type: 'image' | 'video' | 'audio';
  uri: string;
  title?: string;
  author?: string;
  description?: string;
  subcategory?: string;
  format?: string;  
};

interface LessonCardProps {
  title: string;
  author: string;
  description: string;
  subcategory?: string;
  format?: string;
  mediaType: 'image' | 'video' | 'audio';
  mediaUrl: string;
  thumbnailUrl?: string;  
  onOpenMedia?: (media: MediaItem) => void;
}

export default function LessonCard(props: LessonCardProps) {
  const {t} = useTranslation();
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const audioPlaceholder = require('../../../assets/img/audioPlaceholder.png');
  const {
    title,
    author,
    description,
    subcategory,
    format,
    mediaType,
    mediaUrl,
    thumbnailUrl,    
    onOpenMedia,
  } = props;

  // Este effect se encarga de generar el thumbnail según el tipo de media
  useEffect(() => {
    if (mediaType === 'video') {
      createThumbnail({ url: mediaUrl })
        .then((response) => setThumbnail(response.path))
        .catch((err) => {
          console.warn('Error generating video thumbnail:', err);
          setThumbnail('https://via.placeholder.com/300x200.png?text=Video');
        });
    } else if (mediaType === 'image') {
      setThumbnail(mediaUrl);
    } else {
      // audio u otro
      setThumbnail(null);
    }
  }, [mediaType, mediaUrl]);


  const renderOverlay = () => {    

    if (mediaType === 'video') {
      return (
        <View style={styles.overlayIcon}>
          <PlayCircle size={36} color="#FFF" />
        </View>
      );
    }

    if (mediaType === 'audio') {
      return (
        <View style={styles.overlayIcon}>
          <Mic size={36} color="#FFF"/>
        </View>
      );
    }

    return null;
  };

  const handleMediaPress = () => {
    if (!onOpenMedia) return;

    onOpenMedia({
      type: mediaType,
      uri: mediaUrl,
      title,
      author,
      description,
      subcategory,
      format,      
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.author}>{t("common.by")}{author}</Text>
        <Text style={styles.description} numberOfLines={3}>{description}</Text>

        <View style={styles.labelRow}>
          <View style={styles.firstLabel}>
            <Text style={styles.firstLabelText}>{subcategory ?? " "}</Text>
          </View>
          <View style={styles.secondLabel}>
            <Text style={styles.secondLabelText}>{format ?? " "}</Text>
          </View>
        </View>
      </View>

      <View style={styles.mediaContainer}>
        <TouchableOpacity
          style={styles.mediaTouch}
          onPress={handleMediaPress}          
        >
          {mediaType === 'audio' ? (
            <Image source={audioPlaceholder} style={styles.media} resizeMode="cover" />
          ) : (
            thumbnail && (
              <Image source={{ uri: thumbnail }} style={styles.media} resizeMode="cover" />
            )
          )}
          {renderOverlay()}            
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 20,
    backgroundColor: '#252A30',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    height: 220,
    alignItems: "center",
    paddingHorizontal: 15,
  },
  content: {
    width: "50%",
    height: "100%",
    paddingTop: 20,
    paddingRight: 5,
    position: "relative",
  },
  title: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: "700",
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  author: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 12,
    color: '#BCBCBC',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#CCCCCC',
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    marginBottom: 12,
    lineHeight: 20,
  },
  labelRow: {
    position: "absolute",
    flexDirection: 'row',
    justifyContent: 'space-between',
    bottom: 15,
    marginBottom: 5,
    gap: 7,
  },
  firstLabel: {
    width: 95,
    backgroundColor: '#2B80BE',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  firstLabelText: {
    color: '#FFFFFF',
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 14,
  },
  secondLabel: {
    width: 95,
    borderColor: '#FFFFFF',
    borderWidth: 1.5,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  secondLabelText: {
    color: '#FFFFFF',
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 14,
  },
  mediaContainer: {
    width: "45%",
    height: "85%",
    borderRadius: 10,
    overflow: "hidden",
  },
  mediaTouch: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  media: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  overlayIcon: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.4)',
    ...StyleSheet.absoluteFillObject,
  },
  lockOverlay: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.6)',
    ...StyleSheet.absoluteFillObject,
  },
  lockText: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "AnonymousPro-Regular",
    marginTop: 4,
  },
});

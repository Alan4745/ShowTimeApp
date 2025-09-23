import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PlayCircle, Mic } from 'lucide-react-native';
import { createThumbnail } from 'react-native-create-thumbnail';

type MediaItem = {
  id: string;
  type: 'image' | 'video' | 'audio';
  uri: string;
  title?: string;
  author?: string;
  description?: string;
  subcategory?: string;
  format?: string;  
  likes?: number;
  comments?: number;
};

interface LessonCardProps {
  id: string,
  title: string;
  author: string;
  description: string;
  subcategory?: string;
  format?: string;
  mediaType: 'image' | 'video' | 'audio';
  mediaUrl: string;
  thumbnailUrl?: string;  
  onOpenMedia?: (media: MediaItem) => void;
  cardHeight?: number;
}

export default function LessonCard(props: LessonCardProps) {
  const {t} = useTranslation();
  const { cardHeight = 220 } = props;
  const isCompact = cardHeight < 220;
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const audioPlaceholder = require('../../../assets/img/audioPlaceholder.png');
  const {
    id,
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
      id,
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
    <View style={[styles.card, {height: cardHeight, maxWidth: isCompact? 350 : "100%"}]}>
      <View style={styles.content}>
        <Text style={[styles.title, {fontSize: isCompact? 14: 18}]}>{title}</Text>
        {!isCompact && (
          <Text style={styles.author}>
            {t("common.by")}{author}
          </Text>
        )}
        <ScrollView
          style={[styles.descriptionScroll, {maxHeight: isCompact? 40: 55}]}
          contentContainerStyle={styles.descriptionContent}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}  
        >
          <Text style={[styles.descriptionText, {fontSize: isCompact? 12: 14}]}>{description}</Text>
        </ScrollView>        

        <View style={styles.labelRow}>
          <View style={[styles.firstLabel, {width: isCompact? 90: 102}]}>
            <Text style={[styles.firstLabelText, {fontSize: isCompact? 12: 14}]}>{subcategory ?? " "}</Text>
          </View>
          <View style={[styles.secondLabel, {width: isCompact? 78: 90}]}>
            <Text style={[styles.secondLabelText, {fontSize: isCompact? 12: 14}]}>{format ?? " "}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.mediaContainer, { height: isCompact ? 120 : "85%",
        width: isCompact ? 120 : "45%", marginLeft: isCompact ? 10 : 0
       }]}>
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
    width: "100%",
    flexDirection: "row",
    gap: 20,
    backgroundColor: '#252A30',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,    
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
    color: '#FFFFFF',
    marginBottom: 6,
  },
  author: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 12,
    color: "#BCBCBC",    
    marginBottom: 6,
  },
  descriptionScroll: {
    maxHeight: 55, 
    marginTop: 5,
  },
  descriptionContent: {
    paddingRight: 4, // para no cortar texto si aparece scrollbar
  },
  descriptionText: {
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
  },
  secondLabel: {    
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

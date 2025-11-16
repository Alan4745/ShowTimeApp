import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {PlayCircle, Mic, FileText} from 'lucide-react-native';
// ActivityIndicator removed — not used after simplifying PDF preview
import {createThumbnail} from 'react-native-create-thumbnail';
import {buildMediaUrl} from '../../utils/urlHelpers';

type MediaItem = {
  id: string;
  mediaType: 'image' | 'video' | 'audio' | 'pdf';
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
  id: string;
  title: string;
  author: string;
  description: string;
  subcategory?: string;
  format?: string;
  mediaType: 'image' | 'video' | 'audio' | 'pdf';
  mediaUrl: string;
  thumbnailUrl?: string;
  onOpenMedia?: (media: MediaItem) => void;
  cardHeight?: number;
}

export default function LessonCard(props: LessonCardProps) {
  const {t} = useTranslation();
  const {cardHeight = 220} = props;
  const isCompact = cardHeight < 220;
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  // Note: removed in-card PDF rendering (react-native-pdf) because it
  // depends on native blob utilities that can fail with certain TLS setups.
  // We show a static PDF icon + title and open the PDF in the modal viewer instead.
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

  // Asegurar URLs absolutas desde el inicio
  const absoluteMediaUrl = buildMediaUrl(mediaUrl);
  const absoluteThumbnailUrl = thumbnailUrl
    ? buildMediaUrl(thumbnailUrl)
    : null;

  // Este effect se encarga de generar el thumbnail según el tipo de media
  useEffect(() => {
    if (mediaType === 'video') {
      // Si ya hay thumbnail en backend se usa aquí
      if (absoluteThumbnailUrl) {
        setThumbnail(absoluteThumbnailUrl);
      } else {
        // Si no, genera localmente
        createThumbnail({url: absoluteMediaUrl})
          .then(response => setThumbnail(response.path))
          .catch(err => {
            console.warn('Error generating video thumbnail:', err);
            setThumbnail(Image.resolveAssetSource(audioPlaceholder).uri);
          });
      }
    } else if (mediaType === 'image') {
      setThumbnail(absoluteMediaUrl);
    } else if (mediaType === 'pdf') {
      // don't generate thumbnail for pdfs here; show PDF icon in card
      setThumbnail(null);
    } else {
      setThumbnail(null);
    }
  }, [mediaType, absoluteMediaUrl, absoluteThumbnailUrl, audioPlaceholder]);

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
          <Mic size={36} color="#FFF" />
        </View>
      );
    }

    return null;
  };

  const handleMediaPress = () => {
    if (!onOpenMedia) {
      return;
    }

    onOpenMedia({
      id,
      mediaType,
      uri: buildMediaUrl(mediaUrl),
      title,
      author,
      description,
      subcategory,
      format,
    });
  };

  const renderMediaPreview = () => {
    if (mediaType === 'audio') {
      return (
        <Image
          source={audioPlaceholder}
          style={styles.media}
          resizeMode="cover"
        />
      );
    }
    if (mediaType === 'pdf') {
      // Simple PDF card preview: icon + title (avoid native pdf rendering here)
      return (
        <View style={styles.pdfPreview}>
          <FileText size={44} color="#D44638" />
          <Text style={styles.pdfLabel} numberOfLines={2} ellipsizeMode="tail">
            {title}
          </Text>
        </View>
      );
    }
    if (thumbnail) {
      return (
        <Image
          source={{uri: thumbnail}}
          style={styles.media}
          resizeMode="cover"
        />
      );
    }
    return null;
  };
  return (
    <View
      style={[
        styles.card,
        {height: cardHeight, maxWidth: isCompact ? 350 : '100%'},
      ]}>
      <View style={styles.content}>
        <Text style={[styles.title, {fontSize: isCompact ? 12 : 14}]}>
          {title}
        </Text>
        {!isCompact && (
          <Text style={styles.author}>
            {t('common.by')}
            {author}
          </Text>
        )}
        <ScrollView
          style={[styles.descriptionScroll, {maxHeight: isCompact ? 60 : 65}]}
          contentContainerStyle={styles.descriptionContent}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}>
          <Text
            style={[styles.descriptionText, {fontSize: isCompact ? 12 : 14}]}>
            {description}
          </Text>
        </ScrollView>

        <View style={styles.labelRow}>
          <View style={[styles.firstLabel, {width: isCompact ? 85 : 85}]}>
            <Text
              style={[styles.firstLabelText, {fontSize: isCompact ? 10 : 10}]}>
              {subcategory ?? ' '}
            </Text>
          </View>
          <View style={[styles.secondLabel, {width: isCompact ? 78 : 85}]}>
            <Text
              style={[styles.secondLabelText, {fontSize: isCompact ? 10 : 10}]}>
              {format ?? ' '}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.mediaContainer,
          {
            height: isCompact ? 120 : '85%',
            width: isCompact ? 120 : '40%',
            marginLeft: isCompact ? 10 : 0,
          },
        ]}>
        <TouchableOpacity style={styles.mediaTouch} onPress={handleMediaPress}>
          {renderMediaPreview()}
          {renderOverlay()}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    flexDirection: 'row',
    gap: 50,
    backgroundColor: '#252A30',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  content: {
    width: '45%',
    height: '100%',
    paddingTop: 20,
    paddingRight: 5,
    position: 'relative',
  },
  title: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  author: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    color: '#BCBCBC',
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
    fontWeight: '400',
    marginBottom: 12,
    lineHeight: 16,
  },
  labelRow: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    bottom: 15,
    marginBottom: 5,
    gap: 7,
  },
  firstLabel: {
    backgroundColor: '#2B80BE',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstLabelText: {
    color: '#FFFFFF',
    fontFamily: 'AnonymousPro-Regular',
  },
  secondLabel: {
    borderColor: '#FFFFFF',
    borderWidth: 1.5,
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondLabelText: {
    color: '#FFFFFF',
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 8,
  },
  mediaContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  mediaTouch: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  pdfPreview: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 8,
  },
  pdfLabel: {
    marginTop: 8,
    color: '#333333',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 6,
  },
  pdfPdf: {
    width: '100%',
    height: '100%',
  },
  pdfLoader: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 5,
  },
  overlayIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    ...StyleSheet.absoluteFillObject,
  },
  lockOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    ...StyleSheet.absoluteFillObject,
  },
  lockText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'AnonymousPro-Regular',
    marginTop: 4,
  },
});

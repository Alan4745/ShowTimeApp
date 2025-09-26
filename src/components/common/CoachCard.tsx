import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

interface CoachCardProps {
  title?: string;
  name?: string;
  imageUrl?: string;
  tag?: string;
  onMorePress?: () => void;
  style?: any;
  children?: React.ReactNode;
}

export default function CoachCard(props: CoachCardProps) {
  const {t} = useTranslation();

  return (
    <View style={[styles.card, props.style]}>
      {props.imageUrl ? (
        // Con imagen
        <View style={{ flex: 1}}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: props.imageUrl }}
              style={styles.imageTop}
              resizeMode="cover"
            />
            <View style={styles.overlayContainer}>
              <Text style={styles.overlayText}>{props.tag}</Text>
            </View>            
          </View>
          <View style={styles.contentBottom}>
            {props.title && <Text style={styles.title}>{props.title}</Text>}
            {props.name && <Text style={styles.name}>{props.name}</Text>}
            {props.children && (
              <ScrollView
                style={{ maxHeight: "65%" }} 
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.children}>
                  {props.children}
                  {' '}
                  <Text style={styles.more} onPress={props.onMorePress}>
                    {t('common.more')}
                  </Text>
                </Text>
              </ScrollView>  
            )}

          </View>          
        </View>       
      ) : (
        // sin imagen
        <View style={styles.content}>
          {props.title && <Text style={styles.title}>{props.title}</Text>}
          {props.name && <Text style={styles.name}>{props.name}</Text>}
          {props.children && (
            <ScrollView
              style={{ maxHeight: "90%" }} 
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.children}>
                {props.children}
                {' '}
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

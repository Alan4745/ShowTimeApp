import React  from 'react';
import { View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CoachCard from '../components/common/CoachCard';
import contentData from '../data/contentData.json';

export default function CoachesTabScreen() {   
  const navigation = useNavigation();
  const renderContent = ({item} : {item: typeof contentData[0]}) => (
    <CoachCard
      title={item.title}
      name={item.name}
      tag={item.tag}
      imageUrl={item.imageUrl}
      style={{marginHorizontal: 5}}
      onMorePress={() =>
        (navigation as any).navigate('CoachDetails', {
          id: item.id,
        })
      }
    >
      {item.description}
    </CoachCard>
  );  

  return (
    <FlatList
      data={contentData}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderContent}
      ItemSeparatorComponent={() => <View style={{ height: 20 }} />}      
    />    
  );
}


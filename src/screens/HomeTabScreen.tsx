import React, {useState, useEffect} from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Post from '../components/common/Post';
import SearchBar from '../components/form/SearchBar';

//provisional
import postsData from '../data/posts.json';

export default function HomeTabScreen() { 
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(postsData);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    setFilteredPosts(
      query === ''
        ? postsData
        : postsData.filter(post => post.text.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const renderItem = ({ item }) => (
    <>
      <Post post={item} onPressComments={() => navigation.navigate('StudentPost', { postId: item.id })} />     
    </> 
  );

  return (
    <View style={styles.container}>
       <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={"Search"}        
      />     
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        scrollEnabled={true} 
      /> 

       <TouchableOpacity
        style={styles.button}
          onPress={() => {
            // acción al presionar el botón, ejemplo:
            console.log("FAB presionado");
          }}
       >
          <Text style={styles.buttonText}>＋</Text>
       </TouchableOpacity>  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  }, 
  button: {
    position: 'absolute',
    right: 20,
    bottom: 10,
    backgroundColor: '#2B80BE',
    width: 73,
    height: 73,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',    
    zIndex: 999,
  },
  buttonText: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 30,
    color: '#FFFFFF',
    lineHeight: 30,
  },
  noResults:{
    color: '#999',
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,  
  }
});

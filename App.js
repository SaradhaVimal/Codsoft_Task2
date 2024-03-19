import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Share } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [Quote, setQuote] = useState('Loading...');
  const [Author, setAuthor] = useState('Loading...');
  const [SavedQuotes, setSavedQuotes] = useState([]);
  const [showSavedQuotes, setShowSavedQuotes] = useState(false);

  useEffect(() => {
    randomQuote();
    loadSavedQuotes();
  }, []);

  const randomQuote = () => {
    fetch("https://api.quotable.io/random")
      .then(res => res.json())
      .then(result => {
        setQuote(`"${result.content}"`);
        setAuthor(result.author);
      })
      .catch(error => console.log(error));
  }

  const shareQuote = () => {
    Share.share({
      message: `${Quote} - ${Author}`
    })
      .then(result => console.log(result))
      .catch(errorMsg => console.log(errorMsg));
  }

  const saveQuote = async () => {
    try {
      const quoteToSave = { quote: Quote, author: Author };
      await AsyncStorage.setItem('savedQuotes', JSON.stringify([...SavedQuotes, quoteToSave]));
      setSavedQuotes([...SavedQuotes, quoteToSave]);
    } catch (error) {
      console.log(error);
    }
  }

  const deleteQuote = async (index) => {
    try {
      const updatedQuotes = SavedQuotes.filter((item, idx) => idx !== index);
      await AsyncStorage.setItem('savedQuotes', JSON.stringify(updatedQuotes));
      setSavedQuotes(updatedQuotes);
    } catch (error) {
      console.log(error);
    }
  }

  const loadSavedQuotes = async () => {
    try {
      const savedQuotes = await AsyncStorage.getItem('savedQuotes');
      if (savedQuotes !== null) {
        setSavedQuotes(JSON.parse(savedQuotes));
      }
    } catch (error) {
      console.log(error);
    }
  }

  const renderSavedQuotes = () => {
    return SavedQuotes.map((item, index) => (
      <View key={index} style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>{item.quote}</Text>
          <Text style={{ fontSize: 14, fontStyle: 'italic', color: '#000' }}>— {item.author}</Text>
        </View>
        <TouchableOpacity onPress={() => deleteQuote(index)} style={{ padding: 10, backgroundColor: 'red', borderRadius: 5 }}>
          <FontAwesome5 name="trash" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    ));
  }

  const toggleSavedQuotes = () => {
    setShowSavedQuotes(!showSavedQuotes);
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4CB6B6', // teal background color
      }}>
      <StatusBar barStyle="light-content" />
      <View style={{ alignItems: 'center', marginTop: 100 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome5 name="quote-left" style={{ fontSize: 20, color: '#000' }} />
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000', marginLeft: 10 }}>Q</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>uotes</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}> A</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>pp </Text>
          <FontAwesome5 name="quote-right" style={{ fontSize: 20, color: '#000' }} />
        </View>
      </View>
      <View>
        <Text style={{ color: '#000', fontSize: 20, lineHeight: 26, letterSpacing: 1.1, fontWeight: '400', textAlign: 'center', marginBottom: 10 }}>{Quote}</Text>
        <Text style={{ textAlign: 'right', fontWeight: 'bold', fontStyle: 'italic', fontSize: 16, color: '#000' }}>—— {Author}</Text>
        <TouchableOpacity onPress={randomQuote} style={{ backgroundColor: '#000', padding: 20, borderRadius: 30, marginVertical: 20 }}>
          <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center' }}>Next</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <TouchableOpacity onPress={saveQuote} style={{ flex: 1, borderWidth: 2, borderColor: '#fff', borderRadius: 50, justifyContent: 'center', alignItems: 'center', padding: 15, marginRight: 10 }}>
            <FontAwesome5 name="save" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={shareQuote} style={{ flex: 1, borderWidth: 2, borderColor: '#fff', borderRadius: 50, justifyContent: 'center', alignItems: 'center', padding: 15, marginLeft: 10 }}>
            <FontAwesome5 name="share" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleSavedQuotes} style={{ flex: 1, borderWidth: 2, borderColor: '#fff', borderRadius: 50, justifyContent: 'center', alignItems: 'center', padding: 15, marginLeft: 10 }}>
            <FontAwesome5 name={showSavedQuotes ? "bookmark" : "bookmark"} size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        {showSavedQuotes && (
          <>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#fff' }}>Saved Quotes:</Text>
            {renderSavedQuotes()}
          </>
        )}
      </View>
    </View>
  );
};

export default App;

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useChat } from '../../ChatContext/ChatContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ConversationMessages = () => {
  const route = useRoute();
  const { conversationId } = route.params;
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { messages, sendMessage, setConversationId } = useChat();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setConversationId(conversationId);
  }, [conversationId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          setUser(JSON.parse(userJson));
        } else {
          console.error('User not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Failed to fetch user from AsyncStorage:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = () => {
    if (user) {
      const newMessage = {
        senderId: user.id,
        receiverId: 2, 
        content: message,
        conversationId: Number(conversationId),
      };
      sendMessage(newMessage);
      setMessage('');
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    } else {
      console.error('User not logged in');
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isSentByUser = item.senderId === user?.id;
    return (
      <View
        style={[
          styles.messageContainer,
          isSentByUser ? styles.sentMessageContainer : styles.receivedMessageContainer,
        ]}
      >
        <Text
          style={[styles.message, isSentByUser ? styles.sentMessage : styles.receivedMessage]}
        >
          {item.content}
        </Text>
        {isSentByUser ? (
          <View style={styles.sentTailContainer}>
            <View style={styles.sentTail} />
          </View>
        ) : (
          <View style={styles.receivedTailContainer}>
            <View style={styles.receivedTail} />
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {user && (
        <View style={styles.header}>
          <Image source={{ uri: user.imagesProfile[0] }} style={styles.profileImage} />
          <Text style={styles.username}>{user.name}</Text>
        </View>
      )}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
        renderItem={renderItem}
        initialNumToRender={10}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={[styles.flatListContent, { paddingBottom: keyboardHeight }]} 
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message"
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Icon name="send" size={26} color="#007bff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  sentTailContainer: {
    position: 'absolute',
    bottom: 0,
    right: -10,
  },
  sentTail: {
    width: 20,
    height: 20,
    backgroundColor: '#007bff',
    transform: [{ rotate: '45deg' }],
  },
  receivedTailContainer: {
    position: 'absolute',
    bottom: 0,
    left: -10,
  },
  receivedTail: {
    width: 20,
    height: 20,
    backgroundColor: '#e1e1e1',
    transform: [{ rotate: '45deg' }],
  },
  messageContainer: {
    marginVertical: 10,
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    position: 'relative',
  },
  sentMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
  },
  receivedMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#e1e1e1',
  },
  message: {
    fontSize: 16,
  },
  sentMessage: {
    color: '#fff',
  },
  receivedMessage: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    marginBottom: 10, 
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#014043',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  profileImage: {
    marginTop: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
  },
});

export default ConversationMessages;

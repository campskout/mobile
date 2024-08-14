import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const ProductDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://192.168.10.4:5000/api/product/${id}`);
        const result = await response.json();
        
        if (response.ok) {
          setProduct(result.data);
        } else {
          setError(result.message || 'Something went wrong');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleSendMessage = () => {

    console.log('Message sent:', message);
    setMessage('');
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#fff" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.error}>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      {product && (
        <>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imageContainer}
          >
            {product.imageUrl.map((url: string, index: number) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: url }} style={styles.image} />
                {index === 0 && product.imageUrl.length > 1 && (
                  <Text style={styles.moreImages}>Swipe to see more</Text>
                )}
              </View>
            ))}
          </ScrollView>
          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.description}>{product.description}</Text>
            <Text style={styles.price}>{product.price} TND</Text>
            <Text style={styles.category}>{product.category}</Text>
            <View style={styles.userContainer}>
              <Image source={{ uri: product.user.imagesProfile }} style={styles.userImage} />
              <Text style={styles.user}>Posted by: {product.user.name}</Text>
            </View>
          </View>
          <View style={styles.messageCard}>
          <View style={styles.messageHeader}>
          <Icon name="message" size={24} color="#fff" style={styles.messageIcon} />
            <Text style={styles.messageTitle}>Send a message to the seller</Text>
            </View>
            <TextInput
              style={styles.messageInput}
              placeholder="Type your message here..."
              placeholderTextColor="#fff"
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#00595E',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00595E',
  },
  imageContainer: {
    marginBottom: 4,
    marginTop:15
  },
  imageWrapper: {
    width,
    height: 250,
    borderRadius: 10,
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  moreImages: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
    marginRight:35
  },
  detailsContainer: {
    marginBottom: 195,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  category: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  user: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  messageCard: {
    padding: 15,
    backgroundColor: '#004D40',
    borderRadius: 10,
    marginTop:-180
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  messageInput: {
    height: 50,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    color: '#fff',
    backgroundColor: '#00796B',
  },
  sendButton: {
    marginTop: 10,
    backgroundColor: '#B3492D',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  messageIcon: {
    marginRight: 10,
    marginBottom:6
  },
});

export default ProductDetails;

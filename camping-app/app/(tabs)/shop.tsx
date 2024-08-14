import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Pressable, TextInput, Dimensions, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const Shop = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://192.168.10.4:5000/api/product/getAll'); 
        const result = await response.json();

        if (Array.isArray(result.data)) {
          setProducts(result.data);
          console.log(result.data);
        } else {
          console.error('Expected an array but got:', result.data);
        }

        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearchIconPress = () => {
    console.log(`Search for: ${searchQuery}`);
  };

  const handleFilterPress = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleCategorySelect = (category) => {
    console.log(`${category} selected`);
    setDropdownVisible(false);
  };

  const handleMoreDetailsPress = (productId) => {
    router.push(`/ProductDetails/ProductDetails?id=${productId}`);
  };

  const handleSellProductPress = () => {
    console.log('Sell Product icon pressed');
    // Implement your sell product functionality here
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00796B" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading products: {error.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MarketPlace</Text>
      </View>
      {/* Interested to Sell Text with Add Icon */}
      <View style={styles.sellContainer}>
        <Text style={styles.sellText}>Interested To Sell Your Own Product !!</Text>
        <TouchableOpacity onPress={handleSellProductPress}>
          <View style={styles.addIconContainer}>
            <Icon name="add" size={30} color="#fff" style={styles.addIcon} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.search}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search In CampScout..."
          placeholderTextColor="#00796B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={handleSearchIconPress}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filter} onPress={handleFilterPress}>
          <Text style={styles.filterText}>Filter By Category</Text>
          <Icon name="filter-list" size={24} color="#00796B" />
        </TouchableOpacity>
        {dropdownVisible && (
          <View style={styles.dropdownMenu}>
            {categories.map(category => (
              <Pressable 
                key={category} 
                style={styles.dropdownItem} 
                onPress={() => handleCategorySelect(category)}
              >
                <Text style={styles.dropdownItemText}>{category}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
      <View style={styles.products}>
        {products
          .filter(product => 
            product.title && product.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(product => (
            <View key={product.id} style={styles.product}>
              <Image
                source={{ uri: product.imageUrl[0] }}
                style={styles.productImage}
              />
              <Text style={styles.productName}>{product.title || 'Untitled'}</Text>
              <Text style={styles.productPrice}>{product.price ? `${product.price} TND` : 'Price Unavailable'}</Text>
              <Text style={styles.productCategory}>{product.category || 'Unknown Category'}</Text>
              <TouchableOpacity 
                style={styles.productButton} 
                onPress={() => handleMoreDetailsPress(product.id)}
              >
                <Text style={styles.productButtonText}>More Details</Text>
              </TouchableOpacity>
            </View>
          ))
        }
      </View>
    </ScrollView>
  );
};

const categories = [
  'hikingEquipment',
  'clothing',
  'cookingSupplies',
  'safetyItems',
  'personalCareEssentials',
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 18
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#00796B',
  },
  searchIcon: {
    fontSize: 20,
    color: '#00796B',
    marginLeft: 10,
  },
  filterContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  filterText: {
    fontSize: 16,
    color: '#00796B',
    flex: 1,
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    position: 'absolute',
    top: 50, 
    left: 0,
    right: 0,
    zIndex: 10, 
  },
  dropdownItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#00595E',
  },
  dropdownItemText: {
    fontSize: 18,
    color: '#00595E',
  },
  products: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  product: {
    backgroundColor: '#014043',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: width - 40,
    overflow: 'hidden',
  },
  productImage: {
    width: 300,
    height: 200,
    borderRadius: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  productPrice: {
    fontSize: 16,
    color: '#fff',
  },
  productCategory: {
    fontSize: 14,
    color: '#B2DFDB',
  },
  productButton: {
    backgroundColor: '#B3492D',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  productButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sellContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B3492D',
    padding: 10,
    borderRadius: 10,
    marginVertical: 20,
  },
  sellText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    flex: 1,
  },
  addIconContainer: {
    backgroundColor: '#00796B',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00595E',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00595E',
  },
  errorText: {
    color: '#fff',
  },
});

export default Shop;

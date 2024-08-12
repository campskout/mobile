import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Button, Image,Modal } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JWT from 'expo-jwt';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useRouter } from 'expo-router';

const EditProfile = () => {
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [gender, setGender] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState({ id: '', name: '', email: '', role: '' });
  const [name, setName] = useState('');
  const [showInterests, setShowInterests] = useState(false);
  const [isDateOfBirthPickerVisible, setDateOfBirthPickerVisible] = useState(false);
  const [inputName,setInputName]=useState(false)
  const router = useRouter();
  const [defaultImg,setDefaultimg]=useState('')
  const [modalVisible, setModalVisible] = useState(false);
  const activities = ['Hitchhiking', 'Kayaking', 'Climbing', 'Hiking', 'Fishing'];
console.log(interests,'interest');

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };


  const handleActivityPress = (activity) => {
    if (!interests.includes(activity)) {
      setInterests([...interests, activity]);
    }
  };
//**************************** */

  const handleEditToggle = () => {
    setInputName(!inputName);
  };

  const handleNameChange = (text) => {
    setName(text);
  };

  const handleBlur = () => {
    setInputName(false);
    // Here you can add additional logic to save the name to a backend or state management system
  };

  const handleInterestPress = (interest) => {
    setGender(interest);
    setShowInterests(false);
    console.log(interest);
  };

  const handleProfileImagePress = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to choose an image.');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        console.log('Image picker result:', result);

        if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
          const selectedImageUri = result.assets[0].uri;
          setDefaultimg(selectedImageUri); 
      }} else {
        console.error('Image selection failed: No valid URI found');
        alert('There was an error selecting the image. Please try again.');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('An unexpected error occurred while picking the image. Please try again.');
    }
  };

  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append('dateOfBirth', dateOfBirth);
    formData.append('address', address);
    formData.append('bio', bio);
    formData.append('phoneNumber', phone);
    formData.append('id', user.id);
    formData.append('gender', gender);
    formData.append('name',name)
    formData.append('interests',interests)
    if (defaultImg) {
      const fileName = defaultImg.split('/').pop();
      const fileType = fileName.includes('.') ? `image/${fileName.split('.').pop()}` : 'image/jpeg';
      formData.append('imageProfile', {
        uri: defaultImg,
        name: fileName,
        type: fileType,
      });
    }
    
    try {
      const response = await axios.put(`http://192.168.10.6:5000/api/user/update/${user.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        alert('Profile updated successfully!');
        
        
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const showStartDatePicker = () => {
    setDateOfBirthPickerVisible(true);
  };

  const hideStartDatePicker = () => {
    setDateOfBirthPickerVisible(false);
  };

  const handleStartDateConfirm = (date) => {
    setDateOfBirth(date.toISOString());
    hideStartDatePicker();
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await AsyncStorage.getItem('token');
        if (data) {
          const token = data.startsWith('Bearer ') ? data.replace('Bearer ', '') : data;
          const key = 'mySuperSecretPrivateKey';

          try {
            const decodedToken = JWT.decode(token, key);
            if (decodedToken) {
              setUser({
                id: decodedToken.id || '',
                name: decodedToken.name || '',
                email: decodedToken.email || '',
                role: decodedToken.role || '',
              });
              setName(decodedToken.name || '');
              getOneUser(user.id)
            } else {
              console.error('Failed to decode token');
            }
          } catch (decodeError) {
            console.error('Error decoding token:', decodeError);
          }
        } else {
          console.error('Token not found in AsyncStorage');
        }
      } catch (storageError) {
        console.error('Failed to fetch token from AsyncStorage:', storageError);
      }
    };

    fetchUser();
  }, [refresh]);

  const getOneUser = async (id:string) => {
    // const id = user.id;
    try {
      const response = await axios.get(`http://192.168.10.6:5000/api/users/${id}`);
      const oneUser = response.data;
      console.log(oneUser,'oneuser home');
      
      setDefaultimg(oneUser.user.imagesProfile); // assuming the image URL is stored under the 'image' key
    } catch (error) {
      console.error('getOne EditPro',error);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {/* Header content */}
        <TouchableOpacity onPress={toggleModal} style={styles.iconButton}>
          <AntDesign name="setting" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.profilePicture}>
        <TouchableOpacity onPress={handleProfileImagePress} style={styles.profileImageContainer}>
          {defaultImg.length > 0 ? (
            <Image source={{ uri:  defaultImg }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImage} />
          )}
          <View style={styles.cameraIcon}>
            <AntDesign name="camera" size={24} color="white" />
          </View>
        </TouchableOpacity>
      <View style={styles.inputName}>
      {inputName ? (
        <TextInput
          style={styles.nameInput}
          value={name}
          onChangeText={handleNameChange}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <Text style={styles.name}>{name}</Text>
      )}
      <TouchableOpacity onPress={handleEditToggle} style={styles.editIcon}>
        <AntDesign name="edit" size={24} color="white" />
      </TouchableOpacity>
    </View>
      </View>
      <View style={styles.info}>
        
        {[
          { label: 'Address', value: address, setter: setAddress, placeholder: 'Enter your address' },
          { label: 'Bio', value: bio, setter: setBio, placeholder: 'Tell us about yourself', multiline: true, numberOfLines: 3 },
          { label: 'Phone', value: phone, setter: setPhone, placeholder: 'Enter your phone number', keyboardType: 'phone-pad' },
        ].map(({ label, value, setter, placeholder, keyboardType, multiline, numberOfLines }) => (
          <View key={label} style={styles.inputRow}>
            <Text style={styles.label}>{label}:</Text>
            <TextInput
              style={[styles.input, multiline && styles.bioInput]}
              value={value}
              onChangeText={setter}
              placeholder={placeholder}
              placeholderTextColor="white"
              keyboardType={keyboardType}
              multiline={multiline}
              numberOfLines={numberOfLines}
            />
          </View>
        ))}
        <View style={styles.inputRow}>
          <Text style={styles.label}>Gender:</Text>
          <TouchableOpacity onPress={() => setShowInterests(!showInterests)} style={styles.interestInput}>
            <Text style={styles.interestText}>{gender || 'Add your gender'}</Text>
            <AntDesign name={showInterests ? 'caretup' : 'caretdown'} size={16} color="white" />
          </TouchableOpacity>
          {showInterests && (
            <View style={styles.interestOptions}>
              {['Men', 'Female'].map((option) => (
                <TouchableOpacity key={option} onPress={() => handleInterestPress(option)} style={styles.interestOption}>
                  <Text style={styles.interestOptionText}>{option}</Text>
                  {option === 'Add interest' && <AntDesign name="pluscircle" size={16} color="white" />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <View style={styles.column}>
          <Text style={styles.destinationTitle}>Your Birthday:</Text>
          <Button title="Select Start Date" onPress={showStartDatePicker} color="#B3492D"  />
          <DateTimePickerModal
            isVisible={isDateOfBirthPickerVisible}
            mode="date"
            onConfirm={handleStartDateConfirm}
            onCancel={hideStartDatePicker}
            buttonTextColorIOS="black"
            
          />
          {/* {dateOfBirth && <Text style={styles.selectedDate}>{dateOfBirth}</Text>}*/}
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Save changes</Text>
        </TouchableOpacity>
      </View>
{/************************* Modal *************************/}
<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Select Your Activities</Text>
            <View style={styles.activityContainer}>
              {activities.map((activity) => (
                <TouchableOpacity
                  key={activity}
                  style={[
                    styles.activityCard,
                    interests.includes(activity) && styles.selectedActivityCard,
                  ]}
                  onPress={() => handleActivityPress(activity)}
                  disabled={interests.includes(activity)}
                >
                  <Text style={styles.activityText}>{activity}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#00595E', 
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profilePicture: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: '#90caf9',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 10,
  },
  editIcon: {
    backgroundColor: '#00595E',
    padding: 5,
    borderRadius: 50,
  },
  info: {
    marginTop: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: 'white',
    marginRight: 10,
    width: 80,
  },
  input: {
    flex: 1,
    backgroundColor: '#263238',
    padding: 10,
    borderRadius: 5,
    color: 'white',
  },
  bioInput: {
    height: 80,
  },
  interestInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#263238',
    padding: 10,
    borderRadius: 5,
  },
  interestText: {
    color: 'white',
    flex: 1,
  },
  interestOptions: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#263238',
    borderRadius: 5,
    padding: 10,
    zIndex: 10,
  },
  interestOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#455a64',
  },
  interestOptionText: {
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#f44211',
    padding: 15,
    borderRadius: 5,
    marginTop: 30,
    alignSelf: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  column: {
    flex: 1,
    marginRight: 10,
  },
  destinationTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 10,
    textAlign: 'left',
    width: '100%',
  },
  selectedDate: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'left',
  },inputName: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    nameInput: {
      fontSize: 18,
      color: 'white', // Change to your desired color
      borderBottomWidth: 1,
      borderBottomColor: 'gray', // Change to your desired border color
      padding: 2,
      flex: 1, // This ensures the input takes the available space
    },
    iconButton: {
      padding: 10,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: 300,
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      alignItems: 'center',
    },
    modalText: {
      fontSize: 18,
      marginBottom: 20,
    },
    closeButton: {
      backgroundColor: '#f44211',
      padding: 10,
      borderRadius: 5,
    },
    closeButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    activityContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    activityCard: {
      width: '45%',
      padding: 10,
      marginVertical: 5,
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedActivityCard: {
      backgroundColor: '#c0c0c0',
    },
    activityText: {
      fontSize: 16,
    },
});

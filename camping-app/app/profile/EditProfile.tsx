// import React, { useState,useEffect} from 'react';
// import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
// import { AntDesign } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import JWT from 'expo-jwt';
// const EditProfile = () => {
//   const [age, setAge] = useState('');
//   const [location, setLocation] = useState('');
//   const [bio, setBio] = useState('');
//   const [phone, setPhone] = useState('');
//   const [interest, setInterest] = useState('');
//   const [profileImage, setProfileImage] = useState<String[]>([]);
//   const [refresh, setRefresh] = useState<boolean>(false); 
//   const [user, setUser] = useState<User>({ id: "", name: "", email: "", role: "" });
//   const [name,setName]=useState<String>('')
//   const [showInterests, setShowInterests] = useState(false);
  
//   const handleInterestPress = (interest) => {
//     setInterest(interest);
//     setShowInterests(false);
//   };

//   const handleProfileImagePress = async () => {
// //     let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

// //     if (permissionResult.granted === false) {
// //       alert("Permission to access camera roll is required!");
// //       return;
// //     }

// //     let pickerResult = await ImagePicker.launchImageLibraryAsync({
// //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //       allowsEditing: true,
// //       aspect: [4, 3],
// //       quality: 1,
// //     });
// //     if (!pickerResult.canceled) {
// //       if (pickerResult.assets && pickerResult.assets.length > 0 && pickerResult.assets[0].uri) {
// //         const selectedImageUri = pickerResult.assets[0].uri;
// //         setProfileImage(prevImages => [...prevImages, selectedImageUri]);
// //       } else {
// //         console.error('Image selection failed: No valid URI found');
// //         alert('There was an error selecting the image. Please try again.');
// //       }
// //     }
// //   } catch (error) {
// //     console.error('Error picking image:', error);
// //     alert('An unexpected error occurred while picking the image. Please try again.');
// //   }
// // };
// try {
//   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//   if (status !== 'granted') {
//     alert('Sorry, we need camera roll  permissions to choose an image.');
//     return;
//   }

//   let result = await ImagePicker.launchImageLibraryAsync({
//     mediaTypes: ImagePicker.MediaTypeOptions.Images,
//     allowsEditing: true,
//     aspect: [4, 3],
//     quality: 1,
//   });
  
//   if (!result.canceled) {
//     console.log('Image picker result:', result); // Log the entire result object for debugging

//     if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
//       const selectedImageUri = result.assets[0].uri;
//       setProfileImage(prevImages => [...prevImages, selectedImageUri]);
//     } else {
//       console.error('Image selection failed: No valid URI found');
//       alert('There was an error selecting the image. Please try again.');
//     }
//   }
// } catch (error) {
//   console.error('Error picking image:', error);
//   alert('An unexpected error occurred while picking the image. Please try again.');
// }
// };
// // console.log(profileImage,"eeeee");

// // *******************************
//   const handleSaveChanges = async () => {
//     const formData = new FormData();
//     formData.append('name',name)
//     formData.append('age', age);
//     formData.append('location', location);
//     formData.append('bio', bio);
//     formData.append('phone', phone);
//     formData.append('interest', interest);
//     formData.append('id', user.id);


 
    
//     profileImage.forEach((imageUri) => {
//       const fileName = imageUri.split('/').pop();
//       const fileType = fileName.includes('.') ? `image/${fileName.split('.').pop()}` : 'image/jpeg';
//       formData.append('imagesProfile', {
//         uri: imageUri,
//         name: fileName,
//         type: fileType,
//       });
//     });

// console.log(formData,'rrrrrrrr');

//     try {
//       const response = await axios.put(`http:// 192.168.10.6:5000/api/user/update/${user.id}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
// console.log(response,'rrrrrrrr');

//       if (response.data.success) {
//         alert('Profile updated successfully!');
//       } else {
//         alert('Failed to update profile.');
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       alert('An error occurred. Please try again.');
//     }
//   };

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const data = await AsyncStorage.getItem('token');
//         if (data) {
//           const token = data.startsWith('Bearer ') ? data.replace('Bearer ', '') : data;
//           const key = 'mySuperSecretPrivateKey';

//           try {
//             const decodedToken = JWT.decode(token, key);
//             if (decodedToken) {
//               setUser({
//                 id: decodedToken.id || '',
//                 name: decodedToken.name || '',
//                 email: decodedToken.email || '',
//                 imagesProfile: decodedToken.imagesProfile,
//                 role: decodedToken.role || '',
//               });
//               setName(user.name)
//             } else {
//               console.error('Failed to decode token');
//             }
//           } catch (decodeError) {
//             console.error('Error decoding token:', decodeError);
//           }
//         } else {
//           console.error('Token not found in AsyncStorage');
//         }
//       } catch (storageError) {
//         console.error('Failed to fetch token from AsyncStorage:', storageError);
//       }
//     };

//     fetchUser();
//   }, [refresh]);


//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.header}>
//         {/* Header content */}
//       </View>
//       <View style={styles.profilePicture}>
//         <TouchableOpacity onPress={handleProfileImagePress} style={styles.profileImageContainer}>
//           {profileImage ? (
//             <Image source={{ uri: profileImage[0]||user.imagesProfile}} style={styles.profileImage} />
//           ) : (
//             <View style={styles.profileImage} />
//           )}
//           <View style={styles.cameraIcon}>
//             <AntDesign name="camera" size={24} color="white" />
//           </View>
//         </TouchableOpacity>
//         <View style={styles.nameContainer}>
//           <Text style={styles.name}>{name}</Text>
//           <TouchableOpacity onPress={() => console.log('Edit name clicked')} style={styles.editIcon}>
//             <AntDesign name="edit" size={24} color="white" />
//           </TouchableOpacity>
//         </View>
//       </View>
//       <View style={styles.info}>
//         <View style={styles.inputRow}>
//           <Text style={styles.label}>Interest:</Text>
//           <TouchableOpacity onPress={() => setShowInterests(!showInterests)} style={styles.interestInput}>
//             <Text style={styles.interestText}>{interest || 'Add your interest...'}</Text>
//             <AntDesign name={showInterests ? 'caretup' : 'caretdown'} size={16} color="white" />
//           </TouchableOpacity>
//           {showInterests && (
//             <View style={styles.interestOptions}>
//               {['Hiking', 'Swimming', 'Kayaking', 'Add interest'].map(option => (
//                 <TouchableOpacity 
//                   key={option} 
//                   onPress={() => handleInterestPress(option)} 
//                   style={styles.interestOption}
//                 >
//                   <Text style={styles.interestOptionText}>{option}</Text>
//                   {option === 'Add interest' && <AntDesign name="pluscircle" size={16} color="white" />}
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}
//         </View>
//         {[
//           { label: 'Age', value: age, setter: setAge, placeholder: 'Enter your age', keyboardType: 'numeric' },
//           { label: 'Location', value: location, setter: setLocation, placeholder: 'Enter your location' },
//           { label: 'Bio', value: bio, setter: setBio, placeholder: 'Tell us about yourself', multiline: true, numberOfLines: 3 },
//           { label: 'Phone', value: phone, setter: setPhone, placeholder: 'Enter your phone number', keyboardType: 'phone-pad' },
//         ].map(({ label, value, setter, placeholder, keyboardType, multiline, numberOfLines }) => (
//           <View key={label} style={styles.inputRow}>
//             <Text style={styles.label}>{label}:</Text>
//             <TextInput
//               style={[styles.input, multiline && styles.bioInput]}
//               value={value}
//               onChangeText={setter}
//               placeholder={placeholder}
//               placeholderTextColor="white"
//               keyboardType={keyboardType}
//               multiline={multiline}
//               numberOfLines={numberOfLines}
//             />
//           </View>
//         ))}
//         <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
//           <Text style={styles.saveButtonText}>Save changes</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// export default EditProfile;

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#00595E', // Updated background color
//     padding: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   profilePicture: {
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   profileImageContainer: {
//     position: 'relative',
//     width: 100,
//     height: 100,
//   },
//   profileImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 50,
//     backgroundColor: '#90caf9',
//   },
//   cameraIcon: {
//     position: 'relative',
//     bottom: 100,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     padding: 5,
//     borderRadius: 50,
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 100,
//     height: 100,
//   },
//   nameContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10, // Add margin to separate from profile picture
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//     marginRight: 10, // Space between name and icon
//   },
//   editIcon: {
//     backgroundColor: '#00595E', // Optional: Adjust icon background color if needed
//     padding: 5,
//     borderRadius: 50,
//     marginRight:-25
//   },
//   info: {
//     marginTop: 20,
//   },
//   inputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   label: {
//     fontSize: 16,
//     color: 'white',
//     marginRight: 10,
//     width: 80,
//   },
//   input: {
//     flex: 1,
//     backgroundColor: '#263238',
//     padding: 10,
//     borderRadius: 5,
//     color: 'white',
//   },
//   bioInput: {
//     height: 80,
//   },
//   interestInput: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#263238',
//     padding: 10,
//     borderRadius: 5,
//     color: 'white',
//   },
//   interestText: {
//     color: 'white',
//     flex: 1,
//   },
//   interestOptions: {
//     position: 'absolute',
//     top: 60,
//     left: 0,
//     right: 0,
//     backgroundColor: '#263238',
//     borderRadius: 5,
//     padding: 10,
//     zIndex: 10,
//   },
//   interestOption: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#455a64',
//   },
//   interestOptionText: {
//     color: 'white',
//   },
//   saveButton: {
//     backgroundColor: '#f44336',
//     padding: 15,
//     borderRadius: 5,
//     marginTop: 30,
//     alignSelf: 'center',
//   },
//   saveButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JWT from 'expo-jwt';

const EditProfile = () => {
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('');
  const [profileImage, setProfileImage] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState({ id: "", name: "", email: "", role: "" });
  const [name, setName] = useState('');
  const [showInterests, setShowInterests] = useState(false);

  const handleInterestPress = (interest) => {
    setInterest(interest);
    setShowInterests(false);
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
          setProfileImage(prevImages => [...prevImages, selectedImageUri]);
        } else {
          console.error('Image selection failed: No valid URI found');
          alert('There was an error selecting the image. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('An unexpected error occurred while picking the image. Please try again.');
    }
  };

  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('age', age);
    formData.append('location', location);
    formData.append('bio', bio);
    formData.append('phone', phone);
    formData.append('interest', interest);
    formData.append('id', user.id);

    profileImage.forEach((imageUri) => {
      const fileName = imageUri.split('/').pop();
      const fileType = fileName.includes('.') ? `image/${fileName.split('.').pop()}` : 'image/jpeg';
      formData.append('imagesProfile', {
        uri: imageUri,
        name: fileName,
        type: fileType,
      });
    });

    console.log(formData, 'rrrrrrrr');

    try {
      const response = await axios.put(`http://192.168.10.6:5000/api/user/update/${user.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response, 'rrrrrrrr');

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
                imagesProfile: decodedToken.imagesProfile,
                role: decodedToken.role || '',
              });
              setName(decodedToken.name || '');
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {/* Header content */}
      </View>
      <View style={styles.profilePicture}>
        <TouchableOpacity onPress={handleProfileImagePress} style={styles.profileImageContainer}>
          {profileImage.length > 0 ? (
            <Image source={{ uri: profileImage[0] || user.imagesProfile }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImage} />
          )}
          <View style={styles.cameraIcon}>
            <AntDesign name="camera" size={24} color="white" />
          </View>
        </TouchableOpacity>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{name}</Text>
          <TouchableOpacity onPress={() => console.log('Edit name clicked')} style={styles.editIcon}>
            <AntDesign name="edit" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.info}>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Interest:</Text>
          <TouchableOpacity onPress={() => setShowInterests(!showInterests)} style={styles.interestInput}>
            <Text style={styles.interestText}>{interest || 'Add your interest...'}</Text>
            <AntDesign name={showInterests ? 'caretup' : 'caretdown'} size={16} color="white" />
          </TouchableOpacity>
          {showInterests && (
            <View style={styles.interestOptions}>
              {['Hiking', 'Swimming', 'Kayaking', 'Add interest'].map(option => (
                <TouchableOpacity
                  key={option}
                  onPress={() => handleInterestPress(option)}
                  style={styles.interestOption}
                >
                  <Text style={styles.interestOptionText}>{option}</Text>
                  {option === 'Add interest' && <AntDesign name="pluscircle" size={16} color="white" />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        {[
          { label: 'Age', value: age, setter: setAge, placeholder: 'Enter your age', keyboardType: 'numeric' },
          { label: 'Location', value: location, setter: setLocation, placeholder: 'Enter your location' },
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
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Save changes</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#f44336',
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
});

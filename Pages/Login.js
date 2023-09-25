/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Image,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {
  NotificationServices,
  requestUserPermission,
} from './pushNotificationsl';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Login = () => {
  const [branch, setbranch] = useState('Andheri');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState(false);
  const navigator = useNavigation();
  useEffect(() => {
    checkApplicationPermission();
    requestUserPermission();
    NotificationServices();

    //isLoggedin();
  }, []);

  const checkApplicationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      } catch (error) {}
    }
  };

  useFocusEffect(() => {
    isLoggedin();
  });

  const isLoggedin = async () => {
    const loggedIn = await AsyncStorage.getItem('carebuddyLogin');
    if (JSON.parse(loggedIn)) {
      navigator.navigate('Routes');
    }
  };
  const handleSubmit = async () => {
    const data = await firestore()
      .collection('BranchInformations')
      .doc(branch)
      .get();
    let data1 = data.data();
    console.log(data1.asssitantDoctor);
    if (data1.asssitantDoctor === `${'+91' + mobile}`) {
      await AsyncStorage.setItem('branch', JSON.stringify(branch));
      await AsyncStorage.setItem('carebuddyLogin', JSON.stringify(true));

      let fcmToken = await AsyncStorage.getItem('fcmToken');
      if (data1.fcm_token) {
        console.log('fcm_available');
        const index = data1.fcm_token.indexOf(fcmToken);
        if (index === -1) {
          data1.fcm_token = [...data1.fcm_token, fcmToken];
          console.log('But not found in array');
        }
      } else {
        data1 = {...data1, fcm_token: [fcmToken]};
      }
      console.log(data1);

      await firestore()
        .collection('BranchInformations')
        .doc(branch)
        .update(data1);

      console.log(mobile + ' Verified');
      setError(false);
      navigator.navigate('Routes');
    } else {
      setError(true);
      setMobile('');
    }
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={{
            alignItems: 'center',
            marginTop: 10,
            borderBottomColor: 'black',
            borderBottomWidth: 1,
          }}>
          <Text style={{fontSize: 28, fontWeight: 600, color: '#376858'}}>
            Welcome To CareBuddy
          </Text>
        </View>

        <View
          style={{
            alignItems: 'center',
          }}>
          <Image
            style={{height: 180, width: 120}}
            source={require('./grayLogo.png')}
          />
          <Text style={{fontSize: 18, color: 'gray', marginBottom: 5}}>
            Please Select Branch
          </Text>
          <View style={styles.dropbox}>
            <Picker
              selectedValue={branch}
              style={{color: 'black'}}
              onValueChange={(itemValue, itemIndex) => setbranch(itemValue)}>
              <Picker.Item label="Andheri" value="Andheri" />
              <Picker.Item label="Baner" value="Baner" />
              <Picker.Item label="Bangalore" value="Bangalore" />
              <Picker.Item label="Belagavi" value="Belagavi" />
              <Picker.Item label="Chakan" value="Chakan" />
              <Picker.Item label="DP Road" value="DP Road" />
              <Picker.Item label="Hyderabad" value="Hyderabad" />
              <Picker.Item label="Indiranagar" value="Indiranagar" />
              <Picker.Item label="JP nagar" value="JP Nagar" />
              <Picker.Item label="Kolhapur" value="Kolhapur" />
              <Picker.Item label="Latur" value="Latur" />
              <Picker.Item label="Ludhiana" value="Ludhiana" />
              <Picker.Item label="Nashik" value="Nashik" />
              <Picker.Item label="Navi-Mumbai" value="Navi-Mumbai" />
              <Picker.Item label="Pimpri-Chinchwad" value="Pimpri-Chinchwad" />
              <Picker.Item label="Sahakarnagar" value="Sahakarnagar" />
              <Picker.Item label="Salunkhe Vihar" value="Salunkhe-Vihar" />
              <Picker.Item label="Surat" value="Surat" />
              <Picker.Item label="Thane" value="Thane" />
            </Picker>
          </View>
          <Text
            style={{
              fontSize: 18,
              color: 'gray',
              marginTop: 15,
              marginBottom: 5,
            }}>
            Verify Your Mobile Number
          </Text>
          <TextInput
            style={{
              height: 50,
              borderColor: 'black',
              borderWidth: 1,
              borderRadius: 10,
              textAlign: 'center',
              color: 'black',
              fontSize: 20,
              width: '60%',
            }}
            value={mobile}
            maxLength={10}
            onChangeText={setMobile}
          />
          {error && (
            <Text
              style={{
                fontSize: 18,
                color: 'red',
                marginTop: 15,
                marginBottom: 5,
              }}>
              Please Enter Correct Details
            </Text>
          )}
          <TouchableOpacity onPress={handleSubmit} style={styles.button4}>
            <Text style={{color: 'white', fontSize: 20}}>SUBMIT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedValueContainer: {
    marginTop: 20,
  },
  selectedValueText: {
    fontSize: 20,
  },
  dropbox: {
    borderWidth: 1,
    //height: 45,
    borderRadius: 10,
    width: '60%',
    borderColor: '#454545',
    color: 'black',
  },
  button4: {
    alignItems: 'center',
    backgroundColor: '#478772',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '40%',

    borderRadius: 20,
    height: 50,
    marginTop: 30,
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: {height: 1, width: 1}, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1,
    elevation: 2,
  },
});

export default Login;

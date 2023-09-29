/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Image,
  BackHandler,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import {Svg, Circle} from 'react-native-svg';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';
let filteredUserList = [];
const DisplayData = () => {
  const [branch, setBranch] = useState('');
  //const [userList, setUserList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attendNote, setAttendNote] = useState('');
  const [Error, setError] = useState(false);
  //const route = useRoute();
  const [updatedTime, setUpdatedTime] = useState(
    new Date().toLocaleString('en-GB', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }),
  );
  //const navigator = useNavigation();
  var lessScoreCount = 0;
  var doctorsActionCount = 0;

  useEffect(() => {
    getBranch();
    getData();
  }, []);

  // For exiting App
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        BackHandler.exitApp();
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }, []),
  );

  const handlePhoneCall = callNumber => {
    const phoneNumber = callNumber;
    const scheme = Platform.OS === 'android' ? 'tel:' : 'telprompt:';
    const phoneUrl = scheme + phoneNumber;
    // console.log('Medical Call: ', phoneUrl);
    if (callNumber) {
      Linking.openURL(phoneUrl).catch(() => {
        console.log('Error!');
      });
    }
    return;
  };

  const getBranch = async () => {
    const data = await AsyncStorage.getItem('branch');
    setBranch(JSON.parse(data));
  };

  const getData = async () => {
    try {
      setLoading(true);
      const querySnapshot = await firestore().collection('Users').get();
      const selectedBranch = JSON.parse(await AsyncStorage.getItem('branch'));
      const userList = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();

        if (data.branchName === selectedBranch) {
          userList.push(data);
        }
      });
      filteredUserList = userList.reverse();
      //console.log(filteredUserList);
      const currentDate = new Date();
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      };
      const formattedDateTime = currentDate.toLocaleString('en-GB', options);
      setUpdatedTime(formattedDateTime);
      setLoading(false);
    } catch (error) {
      alert('Error getting data:', error);
    }
  };

  const attendHandler = async user => {
    if (attendNote !== '') {
      console.log(user.timeStamp);
      setLoading(true);
      setError(false);
      const length = user.patientPain.length;
      user.patientPain[length - 1] = {
        ...user.patientPain[length - 1],
        doctorsNotes: attendNote,
      };
      const data = {
        doctorsAction: true,
        patientPain: [...user.patientPain],
      };

      await firestore()
        .collection('Users')
        .doc(user.timeStamp.toString())
        .update(data)
        .then(() => {
          console.log('Field has been updated to an existing document');
          user.doctorsAction = true;
          user.patientPain[user.patientPain.length - 1].doctorsNotes =
            attendNote;
          Alert.alert('You recently attended a patient successfully');
          setAttendNote('');
          setLoading(false);
        })
        .catch(error => {
          Alert.alert(error);
          user.doctorsAction = false;
          user.patientPain[user.patientPain.length - 1].doctorsNotes = '';
          setLoading(false);
        });

      const timeStamp = Math.floor(firestore.Timestamp.now().toMillis());
      const docRef = await firestore()
        .collection('Attended')
        .doc(timeStamp.toString());
      console.log(timeStamp);
      const currentDate = new Date();
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      };
      const formattedDateTime = currentDate.toLocaleString('en-GB', options);

      await docRef
        .set({
          timeStamp: timeStamp,
          name: user.name,
          branchName: user.branchName,
          mobileno: user.mobileno ? user.mobileno : 'NA',
          diagnosis: user.diagnosis,
          surgery: user.surgery,
          latestPainFromPatient: user.latestPainFromPatient,
          lastUpdateFromPatient: user.lastUpdateFromPatient,
          doctorsNotes: attendNote ? attendNote : '',
          dateOfAttended: formattedDateTime,
        })
        .catch(error => {
          alert(error);
        });
    } else {
      alert('Please Enter Short Note');
      return;
    }
  };

  const handleRefresh = () => {
    // Simulate a refresh action
    setLoading(true);
    getData();
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulated delay for demonstration
  };

  const now = new Date();
  const today =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
    ).getTime() / 1000;
  const navigator = useNavigation();
  const logoutHandler = async () => {
    await AsyncStorage.setItem('carebuddyLogin', JSON.stringify(false));
    navigator.navigate('HomeScreen');
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={{
            alignItems: 'center',
            margin: 10,
            borderBottomColor: 'black',
            padding: 10,
            borderBottomWidth: 1,
          }}>
          <Text style={{fontSize: 22, fontWeight: 600, color: '#376858'}}>
            Patient Details: {branch}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            margin: 10,
          }}>
          <Text style={{fontSize: 14, fontWeight: 500, color: 'black'}}>
            Last updated on : {updatedTime}
          </Text>
          <TouchableOpacity onPress={handleRefresh} activeOpacity={0.5}>
            <Image
              style={{
                height: 25,
                width: 28,
                tintColor: '#376858',
              }}
              source={require('./refresh.png')}
            />
          </TouchableOpacity>
        </View>
        {/*<View
          style={{
            alignItems: 'center',
            margin: 5,
          }}>
          <TouchableOpacity
            onPress={displayAttendedList}
            activeOpacity={0.5}
            style={{
              backgroundColor: '#478772',
              padding: 10,
              borderRadius: 5,
              width: '60%',
            }}>
            <Text
              style={{
                fontSize: 18,
                color: 'white',
                textAlign: 'center',
              }}>
              Attended Patients
            </Text>
          </TouchableOpacity>
            </View>*/}
        {loading ? (
          <Text>Please Wait...</Text>
        ) : (
          <View>
            {filteredUserList.length > 0 ? (
              filteredUserList.map(user =>
                user.latestPainFromPatient && user.latestPainFromPatient > 5 ? (
                  !user.doctorsAction ? (
                    <View
                      key={user.timeStamp}
                      style={{
                        backgroundColor: user.doctorsAction
                          ? '#78fa87'
                          : '#f78b8b',
                        margin: 10,
                        padding: 10,
                      }}>
                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 3, margin: 5}}>
                          <Text
                            style={{
                              fontSize: 16,
                              color: 'black',
                              fontWeight: 500,
                            }}>
                            Name: {user.name}
                          </Text>
                          <Text
                            style={{
                              fontSize: 16,
                              color: 'black',
                              fontWeight: 500,
                            }}>
                            Mobile: {user.mobileno ? user.mobileno : 'NA'}
                          </Text>

                          <Text
                            style={{
                              fontSize: 16,
                              color: 'black',
                              fontWeight: 500,
                            }}>
                            Surgery: {user.surgery}
                          </Text>
                          <Text
                            style={{
                              fontSize: 16,
                              color: 'black',
                              fontWeight: 500,
                            }}>
                            PainScore: {user.latestPainFromPatient}
                          </Text>
                          <Text
                            style={{
                              fontSize: 16,
                              color: 'black',
                              fontWeight: 500,
                            }}>
                            Date:
                            {new Date(
                              user.lastUpdateFromPatient,
                            ).toLocaleString('en-GB', {
                              year: 'numeric',
                              month: 'numeric',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                              second: 'numeric',
                            })}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                          }}>
                          <Svg
                            onPress={() => handlePhoneCall(user.mobileno)}
                            alignItems="center"
                            height="60"
                            width="60">
                            <Circle cx="28" cy="28" r="28" fill="#478772" />
                            <Image
                              style={{
                                width: 28,
                                height: 28,
                                top: 14,
                                left: 14,
                                //marginBottom: -10,
                              }}
                              source={require('./phone.png')}
                            />
                          </Svg>
                          <Text style={{color: '#000', fontSize: 16}}>
                            Call Now
                          </Text>
                        </View>
                      </View>
                      <TextInput
                        style={{
                          height: 50,
                          borderColor: 'black',
                          borderWidth: 1,
                          borderRadius: 10,
                          color: 'black',
                          fontSize: 16,
                          width: '100%',
                          backgroundColor: 'white',
                          padding: 10,
                          marginTop: 5,
                          marginBottom: 5,
                        }}
                        placeholder="Enter Short Note Here.."
                        placeholderTextColor={'gray'}
                        onChangeText={setAttendNote}
                      />
                      <View
                        style={{
                          alignItems: 'center',
                          margin: 5,
                        }}>
                        <TouchableOpacity
                          onPress={() => attendHandler(user)}
                          activeOpacity={0.5}
                          style={{
                            backgroundColor: 'blue',
                            padding: 10,
                            borderRadius: 5,
                            width: '60%',
                          }}>
                          <Text
                            style={{
                              fontSize: 18,
                              color: 'white',
                              textAlign: 'center',
                            }}>
                            Mark As Attended
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    (doctorsActionCount++, null)
                  )
                ) : (
                  (lessScoreCount++, null)
                ),
              )
            ) : (
              <Text
                style={{
                  color: 'black',
                  textAlign: 'center',
                  fontSize: 22,
                  fontWeight: 500,
                }}>
                Data not available
              </Text>
            )}
            {console.log(
              'Doctors Action Count: ',
              doctorsActionCount,
              'Less Score Count: ',
              lessScoreCount,
              'Array Length: ',
              filteredUserList.length,
            )}
            {doctorsActionCount + lessScoreCount === filteredUserList.length ? (
              <Text
                style={{
                  color: 'black',
                  textAlign: 'center',
                  fontSize: 22,
                  fontWeight: 500,
                }}>
                Patient Details Not Availble
              </Text>
            ) : (
              ''
            )}
          </View>
        )}
        <View
          style={{
            alignItems: 'center',
            margin: 5,
          }}>
          <TouchableOpacity
            onPress={logoutHandler}
            activeOpacity={0.5}
            style={{
              backgroundColor: '#478772',
              padding: 10,
              borderRadius: 5,
              width: '60%',
            }}>
            <Text
              style={{
                fontSize: 18,
                color: 'white',
                textAlign: 'center',
              }}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default DisplayData;

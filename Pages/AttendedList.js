/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {useEffect, useState, useCallback} from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Text,
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';

/* eslint-disable prettier/prettier */
var attendedRecord = [];
const AttendedList = () => {
  const [loading, setLoading] = useState(false);
  const [branch, setBranch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
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
  const last15Days = new Date().getTime() - 1296000000;

  useEffect(() => {
    getBranch();
    fetchRecord();
  }, []);

  const getBranch = async () => {
    const data = await AsyncStorage.getItem('branch');
    setBranch(JSON.parse(data));
  };

  const fetchRecord = async () => {
    try {
      setLoading(true);

      const querySnapshot = await firestore().collection('Attended').get();
      const selectedBranch = JSON.parse(await AsyncStorage.getItem('branch'));
      const userList = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();

        if (
          data.branchName === selectedBranch &&
          data.timeStamp >= last15Days
        ) {
          userList.push(data);
        }
      });
      attendedRecord = userList.reverse();
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
      setLoading(false);
      alert('Error getting data:', error);
    }
  };

  const handleRefresh = () => {
    // Simulate a refresh action
    setLoading(true);
    fetchRecord();
    setLoading(false); // Simulated delay for demonstration
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
        {loading ? (
          <Text>Please Wait...</Text>
        ) : (
          <View>
            {attendedRecord.length > 0 ? (
              attendedRecord.map(user => (
                <View
                  key={user.timeStamp}
                  style={{
                    backgroundColor: '#78f087',
                    margin: 5,
                    padding: 10,
                  }}>
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
                    {new Date(user.lastUpdateFromPatient).toLocaleString(
                      'en-GB',
                      {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                      },
                    )}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'black',
                      fontWeight: 500,
                    }}>
                    Note:
                    {user.doctorsNotes}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'black',
                      fontWeight: 500,
                    }}>
                    Date of Attended:{user.dateOfAttended}
                  </Text>
                  {/*<Text
                    style={{
                      fontSize: 20,
                      color: 'black',
                      fontWeight: 600,
                      textAlign: 'center',
                    }}>
                    Attended
                </Text>*/}
                </View>
              ))
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
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AttendedList;

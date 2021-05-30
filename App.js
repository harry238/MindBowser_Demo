/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import DetailsView from './src/screens/Details';
import ListView from './src/screens/List';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from "react-redux";
import thunk from 'redux-thunk';

const Stack = createStackNavigator();

const initialState = {
  DummyData: [],
  loading: false,
  ListInfo: null,
  error: null,
}
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_LIST_BEGIN':
      // Mark the state as "loading" so we can show a spinner or something
      // Also, reset any errors. We're starting fresh.

      // console.log(11);
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'FETCH_LIST_SUCCESS':
      // All done: set loading "false".
      // Also, replace the items with the ones from the server
      // console.log(action.payload.list);
      return {
        ...state,
        loading: false,
        DummyData: action.payload.list
      };

    case 'FETCH_LIST_FAILURE':
      // The request failed, but it did stop, so set loading to "false".
      // Save the error, and we can display it somewhere
      // Since it failed, we don't have items to display anymore, so set it empty.
      // This is up to you and your app though: maybe you want to keep the items
      // around! Do whatever seems right.
      console.log("error : :" + action.payload.error);
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        DummyData: []
      };

    case 'FETCH_LIST_INFO_BEGIN':
      // Mark the state as "loading" so we can show a spinner or something
      // Also, reset any errors. We're starting fresh.

      // console.log(11);
      return {
        ...state,
        loading: true,
        error: null,
        ListInfo: null,
      };
      
    case 'FETCH_LIST_INFO_SUCCESS':
      // All done: set loading "false".
      // Also, replace the items with the ones from the server
      // console.log(action.payload.users);
      return {
        ...state,
        loading: false,
        ListInfo: action.payload.details
      };

    case 'FETCH_LIST_INFO_FAILURE':
      // The request failed, but it did stop, so set loading to "false".
      // Save the error, and we can display it somewhere
      // Since it failed, we don't have items to display anymore, so set it empty.
      // This is up to you and your app though: maybe you want to keep the items
      // around! Do whatever seems right.
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        ListInfo: null
      };
    default:
      // ALWAYS have a default case in a reducer
      return state;
  }
}
const store = createStore(reducer, applyMiddleware(thunk));


const App = () => {
  return (
    <Provider store={store}>
      <StatusBar animated translucent backgroundColor='rgba(0,0,0,0.2)' barStyle='dark-content' />
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'ListView'} headerMode='float'>
          <Stack.Screen name='ListView' component={ListView} options={{ headerShown: false }} />
          <Stack.Screen name='DetailsView' component={DetailsView} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;

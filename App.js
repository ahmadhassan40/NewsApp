// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import CategoryScreen from './screens/CategoryScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'News' }}
        />
        <Stack.Screen 
          name="Category" 
          component={CategoryScreen} 
          options={({ route }) => ({ title: route.params.category })} 
        />
        <Stack.Screen 
          name="Details" 
          component={DetailsScreen} 
          options={{ title: 'Article Details' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

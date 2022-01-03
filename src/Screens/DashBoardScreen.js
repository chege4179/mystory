import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SavedPostsScreen from "./SavedPostScreen";
import HomeScreen from "./HomeScreen";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import NotificationScreen from "./NotificationScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import ProfileScreen from "./ProfileScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


const Tab = createBottomTabNavigator()
const DashBoardScreen = () => {
  return (
    <Tab.Navigator  screenOptions={{
      tabBarLabelStyle:{

        fontSize:15,
        paddingTop:2
      },

    }}>
      <Tab.Screen name='HomeScreen' component={HomeScreen} options={{

        title:'Home',
        tabBarIcon:() => {
          return(<Entypo name='home' size={27}/>)
        }
      }}/>
      <Tab.Screen name='SavedPosts' component={SavedPostsScreen}options={{
        tabBarIcon:() => {
          return(<FontAwesome name='bookmark' size={27}/>)
        }
      }}/>
      <Tab.Screen name='NotificationScreen' component={NotificationScreen}options={{
        title:'Notifications',
        tabBarIcon:() => {
          return(<Ionicons name='notifications' size={27}/>)
        },
        tabBarBadge:0
      }}/>
      <Tab.Screen name='ProfileScreen' component={ProfileScreen}options={{
        title:'My Profile',
        tabBarIcon:() => {
          return(<MaterialCommunityIcons name='account-circle' size={27} color='black' />)
        }
      }}/>
    </Tab.Navigator>
  );
};

export default DashBoardScreen;

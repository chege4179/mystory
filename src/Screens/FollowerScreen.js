import React, { useEffect, useLayoutEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { capitalize } from "../Utilities/HelperFunctions";
import axios from "axios";
import BaseURL from "../components/BaseURL";
import { useSelector } from "react-redux";
import { SelectUser } from "../ReduxStore/UserReducer";
import { FlatList } from "native-base";
import FollowerCard from "../components/FollowerCard";

const FollowerScreen = ({ navigation,route }) => {
     const user = useSelector(SelectUser)
     const [Followers,setFollowers] = useState([])
     const [Following,setFollowing] = useState([])
     const { type }= route.params
     useLayoutEffect(() => {
          navigation.setOptions({
               headerTitle:capitalize(type)
          })
     },[])
     const FetchFollowersAndFollowing = () => {
          axios.get(`${BaseURL}/follower/all?username=${user.username}`)
               .then((res) => {
                    setFollowers(res.data.followers)
                    setFollowing(res.data.following)
               })
               .catch((error) =>{
                    console.log(error)
               })
     }
     useEffect(() => {
          FetchFollowersAndFollowing()
     }, []);


     return (
          <View style={styles.container}>
               <FlatList
                    data={type ==='followers' ? Followers : Following}
                    renderItem={({ item }) => {
                         return(<FollowerCard username={type === 'followers'? item.follower : item.following} type={type}/>)
                    }}/>
          </View>
     );
};
const styles = StyleSheet.create({
     container: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",

     },
});
export default FollowerScreen;

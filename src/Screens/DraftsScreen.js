import React, { useEffect, useLayoutEffect, useState } from "react";

import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "native-base";
import DraftCard from "../components/DraftCard";

const DraftsScreen = ({ navigation }) => {
     const [drafts, setDrafts] = useState([]);
     const ClearAllDrafts = () => {
          AsyncStorage.removeItem('drafts')
          setDrafts([])
     }
     useLayoutEffect(() => {
          navigation.setOptions({
               headerTitle:'My Drafts',
               headerRight:() => {
                    return(
                         <TouchableOpacity onPress={ClearAllDrafts} style={styles.headerRightButton}>
                              <Text style={styles.headerRightButtonText}>Clear All</Text>
                         </TouchableOpacity>
                    )
               }

          })
     },[])

     useEffect(() => {
          AsyncStorage.getItem('drafts',(err,data) => {
               if (err){
                    console.log(err);

               }else {
                    console.log(data)
                    if (data === null){
                         setDrafts([])
                    }else {
                         let saveddrafts = JSON.parse(data);
                         setDrafts(saveddrafts)
                    }
               }
          })

     }, []);

     return (
          <View style={styles.container}>
               <FlatList
                    data={drafts}

                    renderItem={({ item }) => {
                         return(<DraftCard draft={item}/>)
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
     headerRightButton:{
          marginRight:20,

     },
     headerRightButtonText:{
          fontSize:18,
          fontWeight:'bold',

     }
});
export default DraftsScreen;

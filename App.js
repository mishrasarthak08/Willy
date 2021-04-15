import * as React from 'react';
import { Text, View, StyleSheet,Image } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs'
import TransactionScreen from './screens/transaction'
import SearchScreen from'./screens/search'


export default class App extends React.Component {
  
  render(){
  return (
    <Appcontainer/>
    
  );}
}
const TabNavigator = createBottomTabNavigator({
  Transact:{screen:TransactionScreen},
  Search:{screen:SearchScreen}
},
{
  defaultNavigationOptions:({navigation})=>({
    tabBarIcon:()=>{
    const routeName = navigation.state.routeName
    if(routeName==="Transact"){
    return(
      <Image source  = {require("./assets/book.png")} style = {{width:"40px" ,height:"40px"}}/>
    )
    } 
    else if(routeName==="Search"){
      return(
        <Image source  = {require("./assets/searchingbook.png")} style = {{width:"40px" ,height:"40px"}}/>
      )
      } 
    }
  })

  
}
)
const Appcontainer = createAppContainer(TabNavigator)
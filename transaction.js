import * as React from 'react';
import { Text, View, StyleSheet,TouchableOpacity,TextInput, Image, Alert} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner'
import * as Permissions from 'expo-permissions'
import db from '../config'
import firebase from "firebase"

export default class TransactionScreen extends React.Component {
  constructor(){
    super()
    this.state={
      hasCameraPermissions:null,
      scanned:false,
      scannedBookId:"",
      scannedStudentId:'',
      buttonstate:"normal"
    }
  }
initiatebookissue=async()=>{
    db.collection("transaction").add({
        "studentId":this.state.scannedStudentId,
         "bookId":this.state.scannedBookId,
         "date":firebase.firestore.Timestamp.now().toDate(),
         "transactiontype":"Issue",

    })
    db.collection("books").doc(this.state.scannedBookId).update({
        "bookAvailability":false
    })
    db.collection("students").doc(this.state.scannedStudentId).update({
        "numberOfBooksIssued":firebase.firestore.FieldValue.increment(1)
    })
    Alert.alert("Book Issued")
    this.setState({
        scannedBookId:'',
        scannedStudentId:''
    })
}

initiatebookreturn=async()=>{
    db.collection("transaction").add({
        "studentId":this.state.scannedStudentId,
         "bookId":this.state.scannedBookId,
         "date":firebase.firestore.Timestamp.now().toDate(),
         "transactiontype":"Return",

    })
    db.collection("books").doc(this.state.scannedBookId).update({
        "bookAvailability":true
    })
    db.collection("students").doc(this.state.scannedStudentId).update({
        "numberOfBooksIssued":firebase.firestore.FieldValue.increment(-1)
    })
    Alert.alert("Book Returned")
    this.setState({
        scannedBookId:'',
        scannedStudentId:''
    })
}

handletransacton=async()=>{
var transactionmessage;
db.collection("books").doc(this.state.scannedBookId).get()
.then((doc)=>{
    var book= doc.data()
    if(book.bookAvailability){
this.initiatebookissue()
transactionmessage = "bookissued"
    }
    else {
        this.initiatebookreturn()
        transactionmessage = "book returned"
    }
})
}

  getcamerapermission=async(ID)=>{
    const {status} = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCameraPermissions:status==="granted",
      buttonstate:ID,
      scanned:false
    })
  }
  handlebarcodescan=async({type,data})=>{
      if(this.state.buttonstate==="bookId"){
        this.setState({
            scanned:true,
            scannedBookId:data,
            buttonstate:"normal",
          })
      }
      else if(this.state.buttonstate==="studentId"){
        this.setState({
            scanned:true,
            scannedStudentId:data,
            buttonstate:"normal",
          })
      }

  }
  render(){
    if(this.state.buttonstate!=="normal" && this.state.hasCameraPermissions){
return(
  <BarCodeScanner onBarCodeScanned = {

this.state.scanned ? undefined : this.handlebarcodescan  } style={StyleSheet.absoluteFillObject}/>
)
    }
    else if(this.state.buttonstate==="normal"){
    
  return (
    <View style = {styles.container}>
        <View>
        <Image source  = {require("../assets/booklogo.jpg")} style = {{width:"200px" ,height:"200px"}}/>
        <Text style = {{textAlign:"center",fontSize:30}}>WILY</Text>
            </View>
     <View style = {styles.input}>
         <TextInput placeholder = "Book ID" style = {styles.inputbox} value = {this.state.scannedBookId}/>
         <TouchableOpacity style = {styles.scanbutton} onPress={()=>{
             this.getcamerapermission('bookId')
         }} >
             <Text style = {styles.buttontext}>Scan</Text>
             </TouchableOpacity>
     </View>
     <View style = {styles.input}>
         <TextInput placeholder = "Student ID" style = {styles.inputbox} value = {this.state.scannedStudentId}/>
         <TouchableOpacity style = {styles.scanbutton} onPress={()=>{
             this.getcamerapermission('studentId')
         }}>
             <Text style = {styles.buttontext}>Scan</Text>
             </TouchableOpacity>
     </View>
     <TouchableOpacity style = {styles.submitbutton} onPress = {async()=>{this.handletransacton}}>
        < Text style = {styles.submitbuttontext}>SUBMIT</Text>
         </TouchableOpacity>
    </View>
  );}}
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },
  scanbutton:{
    backgroundColor:"yellow",
    margin:10,
    padding:10,
    width:70,
    borderWidth:1.5,
    borderLeftWidth:0,

  },
  buttontext:{
    fontSize:15,
    textAlign:"center",
    marginTop:10,
  },
  input:{
      flexDirection:"row",
      margin:20,
  },
  inputbox:{
      width:200,
      height:40,
      borderWidth:1.5,
      borderRightWidth:0,
      fontSize:20
  },
  submitbutton:{
backgroundColor:"yellow",
width:100,
height:50
  },
  submitbuttontext:{
padding:10,
textAlign:"center",
fontSize:20,
fontWeight:"bold",
color:"white"
  }
})
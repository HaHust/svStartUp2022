import React,{useContext} from 'react'
import { View, Text, Button, TouchableOpacity ,StyleSheet,Dimensions,ImageBackground} from 'react-native'
import firebase from '../database/config'
import {AuthContext} from '../navigations/AuthContext'
import LinearGradient from 'react-native-linear-gradient'
const { width, height } = Dimensions.get("window")
const Option = ({navigation}) => {
    const { user, setUser} = useContext(AuthContext);
    const signOut =  ()=>{
        firebase.auth().signOut()
        .then(()=>{
            setUser(null)
        })
        .catch((error)=>{
        })
    }
    return (
            <View style={styles.container}>
                <ImageBackground style= {styles.image} source ={require('../assets/pictures/BackGround.jpg')}>
                <View style={styles.Logout}>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#0AC4BA', '#2BDA8E']} style={styles.LogoutColor}>
                        <TouchableOpacity onPress={signOut}>
                            <Text style={{fontSize:24,color:'white',fontWeight:'bold'}} >Đăng xuất</Text>
                        </TouchableOpacity>
                        </LinearGradient>
                </View>
                <View style={styles.about}>
                    <Text style={{fontSize:20,textAlign: 'center'}}>Sản phẩm theo dõi bình truyền dịch y tế của nhóm BK307 dự thi chung kết sáng tạo trẻ năm 2021</Text>
                </View>
                </ImageBackground>
            </View>
    )
}

const styles = StyleSheet.create({
    container:{
        alignItems:'center',
        justifyContent:'center',
        flex:1
    },
    Logout:{
        width:width-50,
        flex:1,
        height:100,
        marginTop:40
    },
    LogoutColor:{
        alignItems:'center',
        padding:10,
        borderRadius:10
    },
    about:{
        flex:1,
        justifyContent:'flex-start',
        width:width-50,

    },
    image: {
        flex: 1,
        alignItems:'center',
        width:width,
  },
})

export default Option 

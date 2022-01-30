import React, { useState, useEffect, useContext } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Image,
    Text,
    Dimensions,
    Animated,
    Button,
    ImageBackground,
    FlatList,
    TouchableOpacity
} from 'react-native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import firebase from '../database/config'
import Modal from 'react-native-modal';
import { TextInput } from 'react-native-paper'
import { AuthContext } from '../navigations/AuthContext'
import LinearGradient from 'react-native-linear-gradient'
import { createIconSetFromFontello } from 'react-native-vector-icons';

const { width, height } = Dimensions.get("window")

let index = null
let dataUser = {}
const Dashboardmemo = (() => {
    const { user, setUser } = useContext(AuthContext);

    const [data, setData] = useState([])
    const [flag, setFlag] = useState(false)
    const [show, setShow] = useState(false)
    const [isCalib, setIsCalib] = useState(false)

    const rootRef = firebase.database().ref();
    const animalRef = rootRef.child('/').orderByKey();
    const List = (props) => {
        const [showColor, setShowColor] = useState(false)
        useEffect(() => {
            const interval = setTimeout(() => {
                setShowColor(!showColor);
                return () => {
                    clearInterval(interval)
                }
            }, 400);
        })
        let timer = "";
        if (props.data.time.length == undefined) { }

        else if (props.data.time.length > 5) {
            timer = props.data.time.substring(0, 2);
        }
        else {
            timer = props.data.time
        }
        return (
            <>
                <TouchableOpacity onPress={() => { index = props.data.id; setShow(true); console.log(index) }} style={props.data.velo > 200 ? (showColor) ? styles.warningDrop : styles.warningDropNo : styles.warningDropNo}>
                    <View style={styles.title}>
                        <View >
                            <Text style={styles.header}>Tên</Text>
                            <Text>{props.data.name}( {props.data.bedId})</Text>
                        </View>
                        <View style={styles.datas}>
                            <View style={styles.data}>
                                <Text style={styles.header}>Tốc độ</Text>
                                <Text>{props.data.velo}</Text>
                            </View>
                            <View style={styles.data}>
                                <Text style={styles.header}>Trạng thái</Text>
                                {props.data.stt ? <MCIcons name={'water'} size={25} /> : <MCIcons name={'water-off'} size={25} />}
                            </View>
                            <View style={styles.data}>
                                <Text style={styles.header}>Thời gian</Text>
                                <Text style={timer >= 15 ? styles.warningTime : styles.warningTimeNo}>{timer}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </>
        )
    }

    useEffect(() => {
        animalRef.on('value', (child) => {
            let dataTemp = []
            child.forEach((doc) => {
                let key = doc.key
                let childData = doc.val()
                childData = { ...childData, id: key }
                dataTemp.push(childData)
            })
            if (flag) {
                dataTemp.sort((a, b) => {
                    return a.time - b.time
                })
            }
            else {
                dataTemp.sort((a, b) => {
                    return -a.time + b.time
                })
            }
            setData(dataTemp)
        })
    }, [flag])
    data.forEach((it) => {
        if (it.id == index) {
            dataUser = it
        }
    })
    const setDataName = () => {
        const modifyData = rootRef.child(`${dataUser.id}`).update({
            name: dataUser.name,
            bedId: dataUser.bedId
        });
        setShow(false)
    }
    // Calib velocity
    const setCalib = () => {
      rootRef.child(`${dataUser.id}`).get().then((snapshot) => {
        rootRef.child(`${dataUser.id}`).update({
          calibVelo: snapshot.val().velo,
          isCalib: true
        });
        alert("da cap nhat")
      }).catch((e)=>{
        console.log(e);
      })
    }

    return (
        <View style={styles.container}>

            <View style={styles.order}>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { setFlag(!flag) }} >
                    <Text style={{ color: 'gray', marginTop: 3 }}>Sắp xếp</Text>
                    <MCIcons name={'menu-swap'} size={25} color={'gray'} />
                </TouchableOpacity>
            </View>
            <View style={{ backgroundColor: '#f5f5f5', height: 13 }}>

            </View>
            <View style={{ alignItems: 'center', width: width, marginBottom: 50 }}>
                <FlatList
                    data={data}
                    renderItem={(it,) => {
                        return (<List data={it.item}></List>)

                    }}
                    keyExtractor={item => item.id}
                />
            </View>
            <Modal
                isVisible={show}
                animationIn="slideInLeft"
                animationOut="slideOutRight"
                style={{
                    height: 500,
                }}
            >
                <View style={styles.modals}>
                    <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 10 }}>
                        <TouchableOpacity onPress={() => setShow(false)} style={{ alignItems: 'flex-end' }}>
                            <MCIcons name={'close-octagon-outline'} size={30} color={'#0AC4BA'} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Thông tin bệnh nhân</Text>
                    </View>
                    <TextInput
                        label='Tên'
                        mode='outlined'
                        onChangeText={text => dataUser.name = text}
                        placeholder={dataUser.name}

                    />
                    <TextInput
                        label='Giường Bệnh'
                        mode='outlined'
                        onChangeText={text => dataUser.bedId = text}
                        placeholder={dataUser.bedId}
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 15, marginTop: 10 }}>Tốc độ chảy:  </Text>
                        <Text style={{ fontSize: 15, marginTop: 10 }}>{dataUser.velo} giọt/phút</Text>
                            <TouchableOpacity style={styles.buttonCalib} onPress={setCalib}>
                                <Text style={styles.textCalib}>Hiệu chuẩn</Text>
                            </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', marginVertical: 5, }}>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#0AC4BA', '#2BDA8E']} style={{ borderRadius: 10 }}>
                            <TouchableOpacity style={{ width: 150, height: 40, alignItems: 'center', justifyContent: 'center' }} onPress={setDataName}>
                                <Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold' }}>Đồng ý</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
            </Modal>
        </View >
    )
}
)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    setZero: {
        marginLeft: 60,
        width: 100,
        height: 30,
        borderRadius: 5
    },
    setZero1: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    order: {
        paddingRight: 15,
        paddingVertical: 8,
        width: width,
        alignItems: 'flex-end',
        backgroundColor: 'white',
    },
    title: {
        width: width * 0.9,
        borderWidth: 1,
        flexDirection: 'row',
        height: 70,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        borderRadius: 10,

    },
    header: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    datas: {
        flexDirection: 'row',
    },
    data: {
        marginHorizontal: 15,
        alignItems: 'center'
    },
    warningTime: {
        color: 'red',
        fontSize: 18
    },
    warningTimeNo: {
        color: 'brown',
        fontSize: 18
    },
    warningDrop: {
        margin: 2,
        borderRadius: 10,
        backgroundColor: '#d3e0ea',
    },
    warningDropNo: {
        backgroundColor: '#f6f5f5',
        margin: 2,
        borderRadius: 10,
    },
    modals: {
        flexDirection: 'column',
        backgroundColor: 'white',

        padding: 20,
        borderRadius: 20,
    },
    buttonCalib: {
      borderRadius:10,
      marginLeft:10,
      marginTop:5,
      backgroundColor:'#0AC4BA',
      width: 120, 
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonWithoutCalib: {
      borderRadius:10,
      marginLeft:10,
      marginTop:5,
      backgroundColor:'#0AC4BA',
      width: 120, 
      height: 30,
      alignItems: 'center',
      justifyContent: 'center'
    },
    textCalib: { fontSize: 15, color: '#fff', fontWeight: 'bold' },
    textWithoutCalib: { fontSize: 15, color: '#000', fontWeight: 'bold' },
})
export default Dashboard = React.memo(Dashboardmemo)

import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { Platform, StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, Keyboard, useEffect } from 'react-native';
import Task from './components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles/styles.js';

export default function App() {

  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);

  const handleAddTask = () => {
    Keyboard.dismiss();

    const newTaskItems = [...taskItems, task]
        setTaskItems(newTaskItems);
        storeData(newTaskItems);
        setTask(null);
  };

  const x = () => {
    useEffect(() => AsyncStorage.getItem('store').then(data => setTaskItems(JSON.parse(data)), [setTaskItems]));
  }

  // useEffect( () => {
  //   AsyncStorage.getItem('@tasks')
  //     .then(data => setTaskItems(JSON.parse(data)), [setTaskItems])
  // });

  const completeTask = (index) => {
    var itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
    storeData(taskItems);
  }

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('@tasks', JSON.stringify(value))
      console.log('store', JSON.stringify(taskItems));
    } catch (e) {
      console.log('error');
    }
  }

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@tasks')
      if(value !== null) {
        console.log('get', JSON.parse(value));
      } 
    } catch(e) {
      console.log('error get');
    }
  }
   
  return (
    <View style={styles.container}>
      <View style={styles.tasksContainer}>
        <Text style={styles.title}>Tareas diarias</Text>

        <View style={styles.items}>
          {
            taskItems.map((item, index) => {
              return (
              <TouchableOpacity key={index} onPress={() => completeTask(index)}>
                <Task text={item}/>
              </TouchableOpacity>
              )
            })
          }
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.writeTaskWrapper}>
          <TextInput style={styles.input} placeholder={'Escribe una tarea'} value={task} onChangeText={text => setTask(text)}/>
          <TouchableOpacity onPress={() => handleAddTask()}>
            <View style={styles.addWrapper}>
              <Text style={styles.addText}>+</Text>
            </View>
          </TouchableOpacity>
      </KeyboardAvoidingView>

    </View>
  );
}
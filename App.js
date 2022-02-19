import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { Platform, Text, View, Image, KeyboardAvoidingView, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import Task from './components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles/styles.js';

export default function App() {

  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);

  useEffect( () => {
    AsyncStorage.getItem('@tasks')
      .then(data => setTaskItems(JSON.parse(data)), [setTaskItems])
      if(taskItems == null){
        taskItems = [];
      }
  });

  const completeTask = (index) => {
    taskItems.splice(index, 1);
    storeData(taskItems);
  }

  const handleAddTask = () => {
    Keyboard.dismiss();

    if(task != null){
      const newTaskItems = [...taskItems, task]
              setTaskItems(newTaskItems);
              storeData(newTaskItems);
              setTask(null);
        };
    }

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('@tasks', JSON.stringify(value))
      // console.log('store', JSON.stringify(taskItems));
      // console.log('test', taskItems);
    } catch (e) {
      console.log('error');
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
          <TextInput style={[styles.input, styles.shadow]} placeholder={'Escribe una tarea'} value={task} onChangeText={text => setTask(text)}/>
          <TouchableOpacity onPress={() => handleAddTask()}>
            <Image source={require('./assets/plus.png')} />
          </TouchableOpacity>
      </KeyboardAvoidingView>

    </View>
  );
}
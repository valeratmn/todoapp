import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  TextInput,
  Button,
  Platform,
  AppStateStatus,
  AppState,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import {runOnJS} from 'react-native-reanimated';
import TaskItem from './TaskItem';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Ошибка при загрузке задач:', error);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error('Ошибка при сохранении задач:', error);
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (nextAppState === 'background' || nextAppState === 'inactive') {
          saveTasks();
        }
      },
    );

    return () => {
      subscription.remove();
      saveTasks();
    };
  }, [tasks]);

  const addTask = useCallback(() => {
    if (newTask.trim()) {
      setTasks(prev => [
        ...prev,
        {id: Date.now().toString(), text: newTask, completed: false},
      ]);
      setNewTask('');
    }
  }, [newTask]);

  const updateTask = useCallback((index: number, newText: string) => {
    setTasks(prev =>
      prev.map((task, i) => (i === index ? {...task, text: newText} : task)),
    );
  }, []);

  const deleteTask = useCallback((index: number) => {
    setTasks(prev => prev.filter((_, i) => i !== index));
  }, []);

  const toggleTaskComplete = useCallback((index: number) => {
    setTasks(prev =>
      prev.map((task, i) =>
        i === index ? {...task, completed: !task.completed} : task,
      ),
    );
  }, []);

  const handleDragEnd = useCallback(({data}: {data: Task[]}) => {
    runOnJS(setTasks)(data);
  }, []);

  const renderItem = useCallback(
    ({item, drag}: RenderItemParams<Task>) => {
      const index = tasks.indexOf(item);
      return (
        <TaskItem
          task={item}
          index={index}
          updateTask={updateTask}
          deleteTask={deleteTask}
          toggleComplete={toggleTaskComplete}
          drag={drag}
        />
      );
    },
    [tasks, updateTask, deleteTask, toggleTaskComplete],
  );

  return (
    <View style={{flex: 1}}>
      <View style={{padding: 10}}>
        <TextInput
          placeholder="Добавить задачу"
          value={newTask}
          onChangeText={setNewTask}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            padding: 10,
            marginBottom: 10,
          }}
        />
        <Button title="Добавить" onPress={addTask} />
      </View>
      <DraggableFlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onDragEnd={handleDragEnd}
        contentContainerStyle={{padding: 10}}
      />
    </View>
  );
};

export default TaskList;

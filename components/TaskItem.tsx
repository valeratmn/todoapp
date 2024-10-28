import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface TaskItemProps {
  task: {text: string; completed: boolean};
  index: number;
  updateTask: (index: number, newText: string) => void;
  deleteTask: (index: number) => void;
  drag: () => void;
  toggleComplete: (index: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  index,
  updateTask,
  deleteTask,
  drag,
  toggleComplete,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [taskText, setTaskText] = useState<string>(task.text);

  const handleEdit = () => {
    updateTask(index, taskText);
    setIsEditing(false);
  };

  return (
    <TouchableOpacity
      onLongPress={drag}
      delayLongPress={200}
      style={styles.container}>
      <View style={styles.taskContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => toggleComplete(index)}>
          {task.completed && <View style={styles.checkboxInner} />}
        </TouchableOpacity>

        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              value={taskText}
              onChangeText={setTaskText}
              style={styles.input}
            />
            <Button title="Сохранить" onPress={handleEdit} />
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={styles.textContainer}>
            <Text
              style={[styles.taskText, task.completed && styles.completedTask]}>
              {task.text}
            </Text>
          </TouchableOpacity>
        )}
        <Button title="Удалить" onPress={() => deleteTask(index)} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 5,
    borderRadius: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 3,
  },
  textContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 12,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#666',
    borderRadius: 6,
  },
});

export default TaskItem;

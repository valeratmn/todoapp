import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface ISortBarProps {
  sortType: 'all' | 'completed';
  setSortType: (type: 'all' | 'completed') => void;
}

const SORT_LABELS = {
  all: 'Все задачи',
  completed: 'Выполненные задачи',
};

export const SortBar = ({sortType, setSortType}: ISortBarProps) => {
  return (
    <TouchableOpacity
      style={styles.sortButton}
      onPress={() => setSortType(sortType === 'all' ? 'completed' : 'all')}>
      <Text style={styles.text}>{SORT_LABELS[sortType]}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  sortButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});


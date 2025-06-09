import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useGroups } from '../context/GroupContext';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type CreateGroupScreenProps = StackScreenProps<RootStackParamList, 'CreateGroup'>;

const CreateGroupScreen: React.FC<CreateGroupScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { createGroup, loading } = useGroups();

  const handleCreateGroup = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    try {
      const newGroup = await createGroup(name, description);
      navigation.navigate('Group', { groupId: newGroup.id, groupName: newGroup.name });
    } catch (error) {
      Alert.alert('Error', 'Failed to create group. Please try again.');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create a New Group</Text>
          
          <TextInput
            label="Group Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            multiline
            numberOfLines={4}
          />
          
          <Button 
            mode="contained" 
            onPress={handleCreateGroup} 
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Create Group
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 10,
    paddingVertical: 6,
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 6,
  },
});

export default CreateGroupScreen;
import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { TextInput, Button, Card, Paragraph, Text, ActivityIndicator } from 'react-native-paper';
import { useGroups } from '../context/GroupContext';
import { useAuth } from '../context/AuthContext';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type ChatScreenProps = StackScreenProps<RootStackParamList, 'Chat'>;

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
  const { groupId, groupName } = route.params;
  const [message, setMessage] = useState('');
  const { getGroupMessages, sendMessage, loading } = useGroups();
  const { user } = useAuth();
  
  const messages = getGroupMessages(groupId);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    await sendMessage(groupId, message);
    setMessage('');
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const renderMessageItem = ({ item }: { item: any }) => {
    const isCurrentUser = item.userId === user?.id;
    
    return (
      <View style={[styles.messageContainer, isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}>
        <Card style={[styles.messageCard, isCurrentUser ? styles.currentUserCard : styles.otherUserCard]}>
          <Card.Content>
            <View style={styles.messageHeader}>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
            </View>
            <Paragraph>{item.text}</Paragraph>
          </Card.Content>
        </Card>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={80}
    >
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        inverted={false}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          style={styles.input}
          multiline
        />
        <Button
          mode="contained"
          onPress={handleSendMessage}
          disabled={!message.trim()}
          style={styles.sendButton}
        >
          Send
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
  },
  messageCard: {
    borderRadius: 12,
  },
  currentUserCard: {
    backgroundColor: '#e3f2fd',
  },
  otherUserCard: {
    backgroundColor: 'white',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    maxHeight: 100,
  },
  sendButton: {
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default ChatScreen;
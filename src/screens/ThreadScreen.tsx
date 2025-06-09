import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { TextInput, Button, Card, Paragraph, Text, ActivityIndicator, Divider } from 'react-native-paper';
import { useGroups } from '../context/GroupContext';
import { useAuth } from '../context/AuthContext';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type ThreadScreenProps = StackScreenProps<RootStackParamList, 'Thread'>;

const ThreadScreen: React.FC<ThreadScreenProps> = ({ navigation, route }) => {
  const { groupId, messageId, parentMessage } = route.params;
  const [reply, setReply] = useState('');
  const { getThreadMessages, sendMessage, loading } = useGroups();
  const { user } = useAuth();
  
  const replies = getThreadMessages(groupId, messageId);

  const handleSendReply = async () => {
    if (!reply.trim()) return;
    
    await sendMessage(groupId, reply, messageId);
    setReply('');
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const renderParentMessage = () => (
    <View style={styles.parentMessageContainer}>
      <Card style={styles.parentMessageCard}>
        <Card.Content>
          <View style={styles.messageHeader}>
            <Text style={styles.username}>{parentMessage.username}</Text>
            <Text style={styles.timestamp}>{formatTimestamp(parentMessage.timestamp)}</Text>
          </View>
          <Paragraph>{parentMessage.text}</Paragraph>
        </Card.Content>
      </Card>
    </View>
  );

  const renderReplyItem = ({ item }: { item: any }) => {
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
        data={replies}
        renderItem={renderReplyItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={<>
          {renderParentMessage()}
          <Divider style={styles.divider} />
          <Text style={styles.repliesTitle}>Replies</Text>
        </>}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No replies yet. Be the first to reply!</Text>
          </View>
        }
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          value={reply}
          onChangeText={setReply}
          placeholder="Type a reply..."
          style={styles.input}
          multiline
        />
        <Button
          mode="contained"
          onPress={handleSendReply}
          disabled={!reply.trim()}
          style={styles.sendButton}
        >
          Reply
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
  parentMessageContainer: {
    marginBottom: 16,
  },
  parentMessageCard: {
    backgroundColor: '#f0f0f0',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  divider: {
    marginVertical: 16,
  },
  repliesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
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
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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

export default ThreadScreen;
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Paragraph, Text } from 'react-native-paper';

type MessageItemProps = {
  message: {
    id: string;
    text: string;
    userId: string;
    username: string;
    timestamp: number;
    replies?: string[];
  };
  currentUserId?: string;
  onPress?: () => void;
  showReplies?: boolean;
};

const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  currentUserId, 
  onPress, 
  showReplies = true 
}) => {
  const isCurrentUser = message.userId === currentUserId;
  
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={[styles.messageContainer, isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}
    >
      <Card style={[styles.messageCard, isCurrentUser ? styles.currentUserCard : styles.otherUserCard]}>
        <Card.Content>
          <View style={styles.messageHeader}>
            <Text style={styles.username}>{message.username}</Text>
            <Text style={styles.timestamp}>{formatTimestamp(message.timestamp)}</Text>
          </View>
          <Paragraph>{message.text}</Paragraph>
          {showReplies && message.replies && message.replies.length > 0 && (
            <Text style={styles.repliesCount}>{message.replies.length} replies</Text>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  repliesCount: {
    marginTop: 8,
    fontSize: 12,
    color: 'blue',
  },
});

export default MessageItem;
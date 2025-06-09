import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph, Button, ActivityIndicator, Divider } from 'react-native-paper';
import { useGroups } from '../context/GroupContext';
import { useAuth } from '../context/AuthContext';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type GroupScreenProps = StackScreenProps<RootStackParamList, 'Group'>;

const GroupScreen: React.FC<GroupScreenProps> = ({ navigation, route }) => {
  const { groupId } = route.params;
  const { groups, loading, getGroupMessages, joinGroup, leaveGroup } = useGroups();
  const { user } = useAuth();

  const group = groups.find(g => g.id === groupId);
  const messages = getGroupMessages(groupId);
  const isMember = group?.members.includes(user?.id || '');

  const handleJoinGroup = async () => {
    await joinGroup(groupId);
  };

  const handleLeaveGroup = async () => {
    await leaveGroup(groupId);
    navigation.goBack();
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const renderMessageItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Thread', { 
        groupId, 
        messageId: item.id,
        parentMessage: item
      })}
    >
      <Card style={styles.messageCard}>
        <Card.Content>
          <View style={styles.messageHeader}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
          </View>
          <Paragraph>{item.text}</Paragraph>
          {(item.replies?.length > 0) && (
            <Text style={styles.repliesCount}>{item.replies.length} replies</Text>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!group) {
    return (
      <View style={styles.errorContainer}>
        <Text>Group not found</Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.groupInfo}>
        <Title>{group.name}</Title>
        <Paragraph>{group.description}</Paragraph>
        <Text style={styles.memberCount}>{group.members.length} members</Text>
        
        {!isMember ? (
          <Button mode="contained" onPress={handleJoinGroup} style={styles.joinButton}>
            Join Group
          </Button>
        ) : (
          <Button mode="outlined" onPress={handleLeaveGroup} style={styles.leaveButton}>
            Leave Group
          </Button>
        )}
      </View>
      
      <Divider />
      
      <View style={styles.messagesContainer}>
        <View style={styles.messagesHeader}>
          <Text style={styles.messagesTitle}>Conversations</Text>
          {isMember && (
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('Chat', { groupId, groupName: group.name })}
              style={styles.newChatButton}
            >
              New Message
            </Button>
          )}
        </View>
        
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet. Start a conversation!</Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  groupInfo: {
    padding: 16,
    backgroundColor: 'white',
  },
  memberCount: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  joinButton: {
    marginTop: 16,
  },
  leaveButton: {
    marginTop: 16,
    borderColor: 'red',
    color: 'red',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messagesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  messagesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  newChatButton: {
    marginLeft: 10,
  },
  listContainer: {
    paddingBottom: 16,
  },
  messageCard: {
    marginBottom: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  username: {
    fontWeight: 'bold',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
  },
});

export default GroupScreen;
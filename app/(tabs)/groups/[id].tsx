import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGroups } from '@/context/GroupContext';
import { useAuth } from '@/context/AuthContext';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Users, MessageCircle, Plus, UserPlus, UserMinus } from 'lucide-react-native';

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { groups, joinGroup, leaveGroup } = useGroups();
  const { user } = useAuth();

  const group = groups.find(g => g.id === id);
  const isMember = group?.members.includes(user?.id || '');
  const messages = group?.messages.filter(msg => !msg.parentId) || [];

  const handleJoinGroup = async () => {
    if (!id) return;
    const success = await joinGroup(id);
    if (!success) {
      Alert.alert('Error', 'Failed to join group');
    }
  };

  const handleLeaveGroup = async () => {
    if (!id) return;
    Alert.alert(
      'Leave Group',
      'Are you sure you want to leave this group?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            const success = await leaveGroup(id);
            if (success) {
              router.back();
            } else {
              Alert.alert('Error', 'Failed to leave group');
            }
          },
        },
      ]
    );
  };

  if (!group) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Group not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderMessagePreview = (message: any) => (
    <TouchableOpacity
      key={message.id}
      style={styles.messagePreview}
      onPress={() => router.push(`/messages/${id}/${message.id}`)}
    >
      <View style={styles.messageHeader}>
        <Text style={styles.messageAuthor}>{message.username}</Text>
        <Text style={styles.messageTime}>
          {new Date(message.timestamp).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.messageText} numberOfLines={2}>
        {message.text}
      </Text>
      {message.replies && message.replies.length > 0 && (
        <Text style={styles.repliesCount}>
          {message.replies.length} replies
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[group.color || '#6366f1', '#8b5cf6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Image source={{ uri: group.avatar }} style={styles.headerAvatar} />
            <View>
              <Text style={styles.headerTitle}>{group.name}</Text>
              <Text style={styles.headerSubtitle}>
                {group.members.length} members
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Group Info */}
        <View style={styles.infoCard}>
          <Text style={styles.description}>{group.description}</Text>
          
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Users size={20} color="#6366f1" />
              <Text style={styles.statText}>{group.members.length} members</Text>
            </View>
            <View style={styles.statItem}>
              <MessageCircle size={20} color="#10b981" />
              <Text style={styles.statText}>{group.messages.length} messages</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {!isMember ? (
              <TouchableOpacity
                style={styles.joinButton}
                onPress={handleJoinGroup}
              >
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  style={styles.buttonGradient}
                >
                  <UserPlus size={20} color="white" />
                  <Text style={styles.joinButtonText}>Join Group</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.chatButton}
                  onPress={() => router.push(`/messages/${id}/chat`)}
                >
                  <LinearGradient
                    colors={['#6366f1', '#8b5cf6']}
                    style={styles.buttonGradient}
                  >
                    <Plus size={20} color="white" />
                    <Text style={styles.chatButtonText}>New Message</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.leaveButton}
                  onPress={handleLeaveGroup}
                >
                  <UserMinus size={20} color="#ef4444" />
                  <Text style={styles.leaveButtonText}>Leave Group</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Recent Messages */}
        {isMember && (
          <View style={styles.messagesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Conversations</Text>
              <TouchableOpacity onPress={() => router.push(`/messages/${id}`)}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            {messages.length > 0 ? (
              <View style={styles.messagesList}>
                {messages.slice(0, 3).map(renderMessagePreview)}
              </View>
            ) : (
              <View style={styles.emptyMessages}>
                <MessageCircle size={48} color="#9ca3af" />
                <Text style={styles.emptyTitle}>No messages yet</Text>
                <Text style={styles.emptyDescription}>
                  Start the conversation by sending the first message
                </Text>
                <TouchableOpacity
                  style={styles.startChatButton}
                  onPress={() => router.push(`/messages/${id}/chat`)}
                >
                  <Text style={styles.startChatButtonText}>Start Conversation</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    marginTop: -16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    lineHeight: 24,
    marginBottom: 24,
  },
  stats: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  actionButtons: {
    gap: 12,
  },
  joinButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  chatButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  joinButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  chatButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#fef2f2',
    gap: 8,
  },
  leaveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ef4444',
  },
  messagesSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
  },
  seeAll: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6366f1',
  },
  messagesList: {
    gap: 12,
  },
  messagePreview: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageAuthor: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
  },
  messageTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 8,
  },
  repliesCount: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6366f1',
  },
  emptyMessages: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  startChatButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  startChatButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
});
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

type Message = {
  id: string;
  text: string;
  userId: string;
  username: string;
  timestamp: number;
  parentId?: string;
  replies?: string[];
};

type Group = {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  members: string[];
  messages: Message[];
  avatar?: string;
  color?: string;
};

type GroupContextType = {
  groups: Group[];
  loading: boolean;
  createGroup: (name: string, description: string) => Promise<Group>;
  joinGroup: (groupId: string) => Promise<boolean>;
  leaveGroup: (groupId: string) => Promise<boolean>;
  sendMessage: (groupId: string, text: string, parentId?: string) => Promise<Message | null>;
  getGroupMessages: (groupId: string) => Message[];
  getThreadMessages: (groupId: string, parentMessageId: string) => Message[];
};

const GroupContext = createContext<GroupContextType | undefined>(undefined);

const groupColors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
const groupAvatars = [
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  'https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  'https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
];

export const GroupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const groupsData = await AsyncStorage.getItem('groups');
        if (groupsData) {
          setGroups(JSON.parse(groupsData));
        } else {
          // Initialize with some mock data for demo purposes
          const initialGroups: Group[] = [
            {
              id: '1',
              name: 'General Discussion',
              description: 'A place for general conversations and announcements',
              createdBy: 'system',
              members: user ? [user.id] : [],
              avatar: groupAvatars[0],
              color: groupColors[0],
              messages: [
                {
                  id: '1',
                  text: 'Welcome to the General Discussion group! 👋',
                  userId: 'system',
                  username: 'System',
                  timestamp: Date.now() - 86400000,
                  replies: []
                }
              ]
            },
            {
              id: '2',
              name: 'Tech Talk',
              description: 'Discuss the latest in technology and development',
              createdBy: 'system',
              members: user ? [user.id] : [],
              avatar: groupAvatars[1],
              color: groupColors[1],
              messages: []
            }
          ];
          await AsyncStorage.setItem('groups', JSON.stringify(initialGroups));
          setGroups(initialGroups);
        }
      } catch (error) {
        console.error('Failed to load groups', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadGroups();
    }
  }, [user]);

  const saveGroups = async (updatedGroups: Group[]) => {
    try {
      await AsyncStorage.setItem('groups', JSON.stringify(updatedGroups));
      setGroups(updatedGroups);
    } catch (error) {
      console.error('Failed to save groups', error);
    }
  };

  const createGroup = async (name: string, description: string): Promise<Group> => {
    if (!user) throw new Error('User must be logged in');
    
    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      description,
      createdBy: user.id,
      members: [user.id],
      messages: [],
      avatar: groupAvatars[Math.floor(Math.random() * groupAvatars.length)],
      color: groupColors[Math.floor(Math.random() * groupColors.length)],
    };

    const updatedGroups = [...groups, newGroup];
    await saveGroups(updatedGroups);
    return newGroup;
  };

  const joinGroup = async (groupId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const updatedGroups = groups.map(group => {
        if (group.id === groupId && !group.members.includes(user.id)) {
          return {
            ...group,
            members: [...group.members, user.id]
          };
        }
        return group;
      });

      await saveGroups(updatedGroups);
      return true;
    } catch (error) {
      console.error('Failed to join group', error);
      return false;
    }
  };

  const leaveGroup = async (groupId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const updatedGroups = groups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            members: group.members.filter(id => id !== user.id)
          };
        }
        return group;
      });

      await saveGroups(updatedGroups);
      return true;
    } catch (error) {
      console.error('Failed to leave group', error);
      return false;
    }
  };

  const sendMessage = async (groupId: string, text: string, parentId?: string): Promise<Message | null> => {
    if (!user) return null;

    try {
      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        userId: user.id,
        username: user.username,
        timestamp: Date.now(),
        parentId,
        replies: []
      };

      const updatedGroups = groups.map(group => {
        if (group.id === groupId) {
          if (parentId) {
            const updatedMessages = group.messages.map(msg => {
              if (msg.id === parentId) {
                return {
                  ...msg,
                  replies: [...(msg.replies || []), newMessage.id]
                };
              }
              return msg;
            });
            
            return {
              ...group,
              messages: [...updatedMessages, newMessage]
            };
          }
          
          return {
            ...group,
            messages: [...group.messages, newMessage]
          };
        }
        return group;
      });

      await saveGroups(updatedGroups);
      return newMessage;
    } catch (error) {
      console.error('Failed to send message', error);
      return null;
    }
  };

  const getGroupMessages = (groupId: string): Message[] => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return [];
    
    return group.messages.filter(msg => !msg.parentId);
  };

  const getThreadMessages = (groupId: string, parentMessageId: string): Message[] => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return [];
    
    return group.messages.filter(msg => msg.parentId === parentMessageId);
  };

  return (
    <GroupContext.Provider value={{
      groups,
      loading,
      createGroup,
      joinGroup,
      leaveGroup,
      sendMessage,
      getGroupMessages,
      getThreadMessages
    }}>
      {children}
    </GroupContext.Provider>
  );
};

export const useGroups = (): GroupContextType => {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroups must be used within a GroupProvider');
  }
  return context;
};
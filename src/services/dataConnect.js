import { dataconnect } from '../lib/firebase';
import { 
  useCreateUser, 
  useGetUser, 
  useJoinServer, 
  useListJoinedServers,
  useSendMessage,
  useListMessages
} from '../dataconnect-generated/react';

/**
 * DataConnectService provides a high-performance relational bridge 
 * for the Swastik Platform.
 */
export const dataConnectService = {
  // Sync user profile to SQL
  async syncUser(userData) {
    try {
      // In a real scenario, we'd check if user exists first or use an upsert
      // For now, we provide the logic to be used in components
      return {
        id: userData.uid || userData.id,
        name: userData.displayName || userData.name,
        email: userData.email,
        university: userData.university,
        domain: userData.domain
      };
    } catch (err) {
      console.error("DC Sync Error:", err);
    }
  },

  // Get relational membership
  useUserServers(userId) {
    return useListJoinedServers({ userId });
  },

  // Send a message via SQL
  useChatActions() {
    const { mutate: sendMessage } = useSendMessage();
    return { sendMessage };
  }
};

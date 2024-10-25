import AsyncStorage from '@react-native-async-storage/async-storage';

const StorageKeys = {
  ALLOWS_NOTIFICATIONS: 'allowsNotifications',
  WALKTHROUGH_COMPLETED: 'walkthroughCompleted',
  LANGUAGE: 'userLanguage'
  // Add other keys as needed
};

export const AsyncStorageUtil = {
  getItem: async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error reading ${key} from AsyncStorage:`, error);
      return null;
    }
  },

  reset: async () => {
    try {
      await AsyncStorageUtil.setAllowsNotifications(false);
      console.log('Notifications preference reset to false');
    } catch (error) {
      console.error('Error resetting notifications preference:', error);
    }
  },

  setItem: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to AsyncStorage:`, error);
    }
  },

  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from AsyncStorage:`, error);
    }
  },

  // Specific methods for our app
  getAllowsNotifications: async () => {
    return await AsyncStorageUtil.getItem(StorageKeys.ALLOWS_NOTIFICATIONS);
  },

  setAllowsNotifications: async (value) => {
    await AsyncStorageUtil.setItem(StorageKeys.ALLOWS_NOTIFICATIONS, value);
  },

  setWalkthroughCompleted: async (value) => {
    try {
      await AsyncStorageUtil.setItem(StorageKeys.WALKTHROUGH_COMPLETED, value);
    } catch (error) {
      console.error('Error saving walkthrough completion status', error);
    }
  },

  getWalkthroughCompleted: async () => {
    try {
      const value = await AsyncStorage.getItem(StorageKeys.WALKTHROUGH_COMPLETED);
      return value != null ? JSON.parse(value) : false;
    } catch (error) {
      console.error('Error getting walkthrough completion status', error);
      return false;
    }
  },

  setUserLanguage: async (value) => {
    await AsyncStorageUtil.setItem(StorageKeys.LANGUAGE, value);
  },

  getUserLanguage: async () => {
    return await AsyncStorageUtil.getItem(StorageKeys.LANGUAGE);
  }
};
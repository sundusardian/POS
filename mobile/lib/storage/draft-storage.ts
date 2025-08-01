import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '../../app/(app)/pos/menu';

export interface DraftOrder {
  id: string;
  customerName?: string;
  customerPhone?: string;
  branchId: string;
  branchName: string;
  deskNumber?: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

const DRAFT_ORDERS_KEY = 'draft_orders';

export class DraftOrderStorage {
  static async saveDraftOrder(draft: Omit<DraftOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<DraftOrder> {
    try {
      const id = `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();
      
      const draftOrder: DraftOrder = {
        ...draft,
        id,
        createdAt: now,
        updatedAt: now,
      };

      const existingDrafts = await this.getDraftOrders();
      const updatedDrafts = [...existingDrafts, draftOrder];
      
      await AsyncStorage.setItem(DRAFT_ORDERS_KEY, JSON.stringify(updatedDrafts));
      return draftOrder;
    } catch (error) {
      console.error('Error saving draft order:', error);
      throw error;
    }
  }

  static async getDraftOrders(): Promise<DraftOrder[]> {
    try {
      const draftsJson = await AsyncStorage.getItem(DRAFT_ORDERS_KEY);
      return draftsJson ? JSON.parse(draftsJson) : [];
    } catch (error) {
      console.error('Error getting draft orders:', error);
      return [];
    }
  }

  static async updateDraftOrder(id: string, updates: Partial<Omit<DraftOrder, 'id' | 'createdAt'>>): Promise<DraftOrder | null> {
    try {
      const drafts = await this.getDraftOrders();
      const draftIndex = drafts.findIndex(draft => draft.id === id);
      
      if (draftIndex === -1) {
        return null;
      }

      const updatedDraft = {
        ...drafts[draftIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      drafts[draftIndex] = updatedDraft;
      await AsyncStorage.setItem(DRAFT_ORDERS_KEY, JSON.stringify(drafts));
      
      return updatedDraft;
    } catch (error) {
      console.error('Error updating draft order:', error);
      throw error;
    }
  }

  static async deleteDraftOrder(id: string): Promise<boolean> {
    try {
      const drafts = await this.getDraftOrders();
      const filteredDrafts = drafts.filter(draft => draft.id !== id);
      
      await AsyncStorage.setItem(DRAFT_ORDERS_KEY, JSON.stringify(filteredDrafts));
      return true;
    } catch (error) {
      console.error('Error deleting draft order:', error);
      return false;
    }
  }

  static async clearAllDrafts(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(DRAFT_ORDERS_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing draft orders:', error);
      return false;
    }
  }
}

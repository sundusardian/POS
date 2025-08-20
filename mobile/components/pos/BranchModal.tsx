import React from 'react'
import {
   View,
   Text,
   Modal,
   TouchableOpacity,
   FlatList,
   StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Branch } from '../../lib/api/types'

interface BranchModalProps {
   visible: boolean
   branches: Branch[]
   selectedBranch?: Branch | null
   onClose: () => void
   onSelectBranch: (branch: Branch) => void
}

export default function BranchModal({
   visible,
   branches,
   selectedBranch,
   onClose,
   onSelectBranch,
}: BranchModalProps) {
   const handleSelectBranch = (branch: Branch) => {
      onSelectBranch(branch)
      onClose()
   }

   return (
      <Modal visible={visible} animationType="slide" transparent={true}>
         <View style={styles.overlay}>
            <View style={styles.modal}>
               <View style={styles.header}>
                  <Text style={styles.title}>Select Branch</Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                     <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
               </View>

               <FlatList
                  data={branches}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                     <TouchableOpacity
                        style={[
                           styles.branchItem,
                           selectedBranch?.id === item.id && styles.selectedBranch
                        ]}
                        onPress={() => handleSelectBranch(item)}
                     >
                        <View style={styles.branchInfo}>
                           <View style={styles.branchHeader}>
                              <Text style={styles.branchName}>{item.name}</Text>
                              {selectedBranch?.id === item.id && (
                                 <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
                              )}
                           </View>
                           {item.address && (
                              <Text style={styles.branchAddress}>{item.address}</Text>
                           )}
                           {item.phone && (
                              <Text style={styles.branchPhone}>{item.phone}</Text>
                           )}
                           <View style={styles.statusContainer}>
                              <View style={[
                                 styles.statusDot,
                                 { backgroundColor: item.isActive ? '#4CAF50' : '#FF5722' }
                              ]} />
                              <Text style={[
                                 styles.statusText,
                                 { color: item.isActive ? '#4CAF50' : '#FF5722' }
                              ]}>
                                 {item.isActive ? 'Active' : 'Inactive'}
                              </Text>
                           </View>
                        </View>
                     </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                     <View style={styles.emptyState}>
                        <Ionicons name="business" size={48} color="#ccc" />
                        <Text style={styles.emptyStateText}>No branches available</Text>
                     </View>
                  }
               />
            </View>
         </View>
      </Modal>
   )
}

const styles = StyleSheet.create({
   overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
   },
   modal: {
      backgroundColor: '#fff',
      borderRadius: 15,
      width: '100%',
      maxWidth: 400,
      maxHeight: '80%',
   },
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
   },
   title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
   },
   closeButton: {
      padding: 5,
   },
   branchItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#f5f5f5',
   },
   selectedBranch: {
      backgroundColor: '#f0f8ff',
      borderLeftWidth: 4,
      borderLeftColor: '#007AFF',
   },
   branchInfo: {
      flex: 1,
   },
   branchHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
   },
   branchName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      flex: 1,
   },
   branchAddress: {
      fontSize: 14,
      color: '#666',
      marginBottom: 3,
   },
   branchPhone: {
      fontSize: 14,
      color: '#666',
      marginBottom: 8,
   },
   statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
   },
   statusText: {
      fontSize: 12,
      fontWeight: '500',
   },
   emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 50,
   },
   emptyStateText: {
      marginTop: 10,
      fontSize: 16,
      color: '#999',
   },
})

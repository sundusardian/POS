import React, { useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'

// This screen now redirects to the new screen-based flow
export default function POSCreateOrderScreen() {
   const params = useLocalSearchParams()
   
   useEffect(() => {
      // Redirect to the new menu screen with any parameters
      router.replace({
         pathname: '/(app)/pos/menu',
         params: params
      })
   }, [params])

   return (
      <View style={styles.container}>
         <ActivityIndicator size="large" color="#007AFF" />
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
   },
})

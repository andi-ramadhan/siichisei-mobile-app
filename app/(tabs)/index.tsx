import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ThemedText type='title' style={styles.title}>Chat</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  title: { marginBottom: 8, textAlign: 'center' },
});
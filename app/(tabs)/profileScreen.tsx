import { ThemedView } from "@/components/themed-view";
import { supabase } from "@/utils/supabase";
import { Button, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
        <Button title="Logout" onPress={async () => { await supabase.auth.signOut(); }} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
})
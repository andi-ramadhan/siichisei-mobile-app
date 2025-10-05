import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) {
        setProfile(null);
        setLoading(false);
        return;
      }
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('email, full_name, age')
        .eq('id', user.user.id)
        .single(); // fetch a single row
      if (error) {
        setProfile(null);
      } else {
        setProfile(profiles);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1, padding: 24, marginTop: 24, justifyContent: 'flex-start' }}>
        <ThemedText type="title">Profile</ThemedText>
      </ThemedView>
      <ThemedView style={styles.container}>
        {loading ? (
          <ActivityIndicator />
        ) : profile ? (
          <>
            <Text style={styles.text}>Email: {profile.email}</Text>
            <Text style={styles.text}>Full Name: {profile.full_name ?? ' '}</Text>
            <Text style={styles.text}>Age: {profile.age ?? ' '}</Text>
          </>
        ) : (
          <Text style={styles.text}>No profile data found.</Text>
        )}
      </ThemedView>
      <View style={{ flex: 1, padding: 24, justifyContent: 'flex-end' }}>
        <Button title="Logout" onPress={async () => { await supabase.auth.signOut(); }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    borderWidth: 1,
    justifyContent: 'flex-start',
    padding: 24,
    gap: 16,
  },
  text: {
    marginBottom: 8,
  },
});
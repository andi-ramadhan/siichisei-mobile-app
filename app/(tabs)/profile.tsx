import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');

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
        .select('id, email, full_name, age')
        .eq('id', user.user.id)
        .single();
      if (error) {
        setProfile(null);
      } else {
        setProfile(profiles);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, age: age ? parseInt(age) : null })
      .eq('id', profile.id);
    setSaving(false);
    if (error) {
      Alert.alert('Update failed', error.message);
    } else {
      setProfile({ ...profile, full_name: fullName, age: age ? parseInt(age) : null });
      Alert.alert('Profile updated!');
    }
  };

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
            <Text style={styles.text}>Full Name:</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter full name"
            />
            <Text style={styles.text}>Age:</Text>
            <TextInput 
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="Enter age"
              keyboardType="numeric"
            />
            <Button title={saving ? "Saving..." : "Update"} onPress={handleUpdate} disabled={saving} />
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
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
});
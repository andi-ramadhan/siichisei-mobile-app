import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { supabase } from "@/utils/supabase";
import { useState } from "react";
import { Alert, Button, Platform, StyleSheet, TextInput } from "react-native";

type LoginScreenProps = {
  onLoginSuccess?: () => void;
}

function showAlert(title: string, message: string){
  if (Platform.OS === 'web') {
    window.alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

export default function LoginScreen({ onLoginSuccess}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes('invalid login credentials')) {
        showAlert('Login failed', 'Wrong password.');
      } else {
        showAlert('Login failed', error.message);
      }
    } else {
      showAlert('Success', 'Login Successful');
      onLoginSuccess?.();
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Login</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={loading ? "Logging in..." : "Login"} onPress={handleLogin} />
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
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
});
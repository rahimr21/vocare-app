import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "./ThemeColors";

const MOCK_USERS = [
  { id: "1", name: "Alex Rivera", loves: "Building", caresAbout: "Inefficiency", connected: false },
  { id: "2", name: "Jordan Lee", loves: "Listening", caresAbout: "Loneliness", connected: true },
  { id: "3", name: "Sam Chen", loves: "Organizing", caresAbout: "Injustice", connected: false },
  { id: "4", name: "Morgan Taylor", loves: "Creating", caresAbout: "Loneliness", connected: false },
  { id: "5", name: "Casey Kim", loves: "Building", caresAbout: "Inefficiency", connected: false },
  { id: "6", name: "Riley Jones", loves: "Listening", caresAbout: "Loneliness", connected: false },
];

function UserCard({ item, onConnect }) {
  return (
    <View style={styles.card}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.tag}>Loves: {item.loves}</Text>
      <Text style={styles.tag}>Cares about: {item.caresAbout}</Text>
      <TouchableOpacity
        style={[styles.connectButton, item.connected && styles.connectButtonDisabled]}
        onPress={() => !item.connected && onConnect(item.id)}
        activeOpacity={0.8}
        disabled={item.connected}
      >
        <Text
          style={[
            styles.connectButtonText,
            item.connected && styles.connectButtonTextDisabled,
          ]}
        >
          {item.connected ? "Connected" : "Connect"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function FindPeopleScreen() {
  const [users, setUsers] = useState(MOCK_USERS);

  const handleConnect = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, connected: true } : u))
    );
  };

  const renderItem = ({ item }) => (
    <UserCard item={item} onConnect={handleConnect} />
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Find People</Text>
        <Text style={styles.subtitle}>
          Connect with others who share your purpose
        </Text>
      </View>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.textDark,
  },
  subtitle: {
    fontSize: 14,
    color: theme.textLight,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: theme.cardBg,
    borderRadius: 16,
    marginTop: 16,
    padding: 16,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.textDark,
  },
  tag: {
    fontSize: 14,
    color: theme.textLight,
    marginTop: 6,
  },
  connectButton: {
    backgroundColor: theme.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 16,
    alignItems: "center",
  },
  connectButtonDisabled: {
    backgroundColor: theme.secondary,
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.cardBg,
  },
  connectButtonTextDisabled: {
    color: theme.textDark,
  },
});

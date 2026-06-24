import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { dummyExpenses } from "../data/dummyExpenses";
import ExpenseForm from "../components/ExpenseForm";

export default function HomeScreen() {
  const [expenses, setExpenses] = useState(dummyExpenses);

  const addExpense = (expense) => {
    setExpenses([
      { id: Date.now().toString(), ...expense },
      ...expenses
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>529 Expense Tracker</Text>

      <ExpenseForm onAdd={addExpense} />

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.description}</Text>
            <Text>${item.amount}</Text>
            <Text>{item.category}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc"
  }
});
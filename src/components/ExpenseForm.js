import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";

export default function ExpenseForm({ onAdd }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = () => {
    if (!description || !amount) return;

    onAdd({
      description,
      amount: parseFloat(amount),
      category: category || "Uncategorized",
      date: new Date().toISOString().split("T")[0]
    });

    setDescription("");
    setAmount("");
    setCategory("");
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={{ borderBottomWidth: 1 }}
      />

      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={{ borderBottomWidth: 1 }}
      />

      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={{ borderBottomWidth: 1 }}
      />

      <Button title="Add Expense" onPress={handleSubmit} />
    </View>
  );
}
import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function saveExpense(expense) {

    if (!auth.currentUser) {
        throw new Error("User is not signed in.");
    }

    await addDoc(collection(db, "expenses"), {

        uid: auth.currentUser.uid,

        date: expense.date,

        category: expense.category,

        description: expense.description,

        amount: expense.amount,

        receipt: expense.receipt

    });

}
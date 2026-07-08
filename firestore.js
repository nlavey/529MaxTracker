import { auth, db } from "./firebase.js";

import {

    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    query,
    where

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function saveExpense(expense){

    if(!auth.currentUser){

        throw new Error("User not signed in");

    }

    await addDoc(

        collection(db,"expenses"),

        {

            uid: auth.currentUser.uid,

            ...expense

        }

    );

}

export async function loadExpenses(){

    if(!auth.currentUser){

        return [];

    }

    const q = query(

        collection(db,"expenses"),

        where("uid","==",auth.currentUser.uid)

    );

    const snapshot = await getDocs(q);

    const expenses=[];

    snapshot.forEach(docSnapshot=>{

        expenses.push({

            id: docSnapshot.id,

            ...docSnapshot.data()

        });

    });

    return expenses;

}

export async function deleteExpense(id){

    await deleteDoc(

        doc(db,"expenses",id)

    );

}

export async function updateExpense(id,expense){

    await updateDoc(

        doc(db,"expenses",id),

        expense

    );

}
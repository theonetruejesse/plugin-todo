import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { corsRequest } from "./utils/cors";

export const addTodo = corsRequest(async (req, res) => {
  if (req.method === "POST") {
    const username = req.body.username ?? "john doe";
    const todo = req.body.todo;

    await getFirestore()
      .collection("users")
      .doc(username)
      .update({
        todos: FieldValue.arrayUnion(todo),
      });

    res.status(200).send("OK");
  } else {
    res.status(405).send("Method Not Allowed");
  }
});

export const getTodos = corsRequest(async (req, res) => {
  if (req.method === "GET") {
    const username = req.query.username as string;
    const data = (
      await getFirestore().collection("users").doc(username).get()
    ).data();
    const todos = data ? data["todos"] : [];
    res.status(200).json(todos);
  } else {
    res.status(405).send("Method Not Allowed");
  }
});

export const deleteTodo = corsRequest(async (req, res) => {
  if (req.method === "DELETE") {
    const username = req.body.username;

    // delete all todos (CHANGE ME LMAOOOOOO)
    await getFirestore().collection("users").doc(username).update({
      todos: FieldValue.delete(),
    });

    res.status(200).send("OK");
  } else {
    res.status(405).send("Method Not Allowed");
  }
});

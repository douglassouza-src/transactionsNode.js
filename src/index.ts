import express, { Request, Response } from "express";
import { Transaction, User } from "./classes";
import {
  validationUserExists,
  CPFvalidator,
  validationData,
  validationDataTransactions,
  validationTypeTransactions,
  validationTransactionExists,
} from "./middlewares";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (request: Request, response: Response) => {
  return response.send("API ✔");
});

export const listUsers: Array<User> = [];

app.post(
  "/users",
  validationData,
  CPFvalidator,
  (request: Request, response: Response) => {
    const { name, cpf, email, age } = request.body;
    const newCPF = cpf.replace(/[^a-zA-Z0-9]/g, "");

    const newUser = new User({ name, cpf: newCPF, email, age });
    listUsers.push(newUser);

    return response.status(201).json({
      message: "User created sucessfull, bro",
      user: newUser.handleProperties(),
    });
  }
);

app.get(
  "/users/:userId",
  validationUserExists,
  (request: Request, response: Response) => {
    const { userId } = request.params;

    const user = listUsers.find((user) => user.id === userId) as User;

    return response
      .status(201)
      .json({ message: "User list, bro", user: user.handleProperties() });
  }
);

app.get("/users", (request: Request, response: Response) => {
  const { name, email, cpf } = request.query;

  const usersFilter = listUsers.filter((user) => {
    if (name && email && cpf) {
      return (
        user.name.includes(name as string) &&
        user.cpf.includes(cpf as string) &&
        user.email.includes(email as string)
      );
    }

    if (name || email || cpf) {
      return (
        user.name.includes(name as string) ||
        user.cpf.includes(cpf as string) ||
        user.email.includes(email as string)
      );
    }

    return user;
  });

  const users = usersFilter.map((user) => user.handleProperties());

  return response.status(201).json({
    message: "User list, bro",
    users,
  });
});


app.put(
  "/users/:userId",
  validationUserExists,
  (request: Request, response: Response) => {
    const { userId } = request.params;
    const { name, email, cpf, age } = request.body;

    const userIndex = listUsers.findIndex((user) => user.id === userId);

    listUsers[userIndex].name = name ?? listUsers[userIndex].name;
    listUsers[userIndex].email = email ?? listUsers[userIndex].email;
    listUsers[userIndex].cpf = cpf ?? listUsers[userIndex].cpf;
    listUsers[userIndex].age = age ?? listUsers[userIndex].age;

    const user = listUsers[userIndex].handleProperties();

    return response.status(200).json({
      message: "Successfully updated user, bro",
      user, 
    });
  }
);

app.delete(
  "/users/:userId",
  validationUserExists,
  (request: Request, response: Response) => {
    const { userId } = request.params;

    const userIndex = listUsers.findIndex((user) => user.id === userId);

    const user = listUsers[userIndex].handleProperties();

    listUsers.splice(userIndex, 1);

    return response.status(200).json({
      message: "Successfully delete user, bro",
      user, 
    });
  }
);

app.post(
  "/users/:userId/transactions",
  validationUserExists,
  validationDataTransactions,
  validationTypeTransactions,
  (request: Request, response: Response) => {
    const { userId } = request.params;
    const { title, value, type } = request.body;

    const userIndex = listUsers.findIndex((user) => user.id === userId);

    listUsers[userIndex].transactions?.push(
      new Transaction({ title, value, type })
    );

    return response.status(200).json({
      message: "Successfully create transaction, bro",
      data: { title, value, type },
    });
  }
);


app.get(
  "/users/:userId/transactions/:id",
  validationUserExists,
  validationTransactionExists,
  (request: Request, response: Response) => {
    const { userId, id } = request.params;

    const user = listUsers.find((user) => user.id === userId);

    const transaction = user?.transactions?.find((trans) => trans.id === id);

    return response.status(200).json({
      message: "Rransaction by id, bro",
      transaction: transaction?.handleProperties(),
    });
  }
);

app.get(
  "/users/:userId/transactions",
  validationUserExists,
  (request: Request, response: Response) => {
    const { userId } = request.params;

    const userIndex = listUsers.findIndex((user) => user.id === userId);

    const transactions = listUsers[userIndex].transactions?.map((trans) =>
      trans.handleProperties()
    );
    const income = listUsers[userIndex].calculate("income");
    const outcome = listUsers[userIndex].calculate("outcome");
    const total = income - outcome;

    return response.status(200).json({
      message: "Transaction list, bro",
      transactions,
      balance: {
        income,
        outcome,
        total,
      },
    });
  }
);

app.put(
  "/users/:userId/transactions/:id",
  validationUserExists,
  validationTransactionExists,
  validationTypeTransactions,
  (request: Request, response: Response) => {
    const { userId, id } = request.params;
    const { title, value, type } = request.body;

    const userIndex = listUsers.findIndex((user) => user.id === userId);
    const transactionIndex = listUsers[userIndex].transactions?.findIndex(
      (trans) => trans.id === id
    ) as number;

    listUsers[userIndex].transactions![transactionIndex].title =
      title ?? listUsers[userIndex].transactions![transactionIndex].title;
    listUsers[userIndex].transactions![transactionIndex].value =
      value ?? listUsers[userIndex].transactions![transactionIndex].value;
    listUsers[userIndex].transactions![transactionIndex].type =
      type ?? listUsers[userIndex].transactions![transactionIndex].type;

    const transaction =
      listUsers[userIndex].transactions![transactionIndex].handleProperties();

    return response.status(200).json({
      message: "Successfully update transaction, bro",
      transaction, 
    });
  }
);

app.delete(
  "/users/:userId/transactions/:id",
  validationUserExists,
  validationTransactionExists,
  (request: Request, response: Response) => {
    const { userId, id } = request.params;

    const userIndex = listUsers.findIndex((user) => user.id === userId);
    const transactionIndex = listUsers[userIndex].transactions?.findIndex(
      (trans) => trans.id === id
    ) as number;

    const transaction =
      listUsers[userIndex].transactions![transactionIndex].handleProperties();

    listUsers[userIndex].transactions?.splice(transactionIndex, 1);

    return response.status(200).json({
      message: "Successfully deleted transaction, bro",
      transaction,
    });
  }
);

app.listen(8080, () => console.log("Server ON ✔"));

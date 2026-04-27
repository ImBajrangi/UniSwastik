# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-sdk/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetUser*](#getuser)
  - [*ListJoinedServers*](#listjoinedservers)
  - [*ListDiscoverableServers*](#listdiscoverableservers)
  - [*ListMessages*](#listmessages)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*JoinServer*](#joinserver)
  - [*SendMessage*](#sendmessage)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@swastik/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@swastik/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@swastik/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetUser
You can execute the `GetUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
getUser(vars: GetUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserData, GetUserVariables>;

interface GetUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
}
export const getUserRef: GetUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUser(dc: DataConnect, vars: GetUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserData, GetUserVariables>;

interface GetUserRef {
  ...
  (dc: DataConnect, vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
}
export const getUserRef: GetUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserRef:
```typescript
const name = getUserRef.operationName;
console.log(name);
```

### Variables
The `GetUser` query requires an argument of type `GetUserVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserVariables {
  id: string;
}
```
### Return Type
Recall that executing the `GetUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserData {
  user?: {
    id: string;
    name: string;
    avatar?: string | null;
    status?: string | null;
    university?: string | null;
    domain?: string | null;
  } & User_Key;
}
```
### Using `GetUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUser, GetUserVariables } from '@swastik/dataconnect';

// The `GetUser` query requires an argument of type `GetUserVariables`:
const getUserVars: GetUserVariables = {
  id: ..., 
};

// Call the `getUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUser(getUserVars);
// Variables can be defined inline as well.
const { data } = await getUser({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUser(dataConnect, getUserVars);

console.log(data.user);

// Or, you can use the `Promise` API.
getUser(getUserVars).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserRef, GetUserVariables } from '@swastik/dataconnect';

// The `GetUser` query requires an argument of type `GetUserVariables`:
const getUserVars: GetUserVariables = {
  id: ..., 
};

// Call the `getUserRef()` function to get a reference to the query.
const ref = getUserRef(getUserVars);
// Variables can be defined inline as well.
const ref = getUserRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserRef(dataConnect, getUserVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListJoinedServers
You can execute the `ListJoinedServers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
listJoinedServers(vars: ListJoinedServersVariables, options?: ExecuteQueryOptions): QueryPromise<ListJoinedServersData, ListJoinedServersVariables>;

interface ListJoinedServersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListJoinedServersVariables): QueryRef<ListJoinedServersData, ListJoinedServersVariables>;
}
export const listJoinedServersRef: ListJoinedServersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listJoinedServers(dc: DataConnect, vars: ListJoinedServersVariables, options?: ExecuteQueryOptions): QueryPromise<ListJoinedServersData, ListJoinedServersVariables>;

interface ListJoinedServersRef {
  ...
  (dc: DataConnect, vars: ListJoinedServersVariables): QueryRef<ListJoinedServersData, ListJoinedServersVariables>;
}
export const listJoinedServersRef: ListJoinedServersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listJoinedServersRef:
```typescript
const name = listJoinedServersRef.operationName;
console.log(name);
```

### Variables
The `ListJoinedServers` query requires an argument of type `ListJoinedServersVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListJoinedServersVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `ListJoinedServers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListJoinedServersData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListJoinedServersData {
  members: ({
    server: {
      id: UUIDString;
      name: string;
      acronym: string;
      privacy: string;
      isAnonymous: boolean;
    } & Server_Key;
      role: string;
  })[];
}
```
### Using `ListJoinedServers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listJoinedServers, ListJoinedServersVariables } from '@swastik/dataconnect';

// The `ListJoinedServers` query requires an argument of type `ListJoinedServersVariables`:
const listJoinedServersVars: ListJoinedServersVariables = {
  userId: ..., 
};

// Call the `listJoinedServers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listJoinedServers(listJoinedServersVars);
// Variables can be defined inline as well.
const { data } = await listJoinedServers({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listJoinedServers(dataConnect, listJoinedServersVars);

console.log(data.members);

// Or, you can use the `Promise` API.
listJoinedServers(listJoinedServersVars).then((response) => {
  const data = response.data;
  console.log(data.members);
});
```

### Using `ListJoinedServers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listJoinedServersRef, ListJoinedServersVariables } from '@swastik/dataconnect';

// The `ListJoinedServers` query requires an argument of type `ListJoinedServersVariables`:
const listJoinedServersVars: ListJoinedServersVariables = {
  userId: ..., 
};

// Call the `listJoinedServersRef()` function to get a reference to the query.
const ref = listJoinedServersRef(listJoinedServersVars);
// Variables can be defined inline as well.
const ref = listJoinedServersRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listJoinedServersRef(dataConnect, listJoinedServersVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.members);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.members);
});
```

## ListDiscoverableServers
You can execute the `ListDiscoverableServers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
listDiscoverableServers(vars?: ListDiscoverableServersVariables, options?: ExecuteQueryOptions): QueryPromise<ListDiscoverableServersData, ListDiscoverableServersVariables>;

interface ListDiscoverableServersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListDiscoverableServersVariables): QueryRef<ListDiscoverableServersData, ListDiscoverableServersVariables>;
}
export const listDiscoverableServersRef: ListDiscoverableServersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listDiscoverableServers(dc: DataConnect, vars?: ListDiscoverableServersVariables, options?: ExecuteQueryOptions): QueryPromise<ListDiscoverableServersData, ListDiscoverableServersVariables>;

interface ListDiscoverableServersRef {
  ...
  (dc: DataConnect, vars?: ListDiscoverableServersVariables): QueryRef<ListDiscoverableServersData, ListDiscoverableServersVariables>;
}
export const listDiscoverableServersRef: ListDiscoverableServersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listDiscoverableServersRef:
```typescript
const name = listDiscoverableServersRef.operationName;
console.log(name);
```

### Variables
The `ListDiscoverableServers` query has an optional argument of type `ListDiscoverableServersVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListDiscoverableServersVariables {
  domain?: string | null;
}
```
### Return Type
Recall that executing the `ListDiscoverableServers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListDiscoverableServersData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListDiscoverableServersData {
  servers: ({
    id: UUIDString;
    name: string;
    acronym: string;
    description: string;
  } & Server_Key)[];
}
```
### Using `ListDiscoverableServers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listDiscoverableServers, ListDiscoverableServersVariables } from '@swastik/dataconnect';

// The `ListDiscoverableServers` query has an optional argument of type `ListDiscoverableServersVariables`:
const listDiscoverableServersVars: ListDiscoverableServersVariables = {
  domain: ..., // optional
};

// Call the `listDiscoverableServers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listDiscoverableServers(listDiscoverableServersVars);
// Variables can be defined inline as well.
const { data } = await listDiscoverableServers({ domain: ..., });
// Since all variables are optional for this query, you can omit the `ListDiscoverableServersVariables` argument.
const { data } = await listDiscoverableServers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listDiscoverableServers(dataConnect, listDiscoverableServersVars);

console.log(data.servers);

// Or, you can use the `Promise` API.
listDiscoverableServers(listDiscoverableServersVars).then((response) => {
  const data = response.data;
  console.log(data.servers);
});
```

### Using `ListDiscoverableServers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listDiscoverableServersRef, ListDiscoverableServersVariables } from '@swastik/dataconnect';

// The `ListDiscoverableServers` query has an optional argument of type `ListDiscoverableServersVariables`:
const listDiscoverableServersVars: ListDiscoverableServersVariables = {
  domain: ..., // optional
};

// Call the `listDiscoverableServersRef()` function to get a reference to the query.
const ref = listDiscoverableServersRef(listDiscoverableServersVars);
// Variables can be defined inline as well.
const ref = listDiscoverableServersRef({ domain: ..., });
// Since all variables are optional for this query, you can omit the `ListDiscoverableServersVariables` argument.
const ref = listDiscoverableServersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listDiscoverableServersRef(dataConnect, listDiscoverableServersVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.servers);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.servers);
});
```

## ListMessages
You can execute the `ListMessages` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
listMessages(vars: ListMessagesVariables, options?: ExecuteQueryOptions): QueryPromise<ListMessagesData, ListMessagesVariables>;

interface ListMessagesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListMessagesVariables): QueryRef<ListMessagesData, ListMessagesVariables>;
}
export const listMessagesRef: ListMessagesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMessages(dc: DataConnect, vars: ListMessagesVariables, options?: ExecuteQueryOptions): QueryPromise<ListMessagesData, ListMessagesVariables>;

interface ListMessagesRef {
  ...
  (dc: DataConnect, vars: ListMessagesVariables): QueryRef<ListMessagesData, ListMessagesVariables>;
}
export const listMessagesRef: ListMessagesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMessagesRef:
```typescript
const name = listMessagesRef.operationName;
console.log(name);
```

### Variables
The `ListMessages` query requires an argument of type `ListMessagesVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListMessagesVariables {
  targetId: UUIDString;
}
```
### Return Type
Recall that executing the `ListMessages` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMessagesData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMessagesData {
  messages: ({
    id: UUIDString;
    content: string;
    author: {
      id: string;
      name: string;
      avatar?: string | null;
    } & User_Key;
      timestamp: TimestampString;
  } & Message_Key)[];
}
```
### Using `ListMessages`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMessages, ListMessagesVariables } from '@swastik/dataconnect';

// The `ListMessages` query requires an argument of type `ListMessagesVariables`:
const listMessagesVars: ListMessagesVariables = {
  targetId: ..., 
};

// Call the `listMessages()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMessages(listMessagesVars);
// Variables can be defined inline as well.
const { data } = await listMessages({ targetId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMessages(dataConnect, listMessagesVars);

console.log(data.messages);

// Or, you can use the `Promise` API.
listMessages(listMessagesVars).then((response) => {
  const data = response.data;
  console.log(data.messages);
});
```

### Using `ListMessages`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMessagesRef, ListMessagesVariables } from '@swastik/dataconnect';

// The `ListMessages` query requires an argument of type `ListMessagesVariables`:
const listMessagesVars: ListMessagesVariables = {
  targetId: ..., 
};

// Call the `listMessagesRef()` function to get a reference to the query.
const ref = listMessagesRef(listMessagesVars);
// Variables can be defined inline as well.
const ref = listMessagesRef({ targetId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMessagesRef(dataConnect, listMessagesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.messages);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.messages);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  id: string;
  name: string;
  email: string;
  university?: string | null;
  domain?: string | null;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@swastik/dataconnect';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  id: ..., 
  name: ..., 
  email: ..., 
  university: ..., // optional
  domain: ..., // optional
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ id: ..., name: ..., email: ..., university: ..., domain: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@swastik/dataconnect';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  id: ..., 
  name: ..., 
  email: ..., 
  university: ..., // optional
  domain: ..., // optional
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ id: ..., name: ..., email: ..., university: ..., domain: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## JoinServer
You can execute the `JoinServer` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
joinServer(vars: JoinServerVariables): MutationPromise<JoinServerData, JoinServerVariables>;

interface JoinServerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: JoinServerVariables): MutationRef<JoinServerData, JoinServerVariables>;
}
export const joinServerRef: JoinServerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
joinServer(dc: DataConnect, vars: JoinServerVariables): MutationPromise<JoinServerData, JoinServerVariables>;

interface JoinServerRef {
  ...
  (dc: DataConnect, vars: JoinServerVariables): MutationRef<JoinServerData, JoinServerVariables>;
}
export const joinServerRef: JoinServerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the joinServerRef:
```typescript
const name = joinServerRef.operationName;
console.log(name);
```

### Variables
The `JoinServer` mutation requires an argument of type `JoinServerVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface JoinServerVariables {
  userId: string;
  serverId: UUIDString;
}
```
### Return Type
Recall that executing the `JoinServer` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `JoinServerData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface JoinServerData {
  member_insert: Member_Key;
}
```
### Using `JoinServer`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, joinServer, JoinServerVariables } from '@swastik/dataconnect';

// The `JoinServer` mutation requires an argument of type `JoinServerVariables`:
const joinServerVars: JoinServerVariables = {
  userId: ..., 
  serverId: ..., 
};

// Call the `joinServer()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await joinServer(joinServerVars);
// Variables can be defined inline as well.
const { data } = await joinServer({ userId: ..., serverId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await joinServer(dataConnect, joinServerVars);

console.log(data.member_insert);

// Or, you can use the `Promise` API.
joinServer(joinServerVars).then((response) => {
  const data = response.data;
  console.log(data.member_insert);
});
```

### Using `JoinServer`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, joinServerRef, JoinServerVariables } from '@swastik/dataconnect';

// The `JoinServer` mutation requires an argument of type `JoinServerVariables`:
const joinServerVars: JoinServerVariables = {
  userId: ..., 
  serverId: ..., 
};

// Call the `joinServerRef()` function to get a reference to the mutation.
const ref = joinServerRef(joinServerVars);
// Variables can be defined inline as well.
const ref = joinServerRef({ userId: ..., serverId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = joinServerRef(dataConnect, joinServerVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.member_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.member_insert);
});
```

## SendMessage
You can execute the `SendMessage` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
sendMessage(vars: SendMessageVariables): MutationPromise<SendMessageData, SendMessageVariables>;

interface SendMessageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SendMessageVariables): MutationRef<SendMessageData, SendMessageVariables>;
}
export const sendMessageRef: SendMessageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
sendMessage(dc: DataConnect, vars: SendMessageVariables): MutationPromise<SendMessageData, SendMessageVariables>;

interface SendMessageRef {
  ...
  (dc: DataConnect, vars: SendMessageVariables): MutationRef<SendMessageData, SendMessageVariables>;
}
export const sendMessageRef: SendMessageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the sendMessageRef:
```typescript
const name = sendMessageRef.operationName;
console.log(name);
```

### Variables
The `SendMessage` mutation requires an argument of type `SendMessageVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SendMessageVariables {
  authorId: string;
  content: string;
  channelId?: UUIDString | null;
  dmId?: UUIDString | null;
}
```
### Return Type
Recall that executing the `SendMessage` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SendMessageData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SendMessageData {
  message_insert: Message_Key;
}
```
### Using `SendMessage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, sendMessage, SendMessageVariables } from '@swastik/dataconnect';

// The `SendMessage` mutation requires an argument of type `SendMessageVariables`:
const sendMessageVars: SendMessageVariables = {
  authorId: ..., 
  content: ..., 
  channelId: ..., // optional
  dmId: ..., // optional
};

// Call the `sendMessage()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await sendMessage(sendMessageVars);
// Variables can be defined inline as well.
const { data } = await sendMessage({ authorId: ..., content: ..., channelId: ..., dmId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await sendMessage(dataConnect, sendMessageVars);

console.log(data.message_insert);

// Or, you can use the `Promise` API.
sendMessage(sendMessageVars).then((response) => {
  const data = response.data;
  console.log(data.message_insert);
});
```

### Using `SendMessage`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, sendMessageRef, SendMessageVariables } from '@swastik/dataconnect';

// The `SendMessage` mutation requires an argument of type `SendMessageVariables`:
const sendMessageVars: SendMessageVariables = {
  authorId: ..., 
  content: ..., 
  channelId: ..., // optional
  dmId: ..., // optional
};

// Call the `sendMessageRef()` function to get a reference to the mutation.
const ref = sendMessageRef(sendMessageVars);
// Variables can be defined inline as well.
const ref = sendMessageRef({ authorId: ..., content: ..., channelId: ..., dmId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = sendMessageRef(dataConnect, sendMessageVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.message_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.message_insert);
});
```


# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateUser, useGetUser, useListJoinedServers, useListDiscoverableServers, useJoinServer, useListMessages, useSendMessage } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateUser(createUserVars);

const { data, isPending, isSuccess, isError, error } = useGetUser(getUserVars);

const { data, isPending, isSuccess, isError, error } = useListJoinedServers(listJoinedServersVars);

const { data, isPending, isSuccess, isError, error } = useListDiscoverableServers(listDiscoverableServersVars);

const { data, isPending, isSuccess, isError, error } = useJoinServer(joinServerVars);

const { data, isPending, isSuccess, isError, error } = useListMessages(listMessagesVars);

const { data, isPending, isSuccess, isError, error } = useSendMessage(sendMessageVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUser, getUser, listJoinedServers, listDiscoverableServers, joinServer, listMessages, sendMessage } from '@dataconnect/generated';


// Operation CreateUser:  For variables, look at type CreateUserVars in ../index.d.ts
const { data } = await CreateUser(dataConnect, createUserVars);

// Operation GetUser:  For variables, look at type GetUserVars in ../index.d.ts
const { data } = await GetUser(dataConnect, getUserVars);

// Operation ListJoinedServers:  For variables, look at type ListJoinedServersVars in ../index.d.ts
const { data } = await ListJoinedServers(dataConnect, listJoinedServersVars);

// Operation ListDiscoverableServers:  For variables, look at type ListDiscoverableServersVars in ../index.d.ts
const { data } = await ListDiscoverableServers(dataConnect, listDiscoverableServersVars);

// Operation JoinServer:  For variables, look at type JoinServerVars in ../index.d.ts
const { data } = await JoinServer(dataConnect, joinServerVars);

// Operation ListMessages:  For variables, look at type ListMessagesVars in ../index.d.ts
const { data } = await ListMessages(dataConnect, listMessagesVars);

// Operation SendMessage:  For variables, look at type SendMessageVars in ../index.d.ts
const { data } = await SendMessage(dataConnect, sendMessageVars);


```
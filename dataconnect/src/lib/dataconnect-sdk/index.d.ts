import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Channel_Key {
  id: UUIDString;
  __typename?: 'Channel_Key';
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  id: string;
  name: string;
  email: string;
  university?: string | null;
  domain?: string | null;
}

export interface DM_Key {
  id: UUIDString;
  __typename?: 'DM_Key';
}

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

export interface GetUserVariables {
  id: string;
}

export interface JoinServerData {
  member_insert: Member_Key;
}

export interface JoinServerVariables {
  userId: string;
  serverId: UUIDString;
}

export interface ListDiscoverableServersData {
  servers: ({
    id: UUIDString;
    name: string;
    acronym: string;
    description: string;
  } & Server_Key)[];
}

export interface ListDiscoverableServersVariables {
  domain?: string | null;
}

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

export interface ListJoinedServersVariables {
  userId: string;
}

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

export interface ListMessagesVariables {
  targetId: UUIDString;
}

export interface Member_Key {
  userId: string;
  serverId: UUIDString;
  __typename?: 'Member_Key';
}

export interface Message_Key {
  id: UUIDString;
  __typename?: 'Message_Key';
}

export interface SendMessageData {
  message_insert: Message_Key;
}

export interface SendMessageVariables {
  authorId: string;
  content: string;
  channelId?: UUIDString | null;
  dmId?: UUIDString | null;
}

export interface Server_Key {
  id: UUIDString;
  __typename?: 'Server_Key';
}

export interface TypingIndicator_Key {
  userId: string;
  targetId: string;
  __typename?: 'TypingIndicator_Key';
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface GetUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
  operationName: string;
}
export const getUserRef: GetUserRef;

export function getUser(vars: GetUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserData, GetUserVariables>;
export function getUser(dc: DataConnect, vars: GetUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserData, GetUserVariables>;

interface ListJoinedServersRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListJoinedServersVariables): QueryRef<ListJoinedServersData, ListJoinedServersVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListJoinedServersVariables): QueryRef<ListJoinedServersData, ListJoinedServersVariables>;
  operationName: string;
}
export const listJoinedServersRef: ListJoinedServersRef;

export function listJoinedServers(vars: ListJoinedServersVariables, options?: ExecuteQueryOptions): QueryPromise<ListJoinedServersData, ListJoinedServersVariables>;
export function listJoinedServers(dc: DataConnect, vars: ListJoinedServersVariables, options?: ExecuteQueryOptions): QueryPromise<ListJoinedServersData, ListJoinedServersVariables>;

interface ListDiscoverableServersRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListDiscoverableServersVariables): QueryRef<ListDiscoverableServersData, ListDiscoverableServersVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListDiscoverableServersVariables): QueryRef<ListDiscoverableServersData, ListDiscoverableServersVariables>;
  operationName: string;
}
export const listDiscoverableServersRef: ListDiscoverableServersRef;

export function listDiscoverableServers(vars?: ListDiscoverableServersVariables, options?: ExecuteQueryOptions): QueryPromise<ListDiscoverableServersData, ListDiscoverableServersVariables>;
export function listDiscoverableServers(dc: DataConnect, vars?: ListDiscoverableServersVariables, options?: ExecuteQueryOptions): QueryPromise<ListDiscoverableServersData, ListDiscoverableServersVariables>;

interface JoinServerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: JoinServerVariables): MutationRef<JoinServerData, JoinServerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: JoinServerVariables): MutationRef<JoinServerData, JoinServerVariables>;
  operationName: string;
}
export const joinServerRef: JoinServerRef;

export function joinServer(vars: JoinServerVariables): MutationPromise<JoinServerData, JoinServerVariables>;
export function joinServer(dc: DataConnect, vars: JoinServerVariables): MutationPromise<JoinServerData, JoinServerVariables>;

interface ListMessagesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListMessagesVariables): QueryRef<ListMessagesData, ListMessagesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListMessagesVariables): QueryRef<ListMessagesData, ListMessagesVariables>;
  operationName: string;
}
export const listMessagesRef: ListMessagesRef;

export function listMessages(vars: ListMessagesVariables, options?: ExecuteQueryOptions): QueryPromise<ListMessagesData, ListMessagesVariables>;
export function listMessages(dc: DataConnect, vars: ListMessagesVariables, options?: ExecuteQueryOptions): QueryPromise<ListMessagesData, ListMessagesVariables>;

interface SendMessageRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SendMessageVariables): MutationRef<SendMessageData, SendMessageVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SendMessageVariables): MutationRef<SendMessageData, SendMessageVariables>;
  operationName: string;
}
export const sendMessageRef: SendMessageRef;

export function sendMessage(vars: SendMessageVariables): MutationPromise<SendMessageData, SendMessageVariables>;
export function sendMessage(dc: DataConnect, vars: SendMessageVariables): MutationPromise<SendMessageData, SendMessageVariables>;


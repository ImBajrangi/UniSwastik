import { CreateUserData, CreateUserVariables, GetUserData, GetUserVariables, ListJoinedServersData, ListJoinedServersVariables, ListDiscoverableServersData, ListDiscoverableServersVariables, JoinServerData, JoinServerVariables, ListMessagesData, ListMessagesVariables, SendMessageData, SendMessageVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;

export function useGetUser(vars: GetUserVariables, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, GetUserVariables>;
export function useGetUser(dc: DataConnect, vars: GetUserVariables, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, GetUserVariables>;

export function useListJoinedServers(vars: ListJoinedServersVariables, options?: useDataConnectQueryOptions<ListJoinedServersData>): UseDataConnectQueryResult<ListJoinedServersData, ListJoinedServersVariables>;
export function useListJoinedServers(dc: DataConnect, vars: ListJoinedServersVariables, options?: useDataConnectQueryOptions<ListJoinedServersData>): UseDataConnectQueryResult<ListJoinedServersData, ListJoinedServersVariables>;

export function useListDiscoverableServers(vars?: ListDiscoverableServersVariables, options?: useDataConnectQueryOptions<ListDiscoverableServersData>): UseDataConnectQueryResult<ListDiscoverableServersData, ListDiscoverableServersVariables>;
export function useListDiscoverableServers(dc: DataConnect, vars?: ListDiscoverableServersVariables, options?: useDataConnectQueryOptions<ListDiscoverableServersData>): UseDataConnectQueryResult<ListDiscoverableServersData, ListDiscoverableServersVariables>;

export function useJoinServer(options?: useDataConnectMutationOptions<JoinServerData, FirebaseError, JoinServerVariables>): UseDataConnectMutationResult<JoinServerData, JoinServerVariables>;
export function useJoinServer(dc: DataConnect, options?: useDataConnectMutationOptions<JoinServerData, FirebaseError, JoinServerVariables>): UseDataConnectMutationResult<JoinServerData, JoinServerVariables>;

export function useListMessages(vars: ListMessagesVariables, options?: useDataConnectQueryOptions<ListMessagesData>): UseDataConnectQueryResult<ListMessagesData, ListMessagesVariables>;
export function useListMessages(dc: DataConnect, vars: ListMessagesVariables, options?: useDataConnectQueryOptions<ListMessagesData>): UseDataConnectQueryResult<ListMessagesData, ListMessagesVariables>;

export function useSendMessage(options?: useDataConnectMutationOptions<SendMessageData, FirebaseError, SendMessageVariables>): UseDataConnectMutationResult<SendMessageData, SendMessageVariables>;
export function useSendMessage(dc: DataConnect, options?: useDataConnectMutationOptions<SendMessageData, FirebaseError, SendMessageVariables>): UseDataConnectMutationResult<SendMessageData, SendMessageVariables>;

"use client";
import { setContext } from "@apollo/client/link/context";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { API_URL } from "@/config";

const GRAPHQL_URL = `${API_URL}/graphql`;

const httpLink = createHttpLink({
	uri: GRAPHQL_URL,
});

const authLink = setContext((_, { headers }) => {
	let authSession = JSON.parse(localStorage.getItem("authSession"));

	let { state } = authSession;

	return {
		headers: {
			...headers,
			authorization: state.token ? `Bearer ${state.token}` : "",
		},
	};
});

const apolloClient = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

export default apolloClient;

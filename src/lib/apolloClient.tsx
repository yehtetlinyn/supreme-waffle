"use client";
import { setContext } from "@apollo/client/link/context";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { API_URL } from "@/config";

const GRAPHQL_URL = `${API_URL}/graphql`;

const httpLink = createHttpLink({
  uri: GRAPHQL_URL,
});

let authSessionString = localStorage.getItem("authSession");

const authLink = setContext((_, { headers }) => {
  if (authSessionString !== null && typeof authSessionString === "string") {
    let authSession = JSON.parse(authSessionString);

    let { state } = authSession;

    // Ensure to return a Promise<DefaultContext> here
    return Promise.resolve({
      headers: {
        ...headers,
        authorization: state.token ? `Bearer ${state.token}` : "",
      },
    });
  } else {
    // Handle the case where localStorage item is null or not a string
    return Promise.resolve({
      headers: headers, // Or any other default value
    });
  }
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default apolloClient;

import { createHttpClient } from 'mst-gql';

let DEV_SERVER_URL = 'localhost:4000';
//let DEV_SERVER_URL = "localhost:4000";
let PROD_SERVER_URL = 'localhost:5173';

let WS_DEV_SERVER_URL = 'localhost:5173';

let _gqlHttpClient = null;

function getProtocol() {
  // if (process.env.NODE_ENV === "production") {
  // 	return `https`;
  // } else {
  return `http`;
  //}
}

function getWSProtocol() {
  return `wss`;
}

function getServerIP() {
  // if (process.env.NODE_ENV === "production") {
  // 	return `${PROD_SERVER_URL}`;
  // } else {
  return `${DEV_SERVER_URL}`;
  //}
}

function getWSServerIP() {
  return `${WS_DEV_SERVER_URL}`;
}

function getServerURL() {
  return `${getProtocol()}://${getServerIP()}`;
}

function getServerAPIURL() {
  return `${getProtocol()}://${getServerIP()}/api`;
}

function getGraphQLServerURL() {
  return `${getProtocol()}://${getServerIP()}/graphql`;
}

function getWSServerURL() {
  return `${getWSProtocol()}://${getWSServerIP()}/ws`;
}

function getGraphQLHTTPClient(requestConfig = {}) {
  if (!_gqlHttpClient) {
    _gqlHttpClient = createHttpClient(getGraphQLServerURL(), requestConfig);
    const token = window.sessionStorage.getItem('sessionKey');
    if (token) _gqlHttpClient.setHeader('sessionKey', token);
  }
  return _gqlHttpClient;
}

function setTokenInHeader(token) {
  //window.sessionStorage.setItem("sessionKey", token);
  getGraphQLHTTPClient().setHeader('sessionKey', token);
}

console.log('======================== Network Utils ========================');
//console.log(`Server NODE_ENV = ${process.env.NODE_ENV}`);
console.log(getServerURL());
console.log('======================== Network Utils ========================');

export default {
  setTokenInHeader,
  getGraphQLHTTPClient,
  getProtocol,
  getServerAPIURL,
  getServerIP,
  getServerURL,
  getWSServerURL,
  getWSServerIP,
};

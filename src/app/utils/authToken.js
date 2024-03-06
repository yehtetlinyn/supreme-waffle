export const getTokenFromSession = () => {
	let authSession = JSON.parse(localStorage.getItem("authSession"));
	let { state } = authSession;

	return state.token;
};

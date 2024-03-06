import React from "react";

const PageLoader = () => {
	return (
		<main className="d-flex min-vh-100 flex-column align-items-center justify-content-center">
			<div className="spinner-border text-primary" role="status">
				<span className="visually-hidden">Loading...</span>
			</div>
		</main>
	);
};

export default PageLoader;

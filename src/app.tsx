import { createFreshClient } from "../lib/bknd";

async function Loader(props: { url: string }) {
	const { fresh } = this.context;

	const api = fresh.getApi(this.request);

	await new Promise((resolve) => setTimeout(resolve, 500));
	const { data } = await api.data.readMany("todos");
	return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

async function Home() {
	return (
		<>
			<h1>bknd on mono-jxs</h1>

			<component
				is={Loader}
				props={{
					url: "https://jsonplaceholder.typicode.com/posts/2",
				}}
				placeholder={<p>Loading...</p>}
			/>
		</>
	);
}

// async function App() {
// 	const { fresh } = this.context;
// 	return fresh.fetch(this.request);
// }

const routes = {
	"/": Home,
};

export default {
	fetch: async (req, env, ctx) => {
		const url = new URL(req.url);
		const fresh = await createFreshClient(req, env, ctx);

		// -- return bknd
		if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api")) {
			return await fresh.fetch(req);
		}

		// -- continue with mono routes
		return (
			<html lang="en" request={req} context={{ fresh, env }} routes={routes}>
				<router />
			</html>
		);
	},
};

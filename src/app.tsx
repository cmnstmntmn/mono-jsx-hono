import { createFreshClient } from "../lib/bknd";

async function Loader(props: { url: string }) {
	const data = await fetch(props.url).then((res) => res.json());

	return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

async function Home() {
	return (
		<component
			is={Loader}
			props={{
				url: "https://jsonplaceholder.typicode.com/posts/2",
			}}
			placeholder={<p>Loading...</p>}
		/>
	);
}

async function Api() {
	const { fresh } = this.context;

	return fresh.fetch(this.request);
}

const routes = {
	"/": Home,
	"/api/*": Api,
};

export default {
	fetch: async (req, env, ctx) => {
		const fresh = await createFreshClient(req, env, ctx);

		// -- this somehow works ..
		// however when passed as a context to /api/whatever .. it does nothing
		// return await fresh.fetch(req);

		return (
			<html lang="en" request={req} context={{ fresh }} routes={routes}>
				<router />
			</html>
		);
	},
};

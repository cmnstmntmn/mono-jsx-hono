import { getFresh } from "bknd/adapter/cloudflare";
import config from "../config";

export async function createFreshClient(request, env, ctx) {
	return getFresh(
		{
			bindings: () => ({ db: env.DB }),
			d1: { session: true, transport: "cookie" },
			...config,
		},
		{
			request,
			env,
			ctx,
		},
	);
}

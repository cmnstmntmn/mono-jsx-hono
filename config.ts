import { DatabaseEvents, resendEmail } from "bknd";
import type { CloudflareBkndConfig } from "bknd/adapter/cloudflare";
import { cloudflareImageOptimization, timestamps } from "bknd/plugins";
import schema from "./schema";

export default {
	app: (env) => ({
		adminOptions: {
			adminBasepath: "/admin",
		},
		config: {
			data: {
				...schema,
				default_primary_format: "uuid",
			},
			server: {
				mcp: {
					enabled: true,
				},
			},
			auth: {
				enabled: true,
				jwt: {
					issuer: "domzz",
					secret: env.SECRET_KEY,
				},
				guard: { enabled: true },
				allow_register: false,
				roles: {
					SYSTEM: {
						is_default: true,
						implicit_allow: false,
						permissions: [
							{
								permission: "system.access.api",
							},
							{
								permission: "media.file.read",
							},
							{
								permission: "data.entity.read",
							},
							{
								permission: "data.entity.create",
								policies: [
									{
										description: "Can create newsletter entries",
										condition: {
											entity: "newsletter",
										},
										effect: "allow",
									},
								],
							},
							{
								permission: "data.entity.update",
								policies: [
									{
										description: "Can update newsletter entries",
										condition: {
											entity: "newsletter",
										},
										effect: "allow",
									},
								],
							},
						],
					},
					ADMIN: {
						implicit_allow: true,
					},
				},
			},
			media: {
				enabled: true,
				adapter: {
					type: "r2",
					config: {
						binding: "BUCKET",
					},
				},
			},
		},
		options: {
			mode: "code",
			drivers: {
				email: resendEmail({
					from: "Domzz <onboarding@notifications.domzz.com>",
					apiKey: env.RESEND_KEY,
				}),
			},
			plugins: [
				timestamps({ entities: ["newsletter"], setUpdatedOnCreate: true }),
				cloudflareImageOptimization({
					accessUrl: "/api/_plugin/image/optimize",
					explain: true,
				}),
			],
		},
		onBuilt: async (app) => {
			console.info("On build");

			// -- send email after the record is inserted
			app.emgr.onEvent(
				DatabaseEvents.MutatorInsertAfter,
				async ({ params: { data, entity } }) => {
					if (entity.name === "newsletter") {
						const entry = data;

						await app.drivers?.email?.send(
							entry.email,
							"Confirm your email address",
							{
								text: `
                Confirm your email address

                Thanks for signing up for the waiting list.

                Please confirm your email address to be added to the list.

                Confirm your email by visiting the link below:
                https://domzz.com/waitlist/confirm/${entry.id}

                If you didn’t request to join the waiting list, you can safely ignore this email.

                --
                domzz.com
                `,
								html: `
                  <h3>Confirm your email address</h3>
                  <p>Thanks for signing up for the waiting list.</p>
                  <p>Please confirm your email address to be added to the list.</p>
                  <p><a href="https://domzz.com/waitlist/confirm/${entry.id}">Confirm email</a></p>
                  <br /><br />
                  <p>If you didn’t request to join the waiting list, you can safely ignore this email.</p>
                  <hr />
                  domzz.com
                `,
							},
						);
					}
				},
			);
		},
	}),
} satisfies CloudflareBkndConfig;

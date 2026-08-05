import { Nvisy, NvisyApiError } from "@nvisy/sdk";

// The API token authenticates every request. Never hard-code it — read it
// from the environment.
const apiToken = process.env.NVISY_API_TOKEN;
if (!apiToken) {
	throw new Error("NVISY_API_TOKEN is not set");
}

const client = new Nvisy({
	apiToken,
	// baseUrl defaults to https://api.nvisy.com; override for local/staging.
	baseUrl: process.env.NVISY_BASE_URL,
});

async function main() {
	// The authenticated account.
	const account = await client.account.getAccount();
	console.log(`Authenticated as ${account.username} (${account.emailAddress})`);

	// List workspaces (paginated: { items, nextCursor? }).
	const workspaces = await client.workspaces.listWorkspaces({ limit: 10 });
	console.log(`\nWorkspaces (${workspaces.items.length}):`);
	for (const workspace of workspaces.items) {
		console.log(`  - ${workspace.displayName} (${workspace.slug})`);
	}

	const workspace = workspaces.items[0];
	if (!workspace) {
		console.log("\nNo workspaces to explore. Create one to continue.");
		return;
	}

	// List pipelines in the first workspace.
	const pipelines = await client.pipelines.listPipelines(workspace.slug, {
		limit: 10,
	});
	console.log(`\nPipelines in ${workspace.slug} (${pipelines.items.length}):`);
	for (const pipeline of pipelines.items) {
		console.log(`  - ${pipeline.displayName} (${pipeline.slug})`);
	}

	// Trigger a pipeline run for an uploaded file.
	const pipeline = pipelines.items[0];
	const fileId = process.env.NVISY_FILE_ID;
	if (pipeline && fileId) {
		const run = await client.runs.createRun(workspace.slug, pipeline.slug, {
			fileId,
		});
		console.log(`\nStarted run ${run.id} (status: ${run.status})`);
	} else {
		console.log(
			"\nSet NVISY_FILE_ID (an uploaded file) to trigger a pipeline run.",
		);
	}
}

main().catch((error) => {
	if (error instanceof NvisyApiError) {
		// API errors carry the HTTP status and a structured body.
		console.error(`API error ${error.statusCode}: ${error.message}`);
		if (error.isRetryable()) console.error("(this error is retryable)");
		process.exit(1);
	}
	throw error;
});

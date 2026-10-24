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
		console.log(`  - ${workspace.displayName} (${workspace.id})`);
	}

	const workspace = workspaces.items[0];
	if (!workspace) {
		console.log("\nNo workspaces to explore. Create one to continue.");
		return;
	}

	// List the policies available in the first workspace.
	const policies = await client.policies.listPolicies(workspace.id, {
		limit: 10,
	});
	console.log(
		`\nPolicies in ${workspace.displayName} (${policies.items.length}):`,
	);
	for (const policy of policies.items) {
		console.log(`  - ${policy.displayName} (${policy.id})`);
	}

	// Start a detection over a document, running the first policy against it.
	const policy = policies.items[0];
	const documentId = process.env.NVISY_DOCUMENT_ID;
	if (policy && documentId) {
		const detection = await client.detections.createDetection(workspace.id, {
			documentId,
			policyIds: [policy.id],
		});
		console.log(
			`\nStarted detection ${detection.id} (status: ${detection.status})`,
		);
	} else {
		console.log(
			"\nSet NVISY_DOCUMENT_ID (an uploaded document) to start a detection.",
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

import type { ApiClient } from "@/client.js";
import type {
	AuthCapabilities,
	ConnectorCapabilities,
	LabelCatalog,
	RecognizerCatalog,
} from "@/datatypes/index.js";

/**
 * Service for reading the deployment's capabilities: the label taxonomy, the
 * registered recognizers, the connectors it can create, and the auth methods
 * it offers. Read-only; served by the `/capabilities/*` endpoints.
 */
export class Capabilities {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List the deployment's built-in label taxonomy.
	 * @returns Promise that resolves with the label catalog.
	 */
	async listLabels(): Promise<LabelCatalog> {
		const { data } = await this.#api.GET("/capabilities/labels");
		return data!;
	}

	/**
	 * List the engine's registered recognizers, grouped into NER and LLM.
	 * @returns Promise that resolves with the recognizer catalog.
	 */
	async listRecognizers(): Promise<RecognizerCatalog> {
		const { data } = await this.#api.GET("/capabilities/recognizers");
		return data!;
	}

	/**
	 * List which connector families and providers this deployment can create.
	 *
	 * An OAuth file-service provider is offered only when its app is configured
	 * on the server; object-store and inference connections carry their own
	 * credentials and are always available. Use it to render the connect UI
	 * without probing.
	 *
	 * @returns Promise that resolves with the connector capabilities.
	 */
	async listConnectors(): Promise<ConnectorCapabilities> {
		const { data } = await this.#api.GET("/capabilities/connectors");
		return data!;
	}

	/**
	 * List which authentication methods this deployment offers.
	 * @returns Promise that resolves with the auth capabilities.
	 */
	async getAuthCapabilities(): Promise<AuthCapabilities> {
		const { data } = await this.#api.GET("/capabilities/auth");
		return data!;
	}
}

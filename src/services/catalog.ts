import type { ApiClient } from "@/client.js";
import type {
	ConnectorCatalog,
	LabelCatalog,
	RecognizerCatalog,
} from "@/datatypes/index.js";

/**
 * Service for reading the deployment's built-in catalogs: the label taxonomy
 * and the registered recognizers that policies and pipelines can target.
 */
export class Catalog {
	#api: ApiClient;

	constructor(api: ApiClient) {
		this.#api = api;
	}

	/**
	 * List the deployment's built-in label taxonomy.
	 * @returns Promise that resolves with the label catalog.
	 */
	async listLabels(): Promise<LabelCatalog> {
		const { data } = await this.#api.GET("/catalog/labels/");
		return data!;
	}

	/**
	 * List the engine's registered recognizers, grouped into NER and LLM.
	 * @returns Promise that resolves with the recognizer catalog.
	 */
	async listRecognizers(): Promise<RecognizerCatalog> {
		const { data } = await this.#api.GET("/catalog/recognizers/");
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
	 * @returns Promise that resolves with the connector catalog.
	 */
	async listConnectors(): Promise<ConnectorCatalog> {
		const { data } = await this.#api.GET("/catalog/connectors/");
		return data!;
	}
}

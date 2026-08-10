import type { ApiClient } from "@/client.js";
import type { LabelCatalog, RecognizerCatalog } from "@/datatypes/index.js";

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
}

# Nvisy SDK client

A minimal script showing how to use the [`@nvisy/sdk`](../../README.md) client:
construct it with an API token, call services, page through results, start a
detection, and handle `NvisyApiError`.

## Run

```bash
npm install
cp .env.example .env   # then set NVISY_API_TOKEN
npm start
```

It prints the authenticated account, lists workspaces and the first
workspace's policies, and (if you set `NVISY_DOCUMENT_ID`) starts a detection
over that document with the first policy.

# Serverless Chart

This directory describes a Helm Chart that will setup OpenFAAS, Redis and PostgresQL.

This will download the required dependencies to the `charts/` directory.

```sh
helm dep update
```

This will apply the template and prints the output. *(Pipe this to a file for better readability.)*

```sh
helm template .
```

This will dry run the installation strategy. This is more complete than simply running the templating engine.

```sh
helm install --dry-run --debug --namespace serverless .
```

If everything is fine, install using this command in this directory.

```sh
helm install --namespace serverless .
```

Remember the release name and remove the release using:

```sh
helm delete <release-name>
```

# Serverless Chart

This directory describes a Helm Chart that will setup Redis and MongoDB.

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
helm install --dry-run --debug --name serverless --namespace serverless .
```

If everything is fine, install using this command in this directory.

```sh
helm install --name serverless --namespace serverless .
```

Remove the release using:

```sh
helm delete serverless
```

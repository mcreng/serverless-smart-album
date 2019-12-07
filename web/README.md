# Web Portal

## Development

```sh
npm i
npm start
```

Notice that in the development server, all request to the development server (default `localhost:3000`) are proxied to `http://127.0.0.1:31112`, in order to prevent CORS issues. You may refer to `client/package.json` and official react docs.

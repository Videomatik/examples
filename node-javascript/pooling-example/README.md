# Videomatik NodeJS pooling example

## How to run

Create a `.env` file in this folder and put in it you **API key**, following the naming convention of `.env.dist` (refer to the topmost *README* for instructions on how to get it).

After that, simply use the following command:

```console
> npm install && npm start
```

It should download all the videos in the `src/rendered-videos` folder, printing in the terminal, every 10 seconds, the current state of the video request.
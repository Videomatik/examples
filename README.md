<p align="center"><img src="https://storage.videomatik.com.br/videomatik/hidden_assets/CAWrMOC41nP9OqBfpOjxPNq4Chv1/2d01989c-222f-4f80-b617-23ce32c8b867.png" /></p>
<h3 align="center">Video creation made simple</h3>
<p align="center">Scale your creative content creation process with ease.</p>

# Videomatik Code Examples

**Looking for examples** to understand how Videomatik works? **You're in the right place!**

This repo aims to show how you can use Videomatik to make powerful **videos** in a **scalable** and **seamlessly** manner. Just pick up the example written in your programming language, open their README and see how to execute them.

All projects have the same goal: to make videos of 5 products that are on special offers. These products are in a file called `products.json`. This file's location varies for each project, but generally it's inside the `data/` folder.

## Getting started

Before you can run any of the projects, you will need an **API key**. In order to get yours, simply go to [Videomatik's dashboard](https://dashboard.videomatik.com.br/), create you **account** and go to the **API keys** tab. You should already see your first API key in the page.

Be mindful that you will need to put this key on the `.env` file of the projects you want to run. 

## Core Concepts

Here, we are going through some core concepts of Videomatik you should **definitely** know about before you start to play with the examples. Let's take a quick look at them.

### Templates

Videomatik is based on **customizable templates** that can be browsed on our [platform](https://dashboard.videomatik.com.br/templates/?category=all&format=all). You can either use any of the **premade** templates or **request us** to use **your own**.

Templates can have multiple **compositions**, which are different resolutions of the video. The most commons compositions are `'default'`, usually a vertical video (1080x1920px), and `'feed'`, which is a square video (1080x1080px).

### Custom JSON

The ***Custom JSON*** is a JSON object, associated with a video Template, which has all the attributes you can edit to customize you video. It usually has the following properties:

  - **images**: Array of objects with Images available to edit.
  - **texts**: Array of objects with Texts available to edit.
  - **shapes**: Array of objects with Shapes available to edit.
  - **colors**: (Optional) Array of objects with Colors available to edit.
  - **toggles**: (Optional) Array of objects with Toggle features available to edit.

*NOTE: Some templates may be available only through the API and their Custom JSON may be different.*

### Video Requests

Having the Custom JSONs in hand, you're all up to go for the ***Video Requests***. As the name suggests, these are the **requests** you make to Videomatik, through the API, to **produce your videos**. It has the following properties on it's body:
  - **templateId**: ID of the video Template which will be rendered.
  - **customJSON**: A JSON object with all the properties of the video that will be customized on the template. It should be corresponding to the Template.
  - **compositionId**: (Optional) ID of the composition of the Template which will be rendered. The default is 'default'.
  - **actions**: (Optional) Actions that should be performed after the video is created. Webhooks go here!

## Repository Structure

As previously mentioned, each programming language has it's own folder (such as `'node-javascript'`, `'python'`, `'java'` etc.). If there aren't examples for your programming language, please let us know by **opening an issue**.

For each programming languages, there will be two different examples:

### Pooling

In this example, you will execute a script that will, **sequentially**, create video requests for all the products. 

After each one is created, the program will starting **pooling** Videomatik every 10 seconds to discover the state of the video rendering process, printing it to the terminal.

When the video is completely rendered, the script will download it to the `rendered-videos/` folder.

After downloading all the videos, the process ends.

### Webhook

In this example, you will execute a script that will create video requests for all the products **in parallel**. 

After each one is created, the program will await for a webhook to come from Videomatik, stating that the **rendering** process **started** or already **completed**, printing to the terminal accordingly. For this to happen, a simple **HTTP server** is open in port 3333 (by default) with only **one route** that handles the webhook call (`'/videomatik-webhook'`).

When the video is completely rendered, the script will download it to the `rendered-videos/` folder.

After downloading all the videos, the process ends.

## Contributing

Currently, we are not opening for people outside of Videomatik to produce the examples. If you notice that an example for a programming languague you want doens't exist, please open an issue to let us know! It's gonna be really appreciated :)
# Kraken_Example_Date_Format_Helper

Formatting dates in JavaScript is usually an annoying task, but when you have to add in support for internationalization
it becomes downright aggravating.

If your Kraken application needs to display dates, you can take advantage of dustjs-linkedin's helpers to let the template
handle the formatting for you. This helps you keep your code concise, and separate the logic and interface layers cleanly.

In this example we'll create a helper that will format *and* localize a Date object for us.

The end goal is to create a helper in the form:

`{@formatDate date="<date_object>" format="<format_string>"}`

Where:
* **&lt;date_object&gt;** is the Date to render
* **&lt;format_string&gt;** is an optional text string that follows the [momentJS conventions](http://momentjs.com/docs/#/displaying/format/)

Example format_strings:
```
"dddd, MMMM Do YYYY, h:mm:ss a" => "Sunday, February 14th 2010, 3:25:50 pm"
"ddd, hA"                       => "Sun, 3PM"
```

This repository was created specifically to hold the example. If you look at the [commit list](https://github.com/lmarkus/Kraken_Example_Date_Format_Helper/commits/master), you will see
how the application was built, step by step.

## Starting point
This application picks up at the end of the [KrakenJS Localization Example](https://github.com/lensam69/Kraken_Example_Localization).
You should follow that tutorial first to make sure that your application can handle different locales.

[<img src='http://upload.wikimedia.org/wikipedia/commons/thumb/2/25/External.svg/600px-External.svg.png' width='12px' height='12px'/>View commit](https://github.com/lmarkus/Kraken_Example_Date_Format_Helper/commit/ae8a4daf489bc6e9959b503ed5aba339165223b6)

## Dependencies
The first step is installing the excellent [Moment.js](http://momentjs.com/) library. This library implements date
formatting and internationalization, so instead of reinventing the wheel, we'll take advantage of its great features.

`npm install --save moment`

[<img src='http://upload.wikimedia.org/wikipedia/commons/thumb/2/25/External.svg/600px-External.svg.png' width='12px' height='12px'/>View commit](https://github.com/lmarkus/Kraken_Example_Date_Format_Helper/commit/81dd0c71a4dd384682337a74e731fd03d1a8dfda)

## Creating the helper as a library

Let's create `./lib/helper-dateFormat` to hold our special helper.

Here's the relevant part of the helper code. It has been written following [dustjs-linkedin's advice](https://github.com/linkedin/dustjs/wiki/Dust-Tutorial#writing-a-dust-helper).

```javascript
    //Create a helper called 'formatDate'
    dust.helpers.formatDate = function (chunk, context, bodies, params) {

        //Retrieve the date value from the template parameters.
        var date = dust.helpers.tap(params.date, chunk, context);

        //Retrieve the format string from the template parameters.
        var format = dust.helpers.tap(params.format, chunk, context);

        //Parse the date object using MomentJS
        var m = moment(new Date(date));

        //Format the string
        var output = m.format(format);

        //Write the final value out to the template
        return chunk.write(output);
    };
```

[<img src='http://upload.wikimedia.org/wikipedia/commons/thumb/2/25/External.svg/600px-External.svg.png' width='12px' height='12px'/>View commit](https://github.com/lmarkus/Kraken_Example_Date_Format_Helper/commit/9fc7da0f40e2e1a56895895e5102f7372e12c8b2)

## The helper library in action

To load the library, we'll *require* it from our applications entry point. In `./index.js`:
```javascript
//Load our custom helper
require('./lib/helper-formatDate');
```

Next, we'll add a date to the model to be rendered. In `./controllers/index.js`:
```javascript
model.theDate = new Date();
res.render('index', model);
```

Finally, we'll add our helper tag in the template to be rendered. In `./public/templates/index.js`:
```html
    <h2>Raw: {theDate}</h2>
    <h2>Formatted: {@formatDate date="{theDate}" format="dddd MMM Do YY"/}</h2>
```
We'll show both the raw and the formatted date for comparison.

[<img src='http://upload.wikimedia.org/wikipedia/commons/thumb/2/25/External.svg/600px-External.svg.png' width='12px' height='12px'/>View commit](https://github.com/lmarkus/Kraken_Example_Date_Format_Helper/commit/875f0c15b44dd49c2ce048789c009f2c9cbbf2a9)

Go ahead and give the application a spin and visit http://localhost:8000
```bash
$npm start
```

## What about the localization?

Glad you asked. Since MomentJS supports localization out of the box, we simply need to feed a country-language pair that our
application is currently set to.  The Kraken Localization example that served as the starting point, switches randomly
between three different languages.

The language becomes part of the context to be rendered, so we only need to make our helper aware of it:

In `./lib/helper-formatDate`:

First we're going to load the project configuration. This will be used to retrieve the fallback language, as specified in `./config/app.json`:
```javascript
// Load the project's configuration
var nconf = require('nconf');

...

//Retrieve the fallback language from the configuration
var fallbackLang = nconf.get('i18n').fallback || 'en-US';
```

Next, we're going to dig the locality out of the *context* object:
```javascript
//Dig the current language out of the context, or go to the fallback.
var lang = (context.stack && context.stack.head && context.stack.head.context && context.stack.head.context.locality) || fallbackLang;
```

Finally, we're going to provide the locality to the MomentJs object that will format the date:
```javascript
//Set the language in which the date should be formatted
m.lang(lang);
```

And that's it.

Reload the page a few times, and as the locality changes randomly, the date will be formatted accordingly.

[<img src='http://upload.wikimedia.org/wikipedia/commons/thumb/2/25/External.svg/600px-External.svg.png' width='12px' height='12px'/>View commit](https://github.com/lmarkus/Kraken_Example_Date_Format_Helper/commit/7efe6fef826abd496b865971805ee123965301b3)


## And you're done!
This is your example.
If you find any typos, errors, bugs or you have suggestions for improvement, please feel free to open an issue, or send your pull requests.

## Notes

[<img src='http://imgs.xkcd.com/comics/iso_8601.png'/>](http://xkcd.com/1179/)



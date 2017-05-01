Angular Datepicker
==================
Light AngularJS directive that generates a datepicker calendar on your input element.

## Load

To use the directive, include the Angular Datepicker's javascript and css files in your web page:

```html
<!DOCTYPE HTML>
<html>
<head>
  <link href="dist/angular-datepicker.css" rel="stylesheet" type="text/css" />
</head>
<body ng-app="app">
  //.....
  <script src="dist/angular-datepicker.js"></script>
</body>
</html>
```

## Installation

#### Npm

```
$ npm install https://github.com/ozadev/angular-datepicker --save
```

#### Git repo

```
$ git clone https://github.com/ozadev/angular-datepicker
```

_then load the js files from dist folder in your html_

### Add module dependency

Add the 'ozas.datepicker' module dependency

```js
angular.module('app', [
  'ozas.datepicker'
 ]);
```

Call the directive wherever you want in your html page

```html
<datepicker>
  <input ng-model="date" type="text"/>
</datepicker>
```

### Use gulp tasks to rebuild from sources

- gulp (default) - _general js + scss build and watcher enabled_
- gulp build-all - _general js + scss build_
- gulp build - _angular js build_
- gulp sass - _scss build_
- gulp compress-all - _js + scss compress (minification)_
- gulp compress - _js compress_
- gulp sass-min - _scss build with minification_
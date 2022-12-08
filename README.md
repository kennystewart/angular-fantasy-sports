# Starting NHL Goalies and NBA Starters Angular 14 MySportsFeeds API
This is a single page app which uses the [MySportsFeeds API](https://www.mysportsfeeds.com/data-feeds/api-docs/#) to get starting NHL goalie data. 

### Description
This [application](https://nhl-starting-goalies-angular.herokuapp.com/) is made with Angular (version 14.0.2). This SPA app is hosted for free on Heroku (cloud application platform). The data is sourced through the [MySportsFeeds API](https://www.mysportsfeeds.com/data-feeds/api-docs/#).

This app can help explain how to fetch data using [Angular's HttpClient Module](https://angular.io/guide/http) from a robust api.  

### You can learn this
* Create user authentication on firebase.
* Get realtime data updates from firebase. 
* Use twitter API to get player updates.   
* [Use the HttpClient module to connect to an api and get data returned in milliseconds.](https://www.ianposton.com/angular4-httpclient/)
* [Deploy an Angular 12 app to Heroku.](https://www.ianposton.com/angular4-deploy-to-heroku/) 
* Encrypy/Decrypt heroku config vars with Crypto-js.

### Software used for this application
* Angular (version 14.0.2) 
* Angular CLI (version 14.0.2)
* Node.js (version 14.7.5)    
* Heroku [Set up a free account ](https://www.heroku.com/)
* [Firebase](https://firebase.google.com/) (version 7.16.1) 
* @angular/fire (version 6.0.2)
* NPM (version 7.21.1)
* rxjs (version 6.6.0)
* [MySportsFeeds API](https://www.mysportsfeeds.com/data-feeds/api-docs/#)

### Clone and serve this app
* First you will need to be given access MySportsFeeds endpoints. As a developer working on a non-commercial app you can be given access to the endpoints. Let MSF that you are working on a non-commercial project and they will send you an api token. Sign up at MySportsFeeds and use the api token in the header request to authenticate the api get request. `let headers = new HttpHeaders().set("Authorization", "Basic " + btoa(apiToken + ":" + 'MYSPORTSFEEDS'));`
* When the api headers are in place clone this repo and run <code>npm install</code> then run <code>ng serve</code> to serve the app on `localhost:4200`. Be careful not to push your api password to github.

### Create user authentication with firebase
The purpose of this app is to show each days confirmed starting NHL goalies. The api provides a best guess and the actual starter does not get updated to until well into game time. This created a lot of false data being represented on this app. I created a system of indicators that work with a Boolean. If a NHl goalie is a guess then I will show an orange expected indicator in my app next to the goalie, if the NHL goalie has been confirmed by his team I will show a green confirmed indicator next to the goalie. 

Since I could not rely on the api to update a confirmed starting goalie fast enough I needed to source my own data and and update the goalie's starting status manually. This means I made my own goalie json file and synced it to the api using each goalies ID. I added an expected and confirmed attribute to each goalie when the app loads. Now I can update those attributes on the ng-model of each goalie and save it to my firebase db. This will get me quicker updates and avoid showing false data by overriding the returned data from the api. 

I created a small cms to allow me to update the goalies status by clicking on their image to toggle true or false. I created a view that can only be accessed by me so that a random user wouldn't be able to make un-wanted changes to my app. In order to lock off this cms admin zone just for me I used firebase to create a special user authentication token. If I use the correct name and password my cms will appear and I can make quick updates right in the view where I want to see them.

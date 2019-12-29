# Travel App

1) Get username on geocode and update username in .env



## Project Objective
The objective is to build a website that analyses the sentiment of a news article by using Natural Language Processing.

The user can enter the url of the article and with the help of Aylien API the article is analysed regarding polarity and subjectivity.

## Building process
- Setting up webpack
  - followed course and project instructions with following adjustments: 
    1. added file-loader for picture
    2. added image-webpack-loader to reduce picture size
    3. uninstalled node-sass and installed sass, to be able to use @use in scss files
- Sass styles
  - used nesting, variables and sass ampersand
- Service workers
  - followed course instructions
- API: Using Aylien API and creating requests to external urls
- Testing: Using jest to test for valid urls and successful API requests

## Result
![screenshot](src/client/img/appscreenshot.png)

# Image tiler

## Prerequisites
 - node > 10.0.0
 - npm > 6.0.0

## Installation
```
$ npm ci
```

## Running
Generate image tiles to for showing in ui  
`OUTPUT_IMAGE_PATH` = `../ui/src/assets/images`  
`INPUT_IMAGE_PATH`= `images/original.jpg`

```
$ npm start
```

check result in `OUTPUT_IMAGE_PATH` folder

## Test

```
$ npm test
```

## TODO
1. add more integration tests to check created image files
2. add more unit tests for image extension and & crop function
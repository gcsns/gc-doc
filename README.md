# GC-Router

GC Logger that adds a documentation route automatically

### Installation

#

```sh
$ npm install @gamechange/gc-doc
```

## Breaking changes in major version update 4.0.0

Access-Control-Allow-Origin` was being set to '*'. Now by default it will not set. it will be set to the value being passed as `allowedOrigin` parameter of `Router.initialize` function. 

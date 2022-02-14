# pomelo-assignment
## Local Test
### Prerequisite
NodeJS: v14.15.4

`npm install`  
`sls offline`

### Query all
`curl -X POST -H "Content-Type: application/json" -d "@test/input-body.json" http://localhost:3000/statistics`

#### Query with merchantType path
`curl -X POST -H "Content-Type: application/json" -d "@test/input-body.json" http://localhost:3000/statistics/{merchantType}`  
*merchantType* can be __foodbev__ OR __gov__
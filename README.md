# CassetteNet

[![Netlify Status](https://api.netlify.com/api/v1/badges/f52f79f7-a34d-4cce-ad7e-2174387bd3a7/deploy-status)](https://app.netlify.com/sites/cassettenet/deploys)
## Deployment
### Web Client
`master` branch is automatically deployed to [Netlify](https://cassettenet.netlify.app/).

### Server
TBD

## Running locally
Install Docker and Docker-Compose and run the following commands starting from the root of the repository:

```
cd docker
docker-compose up
```

This will spin up 3 containers for the client, server, and database and automatically connect them to each other; access the client by navigating to `http://localhost:3000`. In addition, a fourth container for an Admin GUI interface for mongo is also created and can be accessed at `http://localhost:3001`.

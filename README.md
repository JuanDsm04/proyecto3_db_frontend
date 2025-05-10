# Proyecto 3

This repository contains the frontend for an application that connects to a database, shows information in real time and allows for exporting the data to PDF and CSV.

## Getting started
The project includes a `docker-compose.yml` file to run the application and its database with Docker.

### Prerequisites
- Git
- Docker Compose

### Installation
1. **Clone** the frontend and backend repositories inside the same parent folder.
```sh
git clone https://github.com/vicperezch/db-project3.git
git clone https://github.com/JuanDsm04/proyecto3_db_frontend.git
cd proyecto3_db_frontend
```

2. **Run** the containers.
```
docker-compose up --build
```

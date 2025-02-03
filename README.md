## REHA asistent

## NAVODILA ZA UPORABO
- najlažji način zagona bo z Docker https://www.docker.com/

### Backend
- v mapi "server" zaženi:
    1. docker build -t server .
    2. docker run -it -p 3000:3000 -v ./:/server server
- odpri stran localhost:3000 v brskalniku

### Frontend
- v mapi "app" zaženi:
    1. docker build -t app .
    2. docker run -it -p 8081:8081 -v ./:/app app
- odpri stran localhost:8081 v brskalniku
- zagon na telefonu
    1. naloži aplikacijo Expo Go
    2. uporabljaj enak wifi da dela na telefonu

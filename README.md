## REHA asistent

# Backend
- najlažji način zagona bo z Docker https://www.docker.com/
- če še ne uporabljate Docker je najlažji zagon da odprete konzolo v mapi "server" in zaženete:
    1. docker build -t server .
    2. docker run -it -p 3000:3000 -v ./:/server server
    3. če piše "no permission" pred komando dajte "sudo" (Linux)
    4. odprite stran localhost:3000 v brskalniku

# Frontend

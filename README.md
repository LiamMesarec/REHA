# REHA asistent
## Opis
Aplikacija je sestavljena iz dveh delov: e-knjižnica in koledar. E-knjižnica omogoča dodajanje in prenos datotek in organizacijo datotek v mape. Koledar omogoča pregled, dodajanje in urejanje dogodkov ter povezovanje dogodkov z datotekami iz e-knjižnice. Namenjena je enostavnemu upravljanju gradiv in dogodkov za uporabnike.

## Zagon
- naloži Docker https://www.docker.com/
- **najlažji način**: v mapah "server" in "app" zaženi:
    - docker-compose up --build --watch
- **zagon aplikacije na telefonu**:
    - namesto docker uporabi npm
    1. npm install --force
    2. npm install -g expo
    3. npx expo start
    4. naloži aplikacijo Expo Go na telefonu
    5. pazi da sta računalnik in telefon na istem wifi, v aplikaciji Expo Go skeniraj QR kodo ki jo dobiš iz npx expo start

- **zagon strežnika brez Docker**: poglej katere npm install ukaze uporablja Dockerfile, poglej kateri ukaz za zagon uporablja docker-compose.yml

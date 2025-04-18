# Заготовка для Bitrix24 App
В работе используется технология Docker.

При первом использовании необходимо собрать образ.  
Команда выполняется в той же директории, где находиться файл Dockerfile  
Процесс может занять какое-то время.  
Команда сборки образа:  
```
docker build -t vue .
```
После завершения можно проверить, создался ли образ командой
```
docker images
```
Результатом будет таблица образов среди которых должен быть **vue**
```
REPOSITORY         TAG       IMAGE ID       CREATED              SIZE
vue                latest    788bc6a6420b   About a minute ago   931MB
```
После того как образ создан, можно работать с контейнером.  
Нам нужно будет его запускать и когда закончиться работа, останавливать.  
Запуск контейнера (из папки app)
```
docker run --name vue_app --rm --detach -p 3000:3000 -p 3001:3001 -v "${PWD}/dist:/app/dist" -v "${PWD}/src:/app/src" vue
```
После того как работа была завершена, можно остановить контейнер  
Остановка контейнера
```
docker stop vue_app
```

После запуска контейнера можно проверить список запущеных контейнеров командой 
```
docker ps
```
Будет выведена таблица с информацией о запущенных контейнерах.  
Запущенный контейнеры ранее будет иметь имя vue_app (колонка NAMES)
``` 
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS        PORTS                                                           NAMES
64c39f05bd10   vue       "docker-entrypoint.s…"   2 seconds ago   Up 1 second   0.0.0.0:3000-3001->3000-3001/tcp, :::3000-3001->3000-3001/tcp   vue_app
```
Когда контейнер запущен, можно проверить работу приложения по адресу https://localhost:3001 или http://localhost:3000


# Запуск команд внутри контейнера

В файле package.json есть список скриптов которые можно запустить, для запуска их в контейнере надо ввести команду:
```
docker exec vue_app npm run <название скрипта>
```
При этом скрипт **start** запускать не надо, он уже запущен  
Так для hot-reload достаточно запустить команду
```
docker exec vue_app npm run "build&watch"
```
Для сборки проекта
```
docker exec vue_app npm run build
```
Можно добавить NPM пакет
```
docker exec vue_app npm i @craydel/craydel-alert
```
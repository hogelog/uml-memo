### Parcel ############################################################################
FROM node:lts AS build-parcel

RUN yarn global add parcel

RUN mkdir -p /app
WORKDIR /app

COPY package.json yarn.lock /app/

COPY web /app/web/
RUN yarn build

### Build ############################################################################
FROM adoptopenjdk/openjdk11:x86_64-ubuntu-jdk-11.0.4_11 AS build-image

VOLUME /tmp
RUN mkdir -p /app /log
WORKDIR /app

COPY gradlew /app/
COPY gradle /app/gradle
# to cache latest gradlew
RUN ./gradlew --version

COPY build.gradle .
COPY src /app/src/
COPY --from=build-parcel /app/src/main/resources/static/ /app/src/main/resources/static/
RUN ./gradlew assemble

### Runtime ##########################################################################
FROM adoptopenjdk/openjdk11:x86_64-ubuntu-jre-11.0.4_11

RUN apt-get update && \
  apt-get install -y graphviz fonts-vlgothic && \
  apt-get clean

RUN mkdir -p /app /log
WORKDIR /app

COPY config /app/config/
COPY --from=build-image /app/build/libs/uml-memo-executable.jar /app/

EXPOSE 8080
CMD ["java", "-Dlogging.config=config/logback.xml", "-jar", "uml-memo-executable.jar"]

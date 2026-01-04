# Use "maven:3-openjdk-21" to auto-select the latest Maven 3 version with JDK 21
FROM maven:3.9.8-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:21-jdk-slim

WORKDIR /app

COPY --from=build /app/target/DriveLocker-0.0.1-SNAPSHOT.jar .

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/DriveLocker-0.0.1-SNAPSHOT.jar"]

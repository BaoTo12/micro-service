# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# copy pom.xml và download dependencies (kể cả parent)
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# copy source code và build
COPY src ./src
RUN mvn clean package -DskipTests -X

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

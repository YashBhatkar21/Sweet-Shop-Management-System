# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:17-jdk

# Set the working directory in the container
WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY .mvn .mvn
COPY mvnw pom.xml ./

# Copy the rest of the application source
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose the port your app runs on (default 8080 or 8081)
EXPOSE 8081

# Run the application
CMD ["java", "-jar", "target/sweet-shop-0.0.1-SNAPSHOT.jar"]
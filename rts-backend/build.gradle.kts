plugins {
	java
	id("org.springframework.boot") version "4.1.1"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "com.rts"
version = "0.0.1-SNAPSHOT"

java {
}

repositories {
	mavenCentral()
}

dependencies {
	// --- Spring Boot starters ---
	implementation("org.springframework.boot:spring-boot-starter-actuator")
	implementation("org.springframework.boot:spring-boot-starter-data-jdbc")
	implementation("org.springframework.boot:spring-boot-starter-flyway")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-webmvc")

	// --- Database ---
	implementation("org.flywaydb:flyway-database-postgresql")
	runtimeOnly("org.postgresql:postgresql")

	// --- OpenAPI documentation ---
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.6")

	// --- Git analysis (Phase 4+) ---
	implementation("org.eclipse.jgit:org.eclipse.jgit:7.2.0.202503040940-r")

	// --- Java AST parsing (Phase 4+) ---
	implementation("com.github.javaparser:javaparser-core:3.26.4")

	// --- Dev tools ---
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	developmentOnly("org.springframework.boot:spring-boot-docker-compose")

	// --- Testing ---
	testImplementation("org.springframework.boot:spring-boot-starter-actuator-test")
	testImplementation("org.springframework.boot:spring-boot-starter-data-jdbc-test")
	testImplementation("org.springframework.boot:spring-boot-starter-flyway-test")
	testImplementation("org.springframework.boot:spring-boot-starter-validation-test")
	testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
	testImplementation("org.springframework.boot:spring-boot-testcontainers")
	testImplementation("org.assertj:assertj-core")
	testImplementation("org.mockito:mockito-core")
	testImplementation("org.testcontainers:postgresql:1.20.1")
	testImplementation("org.testcontainers:junit-jupiter:1.20.1")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
	useJUnitPlatform()
}

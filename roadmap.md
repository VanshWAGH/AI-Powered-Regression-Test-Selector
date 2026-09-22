# RTS Product Vision: Current State vs Roadmap

Here is a comprehensive analysis of how the current codebase aligns with your original product vision, what is pending, and the concrete steps needed to make it a fast, scalable, truly AI-powered Regression Test Selector.

## 1. How are we doing against the plan?

We have successfully built the **entire foundational architecture**. The system is highly aligned with your original tech stack and design.

| Architecture Block | Current Status | Notes |
| :--- | :--- | :--- |
| **Data Ingestion** | ✅ Completed | Webhooks, JGit cloning, and PostgreSQL persistence are fully implemented and working. |
| **Recommendation Engine** | ⚠️ Partial (Heuristics) | We built the ranking and selection engine, but it currently uses a hardcoded math formula (code impact + failure rate + coverage) instead of ML. |
| **API / Backend** | ✅ Completed | Java 17, Spring Boot, Flyway, and REST APIs are fully functional and production-ready. |
| **AI / Model Layer** | ❌ Pending | No Python model, ONNX runtime, or gradient-boosted trees have been implemented yet. |
| **CI Integration (Plugins)**| ❌ Pending | We have the API, but no GitHub Action or CLI tool yet to inject into actual CI pipelines. |

---

## 2. What functionality is pending? (The Gaps)

To realize the full product vision, three major pieces are missing:

1. **The AI/ML Model Layer (Python/ONNX)**
   Right now, `RecommendationEngine.java` computes a score using basic multiplication. We need to replace this with a real Machine Learning model (like LightGBM or Random Forest) that predicts the probability of a test failing based on historical data.
2. **CI Pipeline Integration (The "Glue")**
   The backend can generate recommendations, but developers need a seamless way to use them. We need a CLI tool or GitHub Action that calls `GET /api/v1/recommendations`, parses the response, and automatically runs `mvn test -Dtest=...`.
3. **Advanced Feature Engineering**
   We currently match changed files to test classes by string similarity. We need deeper static analysis (Call-graphs) to know if a test relies on a modified utility class.

---

## 3. How to refine for Speed and Scalability

If this is going to be used by hundreds of repositories with thousands of PRs, we need to address bottlenecks:

> [!TIP]
> **Speed (Latency < 10s per PR)**
> - **Shallow Git Clones:** Currently, JGit clones the whole repo. We need to refine this to only fetch the diff between the `head` and `base` commits.
> - **Pre-computed Features:** Instead of analyzing history on the fly, compute test failure rates asynchronously in the background.

> [!TIP]
> **Scalability (Multi-tenant)**
> - **Message Queues:** Webhooks should immediately drop payloads into a Kafka or RabbitMQ queue and return `200 OK`. Workers should pick up the heavy AST parsing asynchronously.
> - **Microservices:** The Python AI inference should live in a separate stateless FastAPI service that can auto-scale independently of the Java backend.

---

## 4. The Actionable Task List (Next Steps)

Here is the roadmap to finish the product, ordered by priority:

### Phase 1: CI Integration (Get it working end-to-end)
- `[ ]` **Build the RTS CLI Wrapper**: Create a lightweight Bash or Node.js script that CI pipelines can download.
- `[ ]` **Implement CI execution logic**: The script must query the RTS backend, generate a comma-separated list of tests, and execute `mvn test -Dtest="TestA,TestB"`.
- `[ ]` **Report Results Back**: The script must parse the JUnit XML output and send the pass/fail results back to the RTS backend to build the historical database.

### Phase 2: The AI Integration (The Brains)
- `[ ]` **Data Extraction**: Write a Java job that exports our PostgreSQL historical data (PR diffs + Test passes/fails) into a CSV/JSON format for training.
- `[ ]` **Train the Model (Python)**: Create a Python script using `scikit-learn` or `LightGBM` to train a binary classifier (Will this test fail? 1 or 0) based on features (failure rate, lines changed).
- `[ ]` **Model Deployment**: Wrap the Python model in a `FastAPI` microservice.
- `[ ]` **Wire Java to Python**: Update `RecommendationEngine.java` to make a fast HTTP POST to the Python FastAPI service, passing the feature vectors and receiving the probability scores.

### Phase 3: Advanced Features & Scaling
- `[ ]` **AST Call-Graph Coupling**: Enhance `AnalysisService.java` to build a dependency graph so the engine knows if `OrderServiceTest` depends on a modified `PaymentUtils.java`.
- `[ ]` **Webhook Async Processing**: Move webhook processing to a background worker queue so GitHub/GitLab doesn't time out.
- `[ ]` **Time/Coverage Constraints**: Add logic to the Recommendation Engine to accept user constraints (e.g., "Give me the best tests that can run in under 5 minutes").

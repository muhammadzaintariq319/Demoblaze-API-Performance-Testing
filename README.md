# 🚀 Demoblaze API Performance Engineering Suite

A comprehensive performance testing and engineering repository for the [Demoblaze](https://www.demoblaze.com/) e-commerce platform API. This project systematically evaluates backend stability, endurance, throughput, and scalability under varying levels of simulated concurrent user load using **Apache JMeter**.

## 🛠️ Tools & Technologies

* **Performance Testing Tool:** Apache JMeter 5.6.3
* **Target Application:** Demoblaze API (`api.demoblaze.com`)
* **Test Data Management:** CSV Data Set Config for dynamic user sessions and cart mapping
* **Reporting:** JMeter HTML Dashboard and Aggregate Reports
* **Test Execution:** Concurrent virtual users with configurable load profiles

## 📊 Test Architecture & Scenarios

The testing suite is divided into six performance engineering scenarios, each designed to evaluate a different aspect of API performance, resilience, and scalability.

| Test Type                       | Objective                                                                                       | Configuration Highlights                                                                                 |
| :------------------------------ | :---------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| **1. Load Testing**             | Establish baseline performance under expected traffic conditions.                               | Validated API response times, throughput, and session flow stability.                                    |
| **2. Volume Testing**           | Evaluate API and database behavior when processing a high volume of sequential transactions.    | 20 consecutive cart-item additions per user.                                                             |
| **3. Spike Testing**            | Evaluate system resilience and recovery when traffic increases suddenly.                        | Instant injection of 95 concurrent users to identify timeouts, failures, or 503 responses.               |
| **4. Stress Testing**           | Identify performance degradation and potential breaking points as load progressively increases. | Staircase load from 10 → 20 → 30 → 40 concurrent users, increasing every 60 seconds.                     |
| **5. Soak (Endurance) Testing** | Identify long-running stability issues, memory leaks, and resource exhaustion.                  | Sustained load of 15 concurrent users for 30 minutes.                                                    |
| **6. Scalability Testing**      | Evaluate system behavior as concurrent user load increases and identify capacity limitations.   | Stepped load increments up to 100 concurrent users to monitor response times and processing bottlenecks. |

## 💡 Key Findings & Performance Bottlenecks

### ✅ High System Resilience

The API demonstrated strong stability across the tested scenarios, including high-volume transactions, sudden traffic spikes, and a 30-minute endurance test. The test runs maintained a near **0.00% error rate**, with no critical server crashes or widespread timeout cascades observed during baseline or peak execution.

### ⚠️ Critical Scalability Bottleneck

The `POST /viewcart` endpoint showed significant performance degradation under high concurrency.

During the Scalability Test, as the load approached **100 concurrent users**, the maximum response time for cart retrieval increased from approximately **500 ms under lower load to more than 11.5 seconds**.

This behavior indicates that the endpoint may require further optimization, particularly around:

* Database query optimization
* Database indexing
* Query execution efficiency
* Caching strategies
* Backend resource utilization
* Connection/resource management

> **Performance Insight:** Although the API maintained a very low error rate, increasing response time under higher concurrency indicates a scalability limitation. A low error rate alone does not guarantee good performance.

## 📁 Repository Structure

```text
📂 Demoblaze-API-Performance-Testing
│
├── Load_Test.jmx
│   └── Baseline load evaluation
│
├── Volume_Test.jmx
│   └── High-volume transaction testing
│
├── Spike_Test.jmx
│   └── Sudden traffic burst testing
│
├── Stress_Test.jmx
│   └── Progressive staircase load testing
│
├── Soak_Endurance_Test.jmx
│   └── 30-minute endurance testing
│
├── Scalability_Test.jmx
│   └── Capacity and scalability evaluation
│
├── users.csv
│   └── Test data containing user credentials
│
├── 📂 Reports
    └── Generated JMeter HTML dashboards and statistical reports

```

## 📈 Performance Testing Objectives

This project focuses on measuring and analyzing key performance indicators including:

* **Response Time**
* **Throughput**
* **Error Rate**
* **Concurrent Users**
* **Request Processing Rate**
* **Performance Degradation**
* **System Stability**
* **Scalability Limits**

The goal is not only to determine whether the API works, but to understand **how it behaves as workload increases over time**.

## 🧪 Test Execution

The tests can be executed using JMeter's non-GUI mode for realistic performance testing.

Example:

```bash
jmeter -n -t Load_Test.jmx -l results.jtl -e -o Reports/Load_Test_Report
```

Where:

* `-n` runs JMeter in non-GUI mode
* `-t` specifies the JMeter test plan
* `-l` stores test results in a `.jtl` file
* `-e` generates the HTML dashboard
* `-o` specifies the HTML report output directory

## 📊 Reporting

Each performance test generates supporting evidence through:

* JMeter HTML Dashboard Reports
* Aggregate Reports
* Response Time statistics
* Throughput measurements
* Error-rate analysis
* Active thread graphs
* Response time graphs
* Screenshots of key performance metrics

## 🎯 Conclusion

The Demoblaze API demonstrated strong resilience and stability under the tested workloads, maintaining an extremely low error rate across multiple performance scenarios.

However, the scalability test identified a significant bottleneck in the `POST /viewcart` endpoint. The substantial increase in response time at higher concurrency suggests that additional backend optimization may be required before the API can efficiently support significantly larger workloads.

This project demonstrates a complete performance engineering workflow, from **baseline testing and workload modeling to stress, spike, endurance, and scalability analysis using Apache JMeter**.

# Baseline Load Test Report (100 Concurrent Users / 1 Minute)

**Target URL:** `http://localhost:5000/api/health`  
**Concurrent Virtual Users:** `100`  
**Test Duration:** `60 seconds`  
**Timestamp:** `2026-08-27T03:48:34.035Z`  

---

## 1. Key Performance Indicators (KPIs)

| Metric | Measured Result | Target SLA | Health Status |
| :--- | :---: | :---: | :---: |
| **Requests Per Second (RPS)** | **2732.6 req/sec** | > 100 req/sec | 🟢 Passed |
| **Average Response Time** | **36.1 ms** | < 300 ms | 🟢 Passed |
| **Minimum Response Time (Fastest)** | **21.0 ms** | < 50 ms | 🟢 Passed |
| **Median Latency (p50)** | **34.0 ms** | < 200 ms | 🟢 Passed |
| **90th Percentile (p90)** | **46.0 ms** | < 500 ms | 🟢 Passed |
| **99th Percentile (p99)** | **66.0 ms** | < 1000 ms | 🟢 Passed |
| **Maximum Response Time (Slowest)** | **231.0 ms** | < 2000 ms | 🟢 Passed |
| **Total Requests Handled** | **1,63,920** | > 5,000 | 🟢 Passed |
| **Success Rate (2xx OK)** | **100.00%** | > 99.0% | 🟢 Passed |
| **Total Data Volume** | **153.36 MB** | — | 🟢 Active |

---

## 2. Response Time Distribution

```
Fastest Request:   21.0 ms
Average Response:  36.1 ms
90% of Requests:   <= 46.0 ms
Slowest Request:   231.0 ms
```

---

## 3. Performance Summary
Under a baseline load of **100 concurrent users** running continuously for **1 minute**, the Agro AI backend demonstrated stable high-throughput request handling with zero socket dropouts.

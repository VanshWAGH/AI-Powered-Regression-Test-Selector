package com.rts.rts_backend.testreport.service;

import com.rts.rts_backend.common.exception.ResourceNotFoundException;
import com.rts.rts_backend.common.util.IdGenerator;
import com.rts.rts_backend.common.util.TimeUtils;
import com.rts.rts_backend.repository.dao.RepositoryDao;
import com.rts.rts_backend.repository.model.Repository;
import com.rts.rts_backend.testreport.dao.TestReportDao;
import com.rts.rts_backend.testreport.model.TestReport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.InputStream;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TestReportService {

    private static final Logger log = LoggerFactory.getLogger(TestReportService.class);

    private final TestReportDao testReportDao;
    private final RepositoryDao repositoryDao;

    public TestReportService(TestReportDao testReportDao, RepositoryDao repositoryDao) {
        this.testReportDao = testReportDao;
        this.repositoryDao = repositoryDao;
    }

    /**
     * Parses a JUnit XML report file and persists the results.
     */
    @Transactional
    public int uploadJunitXml(UUID repositoryId, String commitSha, MultipartFile file) {
        Repository repo = repositoryDao.findById(repositoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Repository", repositoryId.toString()));

        List<TestReport> reports = new ArrayList<>();
        Instant now = TimeUtils.now();

        try (InputStream is = file.getInputStream()) {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            // Secure XML processing
            factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(is);
            
            NodeList testCases = doc.getElementsByTagName("testcase");
            for (int i = 0; i < testCases.getLength(); i++) {
                Element testCase = (Element) testCases.item(i);
                String className = testCase.getAttribute("classname");
                String methodName = testCase.getAttribute("name");
                String timeStr = testCase.getAttribute("time");
                
                long durationMs = 0;
                if (timeStr != null && !timeStr.isEmpty()) {
                    try {
                        durationMs = (long) (Double.parseDouble(timeStr) * 1000);
                    } catch (NumberFormatException ignored) {}
                }

                TestReport.TestStatus status = TestReport.TestStatus.PASSED;
                String failureMessage = null;

                if (testCase.getElementsByTagName("failure").getLength() > 0) {
                    status = TestReport.TestStatus.FAILED;
                    failureMessage = testCase.getElementsByTagName("failure").item(0).getTextContent();
                } else if (testCase.getElementsByTagName("error").getLength() > 0) {
                    status = TestReport.TestStatus.ERROR;
                    failureMessage = testCase.getElementsByTagName("error").item(0).getTextContent();
                } else if (testCase.getElementsByTagName("skipped").getLength() > 0) {
                    status = TestReport.TestStatus.SKIPPED;
                }

                TestReport report = new TestReport();
                report.setId(IdGenerator.newId());
                report.setRepositoryId(repositoryId);
                report.setCommitSha(commitSha);
                report.setClassName(className);
                report.setMethodName(methodName);
                report.setStatus(status);
                report.setDurationMs(durationMs);
                report.setFailureMessage(failureMessage != null ? truncate(failureMessage, 1000) : null);
                report.setCreatedAt(now);

                reports.add(report);
            }

            testReportDao.insertBatch(reports);
            log.info("Ingested {} test reports for repo {}, commit {}", reports.size(), repositoryId, commitSha);
            return reports.size();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JUnit XML report", e);
        }
    }

    private String truncate(String text, int maxLen) {
        if (text == null) return null;
        return text.length() > maxLen ? text.substring(0, maxLen) : text;
    }
}

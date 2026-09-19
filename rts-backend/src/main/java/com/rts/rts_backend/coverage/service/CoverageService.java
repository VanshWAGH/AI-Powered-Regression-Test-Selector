package com.rts.rts_backend.coverage.service;

import com.rts.rts_backend.common.exception.ResourceNotFoundException;
import com.rts.rts_backend.common.util.IdGenerator;
import com.rts.rts_backend.common.util.TimeUtils;
import com.rts.rts_backend.coverage.dao.CoverageDao;
import com.rts.rts_backend.coverage.model.CoverageDetail;
import com.rts.rts_backend.coverage.model.CoverageReport;
import com.rts.rts_backend.repository.dao.RepositoryDao;
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
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Parses JaCoCo XML reports and persists coverage data.
 */
@Service
public class CoverageService {

    private static final Logger log = LoggerFactory.getLogger(CoverageService.class);

    private final CoverageDao coverageDao;
    private final RepositoryDao repositoryDao;

    public CoverageService(CoverageDao coverageDao, RepositoryDao repositoryDao) {
        this.coverageDao = coverageDao;
        this.repositoryDao = repositoryDao;
    }

    @Transactional
    public int uploadJacocoXml(UUID repositoryId, String commitSha, MultipartFile file) {
        repositoryDao.findById(repositoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Repository", repositoryId.toString()));

        try (InputStream is = file.getInputStream()) {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(is);

            // Parse top-level counters for summary
            int totalLines = 0;
            int coveredLines = 0;
            double branchCoveragePct = 0.0;

            NodeList reportCounters = doc.getDocumentElement().getElementsByTagName("counter");
            for (int i = 0; i < reportCounters.getLength(); i++) {
                Element counter = (Element) reportCounters.item(i);
                // Only process direct children of <report>
                if (counter.getParentNode().equals(doc.getDocumentElement())) {
                    String type = counter.getAttribute("type");
                    int missed = Integer.parseInt(counter.getAttribute("missed"));
                    int covered = Integer.parseInt(counter.getAttribute("covered"));

                    if ("LINE".equals(type)) {
                        totalLines = missed + covered;
                        coveredLines = covered;
                    } else if ("BRANCH".equals(type)) {
                        int total = missed + covered;
                        branchCoveragePct = total > 0 ? (covered * 100.0) / total : 0.0;
                    }
                }
            }

            double linePct = totalLines > 0 ? (coveredLines * 100.0) / totalLines : 0.0;

            CoverageReport report = new CoverageReport();
            report.setId(IdGenerator.newId());
            report.setRepositoryId(repositoryId);
            report.setCommitSha(commitSha);
            report.setLineCoveragePct(linePct);
            report.setBranchCoveragePct(branchCoveragePct);
            report.setTotalLines(totalLines);
            report.setCoveredLines(coveredLines);
            report.setCreatedAt(TimeUtils.now());

            coverageDao.insertReport(report);

            // Parse per-class/method details
            List<CoverageDetail> details = new ArrayList<>();
            NodeList packages = doc.getElementsByTagName("package");
            for (int p = 0; p < packages.getLength(); p++) {
                Element pkg = (Element) packages.item(p);
                String packageName = pkg.getAttribute("name").replace('/', '.');

                NodeList classes = pkg.getElementsByTagName("class");
                for (int c = 0; c < classes.getLength(); c++) {
                    Element cls = (Element) classes.item(c);
                    String className = packageName + "." + cls.getAttribute("name").replace('/', '.');

                    NodeList methods = cls.getElementsByTagName("method");
                    for (int m = 0; m < methods.getLength(); m++) {
                        Element method = (Element) methods.item(m);
                        String methodName = method.getAttribute("name");
                        int line = parseInt(method.getAttribute("line"), -1);

                        // Check if method has LINE counter with covered > 0
                        boolean isCovered = false;
                        int hitCount = 0;
                        NodeList methodCounters = method.getElementsByTagName("counter");
                        for (int mc = 0; mc < methodCounters.getLength(); mc++) {
                            Element mcElem = (Element) methodCounters.item(mc);
                            if ("LINE".equals(mcElem.getAttribute("type"))) {
                                hitCount = Integer.parseInt(mcElem.getAttribute("covered"));
                                isCovered = hitCount > 0;
                            }
                        }

                        CoverageDetail detail = new CoverageDetail();
                        detail.setId(IdGenerator.newId());
                        detail.setCoverageReportId(report.getId());
                        detail.setClassName(className);
                        detail.setMethodName(methodName);
                        detail.setLineStart(line);
                        detail.setCovered(isCovered);
                        detail.setHitCount(hitCount);
                        details.add(detail);
                    }
                }
            }

            coverageDao.insertDetails(details);
            log.info("Ingested JaCoCo report for repo {}, commit {}: {}% line coverage, {} methods",
                    repositoryId, commitSha, String.format("%.1f", linePct), details.size());

            return details.size();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JaCoCo XML report", e);
        }
    }

    private static int parseInt(String s, int defaultVal) {
        try {
            return Integer.parseInt(s);
        } catch (NumberFormatException e) {
            return defaultVal;
        }
    }
}

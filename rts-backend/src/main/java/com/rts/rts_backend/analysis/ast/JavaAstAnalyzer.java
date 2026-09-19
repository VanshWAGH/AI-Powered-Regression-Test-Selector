package com.rts.rts_backend.analysis.ast;

import com.github.javaparser.StaticJavaParser;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.rts.rts_backend.analysis.model.JavaClassNode;
import com.rts.rts_backend.analysis.model.JavaMethodNode;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class JavaAstAnalyzer {

    /**
     * Parses the given Java source code string and extracts class and method metadata.
     */
    public List<JavaClassNode> analyzeSource(String sourceCode) {
        List<JavaClassNode> classes = new ArrayList<>();
        try {
            CompilationUnit cu = StaticJavaParser.parse(sourceCode);
            String packageName = cu.getPackageDeclaration()
                    .map(pd -> pd.getNameAsString())
                    .orElse("");

            cu.findAll(ClassOrInterfaceDeclaration.class).forEach(cid -> {
                String className = cid.getNameAsString();
                String fqn = packageName.isEmpty() ? className : packageName + "." + className;
                
                List<JavaMethodNode> methods = new ArrayList<>();
                cid.findAll(MethodDeclaration.class).forEach(md -> {
                    String methodName = md.getNameAsString();
                    String signature = md.getSignature().asString();
                    int startLine = md.getBegin().map(p -> p.line).orElse(-1);
                    int endLine = md.getEnd().map(p -> p.line).orElse(-1);
                    
                    List<String> annotations = md.getAnnotations().stream()
                            .map(a -> a.getNameAsString())
                            .toList();

                    methods.add(new JavaMethodNode(methodName, signature, startLine, endLine, annotations));
                });

                classes.add(new JavaClassNode(packageName, className, fqn, methods));
            });

        } catch (Exception e) {
            // Log and return empty if unparseable (e.g. syntax error in PR)
        }
        return classes;
    }
}

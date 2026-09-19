package com.rts.rts_backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * AES-256-GCM encryption for GitLab access tokens.
 *
 * <p>The encryption key is loaded from {@code rts.security.encryption-key}.
 * For production, use a strong 32-character key or inject from a secrets manager.
 *
 * <p>Ciphertext format: {@code [12-byte IV][encrypted data][16-byte GCM tag]}.
 */
@Component
public class TokenEncryptionService {

    private static final Logger log = LoggerFactory.getLogger(TokenEncryptionService.class);
    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 128; // bits

    private final SecretKeySpec keySpec;
    private final SecureRandom secureRandom = new SecureRandom();

    public TokenEncryptionService(@Value("${rts.security.encryption-key}") String encryptionKey) {
        // Derive a 32-byte key (AES-256). Pad or hash if necessary.
        byte[] keyBytes = normalizeKey(encryptionKey);
        this.keySpec = new SecretKeySpec(keyBytes, "AES");
        log.info("Token encryption service initialised");
    }

    /**
     * Encrypt a plaintext token.
     *
     * @param plaintext the GitLab access token
     * @return encrypted bytes (IV + ciphertext + tag)
     */
    public byte[] encrypt(String plaintext) {
        try {
            byte[] iv = new byte[GCM_IV_LENGTH];
            secureRandom.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, keySpec, new GCMParameterSpec(GCM_TAG_LENGTH, iv));

            byte[] ciphertext = cipher.doFinal(plaintext.getBytes(java.nio.charset.StandardCharsets.UTF_8));

            // Prepend IV to ciphertext
            ByteBuffer buffer = ByteBuffer.allocate(iv.length + ciphertext.length);
            buffer.put(iv);
            buffer.put(ciphertext);
            return buffer.array();
        } catch (Exception e) {
            throw new RuntimeException("Token encryption failed", e);
        }
    }

    /**
     * Decrypt an encrypted token.
     *
     * @param encrypted the encrypted bytes (IV + ciphertext + tag)
     * @return the original plaintext token
     */
    public String decrypt(byte[] encrypted) {
        try {
            ByteBuffer buffer = ByteBuffer.wrap(encrypted);
            byte[] iv = new byte[GCM_IV_LENGTH];
            buffer.get(iv);
            byte[] ciphertext = new byte[buffer.remaining()];
            buffer.get(ciphertext);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, keySpec, new GCMParameterSpec(GCM_TAG_LENGTH, iv));

            byte[] plaintext = cipher.doFinal(ciphertext);
            return new String(plaintext, java.nio.charset.StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Token decryption failed", e);
        }
    }

    /**
     * Normalise the config key to exactly 32 bytes for AES-256.
     */
    private static byte[] normalizeKey(String key) {
        byte[] raw = key.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        byte[] normalized = new byte[32];
        System.arraycopy(raw, 0, normalized, 0, Math.min(raw.length, 32));
        return normalized;
    }
}

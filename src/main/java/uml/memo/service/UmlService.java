package uml.memo.service;

import net.sourceforge.plantuml.SourceStringReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.Base64Utils;
import org.springframework.util.StreamUtils;
import uml.memo.controller.UmlController;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.zip.Deflater;
import java.util.zip.DeflaterOutputStream;
import java.util.zip.InflaterInputStream;

@Service
public class UmlService {
    private static final Logger LOGGER = LoggerFactory.getLogger(UmlController.class);

    public String encode(String uml) throws IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        Deflater deflater = new Deflater(Deflater.BEST_COMPRESSION);
        try (DeflaterOutputStream comp = new DeflaterOutputStream(buffer, deflater)) {
            StreamUtils.copy(uml, StandardCharsets.UTF_8, comp);
            comp.flush();
        }
        byte[] compressed = buffer.toByteArray();
        return Base64Utils.encodeToUrlSafeString(compressed);
    }

    public String decode(String encoded) throws IOException {
        byte[] compressed = Base64Utils.decodeFromUrlSafeString(encoded);
        new ByteArrayInputStream(compressed);
        try (InflaterInputStream decomp = new InflaterInputStream(new ByteArrayInputStream(compressed))) {
            return StreamUtils.copyToString(decomp, StandardCharsets.UTF_8);
        }
    }

    public byte[] generateImage(String uml) throws IOException {
        try (ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {
            SourceStringReader reader = new SourceStringReader(uml);
            String description = reader.generateImage(buffer);
            LOGGER.info(description);
            return buffer.toByteArray();
        }
    }
}
